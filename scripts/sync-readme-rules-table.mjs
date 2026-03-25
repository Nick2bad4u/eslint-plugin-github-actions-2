#!/usr/bin/env node
// @ts-nocheck

/**
 * @packageDocumentation
 * Synchronize or validate matrix sections in README and docs from plugin metadata.
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import builtPlugin from "../dist/plugin.js";
import {
    generatePresetRulesMatrixFromRules,
    syncPresetRulesMatrix,
} from "./sync-presets-rules-matrix.mjs";

const rulesSectionHeading = "## Rules";
const presetsIndexMatrixHeading = "## Rule Matrix";

const getReadmePath = () =>
    resolve(fileURLToPath(new URL("..", import.meta.url)), "README.md");

const getPresetsIndexPath = () =>
    resolve(
        fileURLToPath(new URL("..", import.meta.url)),
        "docs/rules/presets/index.md"
    );

const getSectionBounds = (markdown, sectionHeading) => {
    const startOffset = markdown.indexOf(sectionHeading);

    if (startOffset < 0) {
        return null;
    }

    const nextHeadingOffset = markdown.indexOf(
        "\n## ",
        startOffset + sectionHeading.length
    );

    return {
        endOffset: nextHeadingOffset < 0 ? markdown.length : nextHeadingOffset,
        startOffset,
    };
};

export const generateReadmeRulesSectionFromRules = (rules) => {
    const matrix = generatePresetRulesMatrixFromRules(rules, {
        createRuleReference: (ruleName, ruleModule) => {
            const docsUrl = ruleModule.meta?.docs?.url;

            return typeof docsUrl === "string"
                ? `[\`${ruleName}\`](${docsUrl})`
                : `\`${ruleName}\``;
        },
    });

    return [
        rulesSectionHeading,
        "",
        matrix,
        "",
    ].join("\n");
};

export const generatePresetsIndexMatrixSectionFromRules = (rules) => {
    const matrix = generatePresetRulesMatrixFromRules(rules, {
        createRuleReference: (ruleName) =>
            `[\`${ruleName}\`](../${ruleName}.md)`,
    });

    return [
        presetsIndexMatrixHeading,
        "",
        matrix,
        "",
    ].join("\n");
};

const writeSection = async ({
    check,
    filePath,
    missingSectionError,
    sectionHeading,
    sectionMarkdown,
}) => {
    const currentMarkdown = await readFile(filePath, "utf8");
    const bounds = getSectionBounds(currentMarkdown, sectionHeading);

    if (bounds === null) {
        throw new Error(missingSectionError);
    }

    const nextMarkdown = `${currentMarkdown.slice(0, bounds.startOffset)}${sectionMarkdown}${currentMarkdown.slice(bounds.endOffset)}`;

    if (check) {
        if (currentMarkdown !== nextMarkdown) {
            throw new Error(
                `${filePath} is out of sync. Run node scripts/sync-readme-rules-table.mjs.`
            );
        }

        return;
    }

    if (currentMarkdown !== nextMarkdown) {
        await writeFile(filePath, nextMarkdown, "utf8");
    }
};

export const syncReadmeRulesTable = async ({ check = false } = {}) => {
    const readmePath = getReadmePath();
    const presetsIndexPath = getPresetsIndexPath();

    await writeSection({
        check,
        filePath: readmePath,
        missingSectionError: "README rules section heading not found.",
        sectionHeading: rulesSectionHeading,
        sectionMarkdown: generateReadmeRulesSectionFromRules(builtPlugin.rules),
    });

    await writeSection({
        check,
        filePath: presetsIndexPath,
        missingSectionError: "Presets index matrix heading not found.",
        sectionHeading: presetsIndexMatrixHeading,
        sectionMarkdown: generatePresetsIndexMatrixSectionFromRules(
            builtPlugin.rules
        ),
    });

    await syncPresetRulesMatrix({ check });
};

if (
    process.argv[1] !== undefined &&
    import.meta.url === pathToFileURL(process.argv[1]).href
) {
    await syncReadmeRulesTable({ check: process.argv.includes("--check") });
}
