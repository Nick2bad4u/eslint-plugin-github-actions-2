#!/usr/bin/env node
// @ts-nocheck

/**
 * @packageDocumentation
 * Generate a Markdown matrix of GitHub Actions rules by preset from the built plugin metadata.
 */

import builtPlugin from "../dist/plugin.js";
import {
    githubActionsConfigMetadataByName,
    githubActionsConfigNames,
} from "../dist/_internal/github-actions-config-references.js";

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

const createMatrixRow = ([ruleName, ruleModule]) => {
    const presetRefs = new Set(
        Array.isArray(ruleModule.meta?.docs?.configs)
            ? ruleModule.meta.docs.configs
            : ruleModule.meta?.docs?.configs === undefined
              ? []
              : [ruleModule.meta.docs.configs]
    );

    const cells = presetOrder.map((presetName) =>
        presetRefs.has(`github-actions.configs.${presetName}`) ||
        presetRefs.has(presetName)
            ? " ✅ |"
            : " — |"
    );

    return [`| \`${ruleName}\` |`, ...cells].join("");
};

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
