#!/usr/bin/env node
// @ts-nocheck

/**
 * @packageDocumentation
 * Synchronize or validate the README rules table from the built plugin metadata.
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import builtPlugin from "../dist/plugin.js";
import {
    githubActionsConfigMetadataByName,
    githubActionsConfigNames,
    githubActionsConfigReferenceToName,
} from "../dist/_internal/github-actions-config-references.js";

const presetOrder = [...githubActionsConfigNames];
const rulesSectionHeading = "## Rules";
const presetDocsUrlBase =
    "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets";

const getPresetDocsPathSegment = (presetName) =>
    presetName.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

const getReadmePath = () =>
    resolve(fileURLToPath(new URL("..", import.meta.url)), "README.md");

const getReadmeRulesSectionBounds = (markdown) => {
    const startOffset = markdown.indexOf(rulesSectionHeading);

    if (startOffset < 0) {
        return null;
    }

    const nextHeadingOffset = markdown.indexOf(
        "\n## ",
        startOffset + rulesSectionHeading.length
    );

    return {
        endOffset: nextHeadingOffset < 0 ? markdown.length : nextHeadingOffset,
        startOffset,
    };
};

const getFixIndicator = (ruleModule) => {
    const fixable = ruleModule.meta?.fixable === "code";
    const hasSuggestions = ruleModule.meta?.hasSuggestions === true;

    if (fixable && hasSuggestions) {
        return "🔧 💡";
    }

    if (fixable) {
        return "🔧";
    }

    if (hasSuggestions) {
        return "💡";
    }

    return "—";
};

const normalizePresetName = (reference) => {
    if (Object.hasOwn(githubActionsConfigReferenceToName, reference)) {
        return githubActionsConfigReferenceToName[reference];
    }

    return presetOrder.includes(reference) ? reference : null;
};

const normalizeRulePresetNames = (ruleModule) => {
    const references = ruleModule.meta?.docs?.configs;
    const values = Array.isArray(references)
        ? references
        : references === undefined
          ? []
          : [references];

    const names = [];
    const seen = new Set();

    for (const reference of values) {
        if (typeof reference !== "string") {
            continue;
        }

        const presetName = normalizePresetName(reference);

        if (presetName !== null && !seen.has(presetName)) {
            seen.add(presetName);
            names.push(presetName);
        }
    }

    return names;
};

const createPresetLegendLines = () =>
    presetOrder.map((presetName) => {
        const metadata = githubActionsConfigMetadataByName[presetName];
        const docsUrl = `${presetDocsUrlBase}/${getPresetDocsPathSegment(presetName)}`;

        return `  - [${metadata.icon}](${docsUrl}) — \`github-actions.configs.${presetName}\``;
    });

const createRuleTableRow = ([ruleName, ruleModule]) => {
    const docsUrl = ruleModule.meta?.docs?.url;
    const presetIcons = normalizeRulePresetNames(ruleModule)
        .map((presetName) => {
            const metadata = githubActionsConfigMetadataByName[presetName];
            return `[${metadata.icon}](${presetDocsUrlBase}/${getPresetDocsPathSegment(presetName)})`;
        })
        .join(" ");

    return `| [\`${ruleName}\`](${docsUrl}) | ${getFixIndicator(ruleModule)} | ${presetIcons || "—"} |`;
};

export const generateReadmeRulesSectionFromRules = (rules) => {
    const ruleEntries = Object.entries(rules).toSorted((left, right) =>
        left[0].localeCompare(right[0])
    );

    return [
        rulesSectionHeading,
        "",
        "- `Fix` legend:",
        "  - `🔧` = autofixable",
        "  - `💡` = suggestions available",
        "  - `—` = report only",
        "- `Preset key` legend:",
        ...createPresetLegendLines(),
        "",
        "| Rule | Fix | Presets |",
        "| --- | :-: | --- |",
        ...ruleEntries.map(createRuleTableRow),
        "",
    ].join("\n");
};

export const syncReadmeRulesTable = async ({ check = false } = {}) => {
    const readmePath = getReadmePath();
    const currentReadme = await readFile(readmePath, "utf8");
    const generatedSection = generateReadmeRulesSectionFromRules(
        builtPlugin.rules
    );
    const bounds = getReadmeRulesSectionBounds(currentReadme);
    const nextReadme =
        bounds === null
            ? `${currentReadme.trimEnd()}\n\n${generatedSection}`
            : `${currentReadme.slice(0, bounds.startOffset)}${generatedSection}${currentReadme.slice(bounds.endOffset)}`;

    if (check) {
        if (currentReadme !== nextReadme) {
            throw new Error(
                "README rules section is out of sync. Run node scripts/sync-readme-rules-table.mjs."
            );
        }

        return;
    }

    await writeFile(readmePath, nextReadme, "utf8");
};

if (
    process.argv[1] !== undefined &&
    import.meta.url === pathToFileURL(process.argv[1]).href
) {
    await syncReadmeRulesTable({ check: process.argv.includes("--check") });
}
