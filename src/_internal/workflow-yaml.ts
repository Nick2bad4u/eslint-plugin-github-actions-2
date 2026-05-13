/**
 * @packageDocumentation
 * Shared YAML AST helpers for GitHub Actions workflow rules.
 */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- YAML AST nodes come from parser-owned mutable types shared across helper boundaries. */
import type { Rule } from "eslint";
import type { UnknownRecord } from "type-fest";
import type { AST } from "yaml-eslint-parser";

import { isPresent, keyIn } from "ts-extras";

/** Default workflow globs used by the exported flat configs. */
export const WORKFLOW_FILE_GLOBS: readonly string[] = [
    ".github/workflows/*.{yml,yaml}",
];

/** Workflow job mapping paired with its stable identifier key. */
export interface WorkflowJobEntry {
    readonly id: string;
    readonly idNode: WorkflowYamlValueNode;
    readonly mapping: AST.YAMLMapping;
    readonly pair: AST.YAMLPair;
}

/** YAML value node type used by workflow helper APIs. */
type WorkflowYamlValueNode = AST.YAMLContent | AST.YAMLWithMeta;

/** Narrow an unknown value to a non-null object record. */
const isUnknownRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null;

/** Determine whether an unknown node is a workflow YAML value node. */
const isWorkflowYamlValueNode = (
    value: unknown
): value is WorkflowYamlValueNode => {
    if (!isUnknownRecord(value) || !keyIn(value, "type")) {
        return false;
    }

    const nodeType = Reflect.get(value, "type");

    return (
        nodeType === "YAMLAlias" ||
        nodeType === "YAMLMapping" ||
        nodeType === "YAMLScalar" ||
        nodeType === "YAMLSequence" ||
        nodeType === "YAMLWithMeta"
    );
};

/** Narrow an unknown parser AST node to a YAML program. */
const isYamlProgram = (node: unknown): node is AST.YAMLProgram =>
    isUnknownRecord(node) &&
    Reflect.get(node, "type") === "Program" &&
    Array.isArray(Reflect.get(node, "body"));

/** Narrow a YAML node to `YAMLWithMeta`. */
export const isYamlWithMeta = (
    node: AST.YAMLContent | AST.YAMLNode | AST.YAMLWithMeta | null | undefined
): node is AST.YAMLWithMeta => node?.type === "YAMLWithMeta";

/** Unwrap `YAMLWithMeta` wrappers until the underlying YAML value is reached. */
export const unwrapYamlValue = (
    node: null | undefined | WorkflowYamlValueNode
): AST.YAMLContent | null => {
    if (!isPresent(node)) {
        return null;
    }

    if (isYamlWithMeta(node)) {
        return unwrapYamlValue(node.value);
    }

    return node;
};

/** Narrow a YAML node to a mapping. */
export const isYamlMapping = (
    node: null | undefined | WorkflowYamlValueNode
): node is AST.YAMLMapping => unwrapYamlValue(node)?.type === "YAMLMapping";

/** Narrow a YAML node to a sequence. */
export const isYamlSequence = (
    node: null | undefined | WorkflowYamlValueNode
): node is AST.YAMLSequence => unwrapYamlValue(node)?.type === "YAMLSequence";

/** Narrow a YAML node to a scalar. */
export const isYamlScalar = (
    node: null | undefined | WorkflowYamlValueNode
): node is AST.YAMLScalar => unwrapYamlValue(node)?.type === "YAMLScalar";

/** Resolve the first document's root mapping when linting a workflow file. */
export const getWorkflowRoot = (
    context: Rule.RuleContext
): AST.YAMLMapping | null => {
    const programNode = context.sourceCode.ast;

    if (!isYamlProgram(programNode)) {
        return null;
    }

    const program = programNode;
    const [document] = program.body;
    let documentContent: null | WorkflowYamlValueNode = null;

    if (isPresent(document)) {
        const contentCandidate: unknown = Reflect.get(document, "content");

        if (isWorkflowYamlValueNode(contentCandidate)) {
            documentContent = contentCandidate;
        }
    }

    const rootNode = unwrapYamlValue(documentContent);

    return rootNode?.type === "YAMLMapping" ? rootNode : null;
};

/** Read a scalar node as a string when possible. */
export const getScalarStringValue = (
    node: null | undefined | WorkflowYamlValueNode
): null | string => {
    const unwrappedNode = unwrapYamlValue(node);

    if (unwrappedNode?.type !== "YAMLScalar") {
        return null;
    }

    if (typeof unwrappedNode.value === "string") {
        return unwrappedNode.value;
    }

    const scalarStringValue: unknown =
        isUnknownRecord(unwrappedNode) && keyIn(unwrappedNode, "strValue")
            ? Reflect.get(unwrappedNode, "strValue")
            : null;

    return typeof scalarStringValue === "string" ? scalarStringValue : null;
};

/** Read a scalar node as a number when possible. */
export const getScalarNumberValue = (
    node: null | undefined | WorkflowYamlValueNode
): null | number => {
    const unwrappedNode = unwrapYamlValue(node);

    if (unwrappedNode?.type !== "YAMLScalar") {
        return null;
    }

    return typeof unwrappedNode.value === "number" ? unwrappedNode.value : null;
};

/** Determine whether a scalar is a GitHub expression string like `${{ ... }}`. */
export const isGithubExpressionScalar = (
    node: null | undefined | WorkflowYamlValueNode
): boolean => {
    const scalarValue = getScalarStringValue(node);

    return (
        scalarValue !== null &&
        scalarValue.trimStart().startsWith("${{") &&
        scalarValue.trimEnd().endsWith("}}")
    );
};

/** Find a mapping pair by its exact scalar key. */
export const getMappingPair = (
    mapping: AST.YAMLMapping,
    key: string
): AST.YAMLPair | null => {
    for (const pair of mapping.pairs) {
        if (getScalarStringValue(pair.key) === key) {
            return pair;
        }
    }

    return null;
};

/** Resolve a mapping child by key, ensuring the value is a mapping. */
export const getMappingValueAsMapping = (
    mapping: AST.YAMLMapping,
    key: string
): AST.YAMLMapping | null => {
    const pair = getMappingPair(mapping, key);
    const valueNode = unwrapYamlValue(pair?.value ?? null);

    return valueNode?.type === "YAMLMapping" ? valueNode : null;
};

/** Resolve a mapping child by key, ensuring the value is a sequence. */
export const getMappingValueAsSequence = (
    mapping: AST.YAMLMapping,
    key: string
): AST.YAMLSequence | null => {
    const pair = getMappingPair(mapping, key);
    const valueNode = unwrapYamlValue(pair?.value ?? null);

    return valueNode?.type === "YAMLSequence" ? valueNode : null;
};

/** Enumerate workflow jobs under `jobs`. */
export const getWorkflowJobs = (
    root: AST.YAMLMapping
): readonly WorkflowJobEntry[] => {
    const jobsMapping = getMappingValueAsMapping(root, "jobs");

    if (jobsMapping === null) {
        return [];
    }

    const jobs: WorkflowJobEntry[] = [];

    for (const pair of jobsMapping.pairs) {
        const jobId = getScalarStringValue(pair.key);
        const jobMapping = unwrapYamlValue(pair.value);

        if (jobId === null || jobMapping?.type !== "YAMLMapping") {
            continue;
        }

        if (!isPresent(pair.key)) {
            continue;
        }

        jobs.push({
            id: jobId,
            idNode: pair.key,
            mapping: jobMapping,
            pair,
        });
    }

    return jobs;
};

/** Collect the workflow event names declared under `on`. */
export const getWorkflowEventNames = (
    root: AST.YAMLMapping
): ReadonlySet<string> => {
    const onPair = getMappingPair(root, "on");
    const onValue = unwrapYamlValue(onPair?.value ?? null);
    const eventNames = new Set<string>();

    if (onValue === null) {
        return eventNames;
    }

    if (onValue.type === "YAMLScalar") {
        const eventName = getScalarStringValue(onValue);

        if (eventName !== null) {
            eventNames.add(eventName);
        }

        return eventNames;
    }

    if (onValue.type === "YAMLSequence") {
        for (const entry of onValue.entries) {
            const eventName = getScalarStringValue(entry);

            if (eventName !== null) {
                eventNames.add(eventName);
            }
        }

        return eventNames;
    }

    if (onValue.type === "YAMLMapping") {
        for (const pair of onValue.pairs) {
            const eventName = getScalarStringValue(pair.key);

            if (eventName !== null) {
                eventNames.add(eventName);
            }
        }
    }

    return eventNames;
};

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable readonly-parameter checks after YAML AST helper declarations. */
