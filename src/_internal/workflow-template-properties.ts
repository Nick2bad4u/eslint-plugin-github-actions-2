/**
 * @packageDocumentation
 * Helpers for reading workflow-template metadata from `.properties.json` files.
 */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- YAML parser AST nodes are third-party mutable structures; readonly wrappers reduce interoperability across helper APIs. */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { dirname, join } from "node:path";
import { isDefined } from "ts-extras";

import {
    getMappingPair,
    getMappingValueAsSequence,
    getScalarStringValue,
    getWorkflowRoot,
} from "./workflow-yaml.js";

/** Read and return the template metadata root mapping if present. */
export const getWorkflowTemplatePropertiesRoot = (
    context: Rule.RuleContext
): AST.YAMLMapping | null => getWorkflowRoot(context);

/** Read a scalar string property from workflow-template metadata. */
export const getWorkflowTemplateStringProperty = (
    root: AST.YAMLMapping,
    key: string
): null | string => getScalarStringValue(getMappingPair(root, key)?.value);

/** Resolve `filePatterns` entries with both node and scalar string value. */
export const getWorkflowTemplateFilePatternEntries = (
    root: AST.YAMLMapping
): readonly Readonly<{ node: AST.YAMLNode; value: string }>[] => {
    const filePatternsSequence = getMappingValueAsSequence(
        root,
        "filePatterns"
    );

    if (filePatternsSequence === null) {
        return [];
    }

    const entries: Readonly<{ node: AST.YAMLNode; value: string }>[] = [];

    for (const entry of filePatternsSequence.entries) {
        const entryValue = getScalarStringValue(entry);

        if (entryValue === null || entry === null || !isDefined(entry)) {
            continue;
        }

        entries.push({
            node: entry,
            value: entryValue,
        });
    }

    return entries;
};
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable readonly-parameter checks outside parser AST helper signatures. */

/** Build the matching `.properties.json` path for a template YAML path. */
export const getPairedTemplatePropertiesPath = (filePath: string): string => {
    const stem = filePath.endsWith(".yaml")
        ? filePath.slice(0, -".yaml".length)
        : filePath.slice(0, -".yml".length);

    return `${stem}.properties.json`;
};

/** Build both valid template YAML paths for a `.properties.json` path. */
export const getPairedTemplateYamlPaths = (
    filePath: string
): readonly [string, string] => {
    const fileDirectory = dirname(filePath);
    const fileName = filePath.slice(fileDirectory.length + 1);
    const stem = fileName.slice(0, -".properties.json".length);

    return [
        join(fileDirectory, `${stem}.yml`),
        join(fileDirectory, `${stem}.yaml`),
    ];
};
