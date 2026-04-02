/**
 * @packageDocumentation
 * YAML helpers for `.github/dependabot.yml` configuration files.
 */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- YAML AST nodes come from parser-owned mutable types shared across helper boundaries. */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { isDependabotFile } from "./lint-targets.js";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getMappingValueAsSequence,
    getScalarStringValue,
    getWorkflowRoot,
    unwrapYamlValue,
} from "./workflow-yaml.js";

/** String scalar entry contained in a YAML sequence. */
export type DependabotStringSequenceEntry = {
    readonly node: AST.YAMLNode;
    readonly value: string;
};

/** Dependabot update block paired with derived metadata useful for reporting. */
export type DependabotUpdateEntry = {
    readonly index: number;
    readonly mapping: AST.YAMLMapping;
    readonly multiEcosystemGroup: null | string;
    readonly node: AST.YAMLContent | AST.YAMLWithMeta;
    readonly packageEcosystem: null | string;
};

/** Resolve the root mapping for a Dependabot configuration file. */
export const getDependabotRoot = (
    context: Rule.RuleContext
): AST.YAMLMapping | null =>
    isDependabotFile(context.filename) ? getWorkflowRoot(context) : null;

/** Collect every valid update mapping under the top-level `updates` sequence. */
export const getDependabotUpdateEntries = (
    root: AST.YAMLMapping
): readonly DependabotUpdateEntry[] => {
    const updatesSequence = getMappingValueAsSequence(root, "updates");

    if (updatesSequence === null) {
        return [];
    }

    const entries: DependabotUpdateEntry[] = [];

    for (const [index, entry] of updatesSequence.entries.entries()) {
        const updateMapping = unwrapYamlValue(entry);

        if (entry === null || entry === undefined) {
            continue;
        }

        if (updateMapping?.type !== "YAMLMapping") {
            continue;
        }

        entries.push({
            index: index + 1,
            mapping: updateMapping,
            multiEcosystemGroup: getScalarStringValue(
                getMappingPair(updateMapping, "multi-ecosystem-group")?.value
            ),
            node: entry,
            packageEcosystem: getScalarStringValue(
                getMappingPair(updateMapping, "package-ecosystem")?.value
            ),
        });
    }

    return entries;
};

/** Resolve a named multi-ecosystem-group mapping by its declared group key. */
export const getDependabotMultiEcosystemGroup = (
    root: AST.YAMLMapping,
    groupName: string
): AST.YAMLMapping | null => {
    const groupsMapping = getMappingValueAsMapping(
        root,
        "multi-ecosystem-groups"
    );

    if (groupsMapping === null) {
        return null;
    }

    for (const pair of groupsMapping.pairs) {
        if (getScalarStringValue(pair.key) !== groupName) {
            continue;
        }

        const groupMapping = unwrapYamlValue(pair.value);

        return groupMapping?.type === "YAMLMapping" ? groupMapping : null;
    }

    return null;
};

/** Resolve the referenced multi-ecosystem-group mapping for an update entry. */
export const getDependabotReferencedGroup = (
    root: AST.YAMLMapping,
    update: DependabotUpdateEntry
): AST.YAMLMapping | null =>
    update.multiEcosystemGroup === null
        ? null
        : getDependabotMultiEcosystemGroup(root, update.multiEcosystemGroup);

/**
 * Resolve an update-scoped value, falling back to the referenced group when
 * present.
 */
export const getEffectiveDependabotUpdateValue = (
    root: AST.YAMLMapping,
    update: DependabotUpdateEntry,
    key: string
): AST.YAMLContent | AST.YAMLWithMeta | null => {
    const directValue = getMappingPair(update.mapping, key)?.value ?? null;

    if (directValue !== null) {
        return directValue;
    }

    return (
        getMappingPair(
            getDependabotReferencedGroup(root, update) ?? update.mapping,
            key
        )?.value ?? null
    );
};

/**
 * Resolve an update-scoped mapping value, honoring multi-ecosystem-group
 * fallback.
 */
export const getEffectiveDependabotUpdateMapping = (
    root: AST.YAMLMapping,
    update: DependabotUpdateEntry,
    key: string
): AST.YAMLMapping | null => {
    const value = unwrapYamlValue(
        getEffectiveDependabotUpdateValue(root, update, key)
    );

    return value?.type === "YAMLMapping" ? value : null;
};

/** Collect all non-empty string entries from a YAML sequence. */
export const getNonEmptyStringSequenceEntries = (
    node: AST.YAMLContent | AST.YAMLWithMeta | null | undefined
): readonly DependabotStringSequenceEntry[] => {
    const sequence = unwrapYamlValue(node ?? null);

    if (sequence?.type !== "YAMLSequence") {
        return [];
    }

    const entries: DependabotStringSequenceEntry[] = [];

    for (const entry of sequence.entries) {
        const stringValue = getScalarStringValue(entry)?.trim();

        if (
            stringValue === undefined ||
            stringValue === null ||
            stringValue.length === 0 ||
            entry === null ||
            entry === undefined
        ) {
            continue;
        }

        entries.push({
            node: entry,
            value: stringValue,
        });
    }

    return entries;
};

/** Describe an update entry for human-readable diagnostics. */
export const getDependabotUpdateLabel = (
    update: DependabotUpdateEntry
): string =>
    update.packageEcosystem === null
        ? `updates[${String(update.index)}]`
        : `updates[${String(update.index)}] (${update.packageEcosystem})`;

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable readonly-parameter checks outside parser AST helper signatures. */
