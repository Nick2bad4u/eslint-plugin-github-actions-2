#!/usr/bin/env node

/**
 * @packageDocumentation
 * Generate and sync the canonical rules matrix used by README and docs.
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

/**
 * @typedef {{
 *     configs?: string | readonly string[];
 *     ruleId?: string;
 *     ruleNumber?: number;
 * }} MatrixRuleDocsMetadata
 */

/**
 * @typedef {{
 *     docs?: unknown;
 *     fixable?: unknown;
 *     hasSuggestions?: unknown;
 * }} MatrixRuleMeta
 */

/**
 * @typedef {{
 *     meta?: unknown;
 * }} MatrixRuleModule
 */

/**
 * @typedef {{
 *     rules: Record<string, unknown>;
 * }} MatrixPlugin
 */

const presetOrder = [...githubActionsConfigNames];
const matrixFilePath = resolve(
    fileURLToPath(new URL("..", import.meta.url)),
    "presets-matrix.md"
);

/**
 * @param {string} text
 *
 * @returns {string}
 */
const toWindowsLineEndings = (text) => text.replaceAll("\n", "\r\n");

/**
 * @param {(typeof presetOrder)[number]} presetName
 *
 * @returns {string}
 */
export const getPresetDocsSlug = (presetName) =>
    presetName.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`);

/**
 * @param {unknown} value
 *
 * @returns {value is Record<string, unknown>}
 */
const isRecord = (value) => value !== null && typeof value === "object";

/**
 * @param {unknown} ruleModule
 *
 * @returns {MatrixRuleMeta | undefined}
 */
const getRuleMeta = (ruleModule) => {
    if (!isRecord(ruleModule)) {
        return undefined;
    }

    const meta = ruleModule["meta"];

    return isRecord(meta) ? meta : undefined;
};

/**
 * @param {unknown} ruleModule
 *
 * @returns {MatrixRuleDocsMetadata | undefined}
 */
const getRuleDocsMetadata = (ruleModule) => {
    const meta = getRuleMeta(ruleModule);
    const docs = meta?.docs;

    return isRecord(docs) ? docs : undefined;
};

/**
 * @param {string} reference
 *
 * @returns {(typeof presetOrder)[number] | null}
 */
const normalizePresetName = (reference) => {
    if (Object.hasOwn(githubActionsConfigReferenceToName, reference)) {
        const presetName =
            githubActionsConfigReferenceToName[
                /** @type {keyof typeof githubActionsConfigReferenceToName} */ (
                    reference
                )
            ];

        return presetName ?? null;
    }

    if (Object.hasOwn(githubActionsConfigMetadataByName, reference)) {
        return /** @type {(typeof presetOrder)[number]} */ (reference);
    }

    return null;
};

/**
 * @param {unknown} ruleModule
 *
 * @returns {(typeof presetOrder)[number][]}
 */
const normalizeRulePresetNames = (ruleModule) => {
    const references = getRuleDocsMetadata(ruleModule)?.configs;
    let values;

    if (Array.isArray(references)) {
        values = references;
    } else if (references === undefined) {
        values = [];
    } else {
        values = [references];
    }

    /** @type {(typeof presetOrder)[number][]} */
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

/**
 * @param {unknown} ruleModule
 *
 * @returns {string}
 */
const getRuleId = (ruleModule) => {
    const docsMetadata = getRuleDocsMetadata(ruleModule);

    if (typeof docsMetadata?.ruleId === "string") {
        return docsMetadata.ruleId;
    }

    if (typeof docsMetadata?.ruleNumber === "number") {
        return `R${String(docsMetadata.ruleNumber).padStart(3, "0")}`;
    }

    return "R???";
};

/**
 * @param {unknown} ruleModule
 *
 * @returns {"🔧 💡" | "🔧" | "💡" | "—"}
 */
const getRuleFixLegendCell = (ruleModule) => {
    const meta = getRuleMeta(ruleModule);
    const isAutofixable = meta?.fixable !== undefined;
    const hasSuggestions = meta?.hasSuggestions === true;

    if (isAutofixable && hasSuggestions) {
        return "🔧 💡";
    }

    if (isAutofixable) {
        return "🔧";
    }

    if (hasSuggestions) {
        return "💡";
    }

    return "—";
};

const createHeaderRow = () => "| Rule | Fix | Preset key |";

const createDividerRow = () => "| --- | :-: | --- |";

const createFixLegendSection = () => [
    "Fix legend:",
    "",
    "- 🔧 = autofixable",
    "- 💡 = suggestions available",
    "- — = report only",
    "",
];

/**
 * @param {(typeof presetOrder)[number]} presetName
 * @param {((
 *           presetName: (typeof presetOrder)[number],
 *           metadata: {
 *               description: string;
 *               files: readonly string[];
 *               icon: string;
 *               presetName: string;
 *           }
 *       ) => string)
 *     | undefined} createPresetHref
 *
 * @returns {string}
 */
const createPresetIconReference = (presetName, createPresetHref) => {
    const metadata = githubActionsConfigMetadataByName[presetName];
    const presetHref = createPresetHref?.(presetName, metadata);

    return typeof presetHref === "string"
        ? `[${metadata.icon}](${presetHref})`
        : metadata.icon;
};

/**
 * @param {((
 *           presetName: (typeof presetOrder)[number],
 *           metadata: {
 *               description: string;
 *               files: readonly string[];
 *               icon: string;
 *               presetName: string;
 *           }
 *       ) => string)
 *     | undefined} createPresetHref
 *
 * @returns {string[]}
 */
const createPresetKeyLegendSection = (createPresetHref) => [
    "Preset key legend:",
    "",
    ...presetOrder.map((presetName) => {
        const metadata = githubActionsConfigMetadataByName[presetName];
        const presetHref = createPresetHref?.(presetName, metadata);
        const presetReference =
            typeof presetHref === "string"
                ? `[\`githubActions.configs.${presetName}\`](${presetHref})`
                : `\`githubActions.configs.${presetName}\``;

        return `- ${createPresetIconReference(presetName, createPresetHref)} — ${presetReference}`;
    }),
    "",
];

/**
 * @param {string} ruleName
 * @param {unknown} ruleModule
 * @param {((ruleName: string, ruleModule: unknown) => string) | undefined} createRuleReference
 *
 * @returns {string}
 */
const createRuleCell = (ruleName, ruleModule, createRuleReference) => {
    const ruleId = getRuleId(ruleModule);
    const ruleReference =
        createRuleReference?.(ruleName, ruleModule) ?? `\`${ruleName}\``;

    return `<span class="sb-inline-rule-number">${ruleId}</span> ${ruleReference}`;
};

/**
 * @param {[string, unknown]} matrixEntry
 * @param {((ruleName: string, ruleModule: unknown) => string) | undefined} createRuleReference
 * @param {((
 *           presetName: (typeof presetOrder)[number],
 *           metadata: {
 *               description: string;
 *               files: readonly string[];
 *               icon: string;
 *               presetName: string;
 *           }
 *       ) => string)
 *     | undefined} createPresetHref
 *
 * @returns {string}
 */
const createMatrixRow = (
    [ruleName, ruleModule],
    createRuleReference,
    createPresetHref
) => {
    const presetNames = normalizeRulePresetNames(ruleModule);
    const presetIcons = presetNames
        .map((presetName) =>
            createPresetIconReference(presetName, createPresetHref)
        )
        .join(" ");

    return [
        `| ${createRuleCell(ruleName, ruleModule, createRuleReference)} |`,
        ` ${getRuleFixLegendCell(ruleModule)} |`,
        ` ${presetIcons.length > 0 ? presetIcons : "—"} |`,
    ].join("");
};

/**
 * @param {Record<string, unknown>} rules
 * @param {{
 *     createRuleReference?:
 *         | ((ruleName: string, ruleModule: unknown) => string)
 *         | undefined;
 *     createPresetHref?:
 *         | ((
 *               presetName: (typeof presetOrder)[number],
 *               metadata: {
 *                   description: string;
 *                   files: readonly string[];
 *                   icon: string;
 *                   presetName: string;
 *               }
 *           ) => string)
 *         | undefined;
 * }} [options]
 *
 * @returns {string}
 */
export const generatePresetRulesMatrixFromRules = (rules, options = {}) => {
    const rows = Object.entries(rules).toSorted((left, right) =>
        left[0].localeCompare(right[0])
    );

    return [
        ...createFixLegendSection(),
        ...createPresetKeyLegendSection(options.createPresetHref),
        createHeaderRow(),
        createDividerRow(),
        ...rows.map((entry) =>
            createMatrixRow(
                entry,
                options.createRuleReference,
                options.createPresetHref
            )
        ),
    ].join("\n");
};

/**
 * @param {Record<string, unknown>} rules
 * @param {(typeof presetOrder)[number]} presetName
 *
 * @returns {Record<string, unknown>}
 */
export const filterRulesByPresetName = (rules, presetName) =>
    Object.fromEntries(
        Object.entries(rules).filter(([, ruleModule]) =>
            normalizeRulePresetNames(ruleModule).includes(presetName)
        )
    );

const createPresetPageHeaderRow = () => "| Rule | Fix |";

const createPresetPageDividerRow = () => "| --- | :-: |";

/**
 * @param {Record<string, unknown>} rules
 * @param {(typeof presetOrder)[number]} presetName
 * @param {{
 *     createRuleReference?:
 *         | ((ruleName: string, ruleModule: unknown) => string)
 *         | undefined;
 * }} [options]
 *
 * @returns {string}
 */
export const generatePresetPageRulesTableFromRules = (
    rules,
    presetName,
    options = {}
) => {
    const filteredRules = filterRulesByPresetName(rules, presetName);
    const rows = Object.entries(filteredRules).toSorted((left, right) =>
        left[0].localeCompare(right[0])
    );

    return [
        ...createFixLegendSection(),
        createPresetPageHeaderRow(),
        createPresetPageDividerRow(),
        ...rows.map(([ruleName, ruleModule]) =>
            [
                `| ${createRuleCell(
                    ruleName,
                    ruleModule,
                    options.createRuleReference
                )} |`,
                ` ${getRuleFixLegendCell(ruleModule)} |`,
            ].join("")
        ),
    ].join("\n");
};

/**
 * @param {MatrixPlugin} [plugin] - Plugin data source (defaults to the built
 *   plugin export).
 * @param {{
 *     createRuleReference?:
 *         | ((ruleName: string, ruleModule: unknown) => string)
 *         | undefined;
 *     createPresetHref?:
 *         | ((
 *               presetName: (typeof presetOrder)[number],
 *               metadata: {
 *                   description: string;
 *                   files: readonly string[];
 *                   icon: string;
 *                   presetName: string;
 *               }
 *           ) => string)
 *         | undefined;
 * }} [options]
 *
 * @returns {string}
 */
export const generatePresetRulesMatrixFromPlugin = (
    plugin = builtPlugin,
    options = {}
) => generatePresetRulesMatrixFromRules(plugin.rules, options);

/**
 * @param {{ check?: boolean }} [options]
 *
 * @returns {Promise<void>}
 */
export const syncPresetRulesMatrix = async ({ check = false } = {}) => {
    const currentMatrix = await readFile(matrixFilePath, "utf8");
    const generatedMatrix = toWindowsLineEndings(
        `${generatePresetRulesMatrixFromPlugin(builtPlugin, {
            createPresetHref: (presetName) =>
                `./docs/rules/presets/${getPresetDocsSlug(presetName)}.md`,
            createRuleReference: (ruleName) =>
                `[\`${ruleName}\`](./docs/rules/${ruleName}.md)`,
        })}
`
    );

    if (check) {
        if (currentMatrix !== generatedMatrix) {
            throw new Error(
                "presets-matrix.md is out of sync. Run node scripts/sync-presets-rules-matrix.mjs."
            );
        }

        return;
    }

    if (currentMatrix !== generatedMatrix) {
        await writeFile(matrixFilePath, generatedMatrix, "utf8");
    }
};

if (
    process.argv[1] !== undefined &&
    import.meta.url === pathToFileURL(process.argv[1]).href
) {
    await syncPresetRulesMatrix({ check: process.argv.includes("--check") });
}
