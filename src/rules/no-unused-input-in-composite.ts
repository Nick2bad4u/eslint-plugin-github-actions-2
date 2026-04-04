/**
 * @packageDocumentation
 * Disallow declared inputs that are never used in a composite action.
 */
import type { Rule } from "eslint";

import { isActionMetadataFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";
import { collectYamlStringScalars } from "../_internal/yaml-traversal.js";

/** Matches `inputs.<id>` references in composite-step string values. */
const INPUT_REFERENCE_PATTERN = /inputs\.(?<inputId>[\w-]+)/gu;

/** Rule implementation for unused composite input checks. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                if (!isActionMetadataFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                const runsMapping = getMappingValueAsMapping(root, "runs");
                const inputsMapping = getMappingValueAsMapping(root, "inputs");

                if (runsMapping === null || inputsMapping === null) {
                    return;
                }

                const usingRuntime = getScalarStringValue(
                    getMappingPair(runsMapping, "using")?.value
                );

                if (usingRuntime !== "composite") {
                    return;
                }

                const allScalarValues = collectYamlStringScalars(runsMapping);
                const referencedInputIds = new Set<string>();

                for (const scalarValue of allScalarValues) {
                    for (const match of scalarValue.matchAll(
                        INPUT_REFERENCE_PATTERN
                    )) {
                        const matchedInputId = match.groups?.["inputId"];

                        if (matchedInputId === undefined) {
                            continue;
                        }

                        referencedInputIds.add(matchedInputId);
                    }
                }

                for (const inputPair of inputsMapping.pairs) {
                    const inputId = getScalarStringValue(inputPair.key);

                    if (inputId === null) {
                        continue;
                    }

                    if (referencedInputIds.has(inputId)) {
                        continue;
                    }

                    context.report({
                        data: {
                            inputId,
                        },
                        messageId: "unusedCompositeInput",
                        node: inputPair.key as unknown as Rule.Node,
                    });
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.actionMetadata",
                "github-actions.configs.all",
            ],
            description:
                "disallow declared composite-action inputs that are never referenced.",
            dialects: ["GitHub Action metadata"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R053",
            ruleNumber: 53,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-unused-input-in-composite",
        },
        messages: {
            unusedCompositeInput:
                "Composite action input '{{inputId}}' is declared but never referenced via `inputs.{{inputId}}`.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
