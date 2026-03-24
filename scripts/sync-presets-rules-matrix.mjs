#!/usr/bin/env node

/**
 * @packageDocumentation
 * Generate a Markdown matrix of GitHub Actions rules by preset from the built plugin metadata.
 */

import builtPlugin from "../dist/plugin.js";
import {
    githubActionsConfigMetadataByName,
    githubActionsConfigNames,
} from "../dist/_internal/github-actions-config-references.js";

/**
 * @typedef {{
 *     meta?: {
 *         docs?: object | undefined;
 *     };
 * }} MatrixRuleModule
 */

/**
 * @typedef {{
 *     rules: Record<string, MatrixRuleModule>;
 * }} MatrixPlugin
 */

const presetOrder = [...githubActionsConfigNames];

const createHeaderRow = () =>
    [
        "| Rule |",
        ...presetOrder.map(
            (presetName) =>
                ` ${githubActionsConfigMetadataByName[presetName].icon} ${presetName} |`
        ),
    ].join("");

const createDividerRow = () =>
    ["| --- |", ...presetOrder.map(() => " :-: |")].join("");

/**
 * @param {[string, MatrixRuleModule]} matrixEntry
 *
 * @returns {string}
 */
const createMatrixRow = ([ruleName, ruleModule]) => {
    /** @type {unknown} */
    let docsConfigs;

    const docsMetadata = ruleModule.meta?.docs;

    if (
        docsMetadata !== undefined &&
        typeof docsMetadata === "object" &&
        "configs" in docsMetadata
    ) {
        docsConfigs = docsMetadata.configs;
    }

    /** @type {unknown[]} */
    const presetReferences = [];

    if (Array.isArray(docsConfigs)) {
        presetReferences.push(...docsConfigs);
    } else if (docsConfigs !== undefined) {
        presetReferences.push(docsConfigs);
    }

    const presetRefs = new Set(presetReferences);

    const cells = presetOrder.map((presetName) =>
        presetRefs.has(`github-actions.configs.${presetName}`) ||
        presetRefs.has(presetName)
            ? " ✅ |"
            : " — |"
    );

    return [`| \`${ruleName}\` |`, ...cells].join("");
};

/**
 * @param {MatrixPlugin} [plugin] - Plugin data source (defaults to the built
 *   plugin export).
 *
 * @returns {string}
 */
export const generatePresetRulesMatrixFromPlugin = (plugin = builtPlugin) => {
    const rows = Object.entries(plugin.rules).toSorted((left, right) =>
        left[0].localeCompare(right[0])
    );

    return [
        createHeaderRow(),
        createDividerRow(),
        ...rows.map(createMatrixRow),
    ].join("\n");
};

if (process.argv[1] !== undefined) {
    console.log(generatePresetRulesMatrixFromPlugin());
}
