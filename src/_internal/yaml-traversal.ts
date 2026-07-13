/**
 * @packageDocumentation
 * Generic YAML AST traversal utilities shared by lint rules.
 */
import type { AST } from "yaml-eslint-parser";

import { getScalarStringValue, unwrapYamlValue } from "./workflow-yaml.js";
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- Traversal operates on parser-provided mutable AST node types. */

/** Visit every string scalar contained in a YAML subtree. */
export const visitYamlStringScalars = (
    node:
        | AST.YAMLContent
        | AST.YAMLWithMeta
        | null
        | undefined,
    visitor: (node: Readonly<AST.YAMLScalar>, value: string) => void
): void => {
    const unwrappedNode = unwrapYamlValue(node ?? null);

    if (unwrappedNode === null) {
        return;
    }

    if (unwrappedNode.type === "YAMLScalar") {
        const scalarValue = getScalarStringValue(unwrappedNode);

        if (scalarValue !== null) {
            visitor(unwrappedNode, scalarValue);
        }

        return;
    }

    if (unwrappedNode.type === "YAMLSequence") {
        for (const entry of unwrappedNode.entries) {
            visitYamlStringScalars(entry, visitor);
        }

        return;
    }

    if (unwrappedNode.type !== "YAMLMapping") {
        return;
    }

    for (const pair of unwrappedNode.pairs) {
        visitYamlStringScalars(pair.value ?? null, visitor);
    }
};

/** Collect every string scalar value from a YAML subtree. */
export const collectYamlStringScalars = (
    node:
        | AST.YAMLContent
        | AST.YAMLWithMeta
        | null
        | undefined
): readonly string[] => {
    const values: string[] = [];

    visitYamlStringScalars(node, (_node, value) => {
        values.push(value);
    });

    return values;
};

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable readonly-parameter checks outside YAML traversal internals. */
