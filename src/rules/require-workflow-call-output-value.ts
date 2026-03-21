/**
 * @packageDocumentation
 * Require reusable workflow outputs to declare a non-empty `value`.
 */
import type { Rule } from "eslint";

import {
    getMappingPair,
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring explicit reusable-workflow output values. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                const onMapping = getMappingValueAsMapping(root, "on");

                if (onMapping === null) {
                    return;
                }

                const workflowCallMapping = unwrapYamlValue(
                    getMappingPair(onMapping, "workflow_call")?.value ?? null
                );

                if (workflowCallMapping?.type !== "YAMLMapping") {
                    return;
                }

                const outputsMapping = getMappingValueAsMapping(
                    workflowCallMapping,
                    "outputs"
                );

                if (outputsMapping === null) {
                    return;
                }

                for (const pair of outputsMapping.pairs) {
                    const outputId = getScalarStringValue(pair.key);
                    const outputMapping = unwrapYamlValue(pair.value);

                    if (
                        outputId === null ||
                        outputMapping?.type !== "YAMLMapping"
                    ) {
                        continue;
                    }

                    const valuePair = getMappingPair(outputMapping, "value");

                    if (valuePair === null) {
                        context.report({
                            data: {
                                outputId,
                            },
                            messageId: "missingValue",
                            node: pair.key as unknown as Rule.Node,
                        });

                        continue;
                    }

                    const value = getScalarStringValue(valuePair.value);

                    if (value === null || value.trim().length === 0) {
                        context.report({
                            data: {
                                outputId,
                            },
                            messageId: "invalidValue",
                            node: (valuePair.value ??
                                valuePair) as unknown as Rule.Node,
                        });
                    }
                }
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.recommended",
                "github-actions.configs.strict",
            ],
            description:
                "require every `workflow_call` output to declare a non-empty `value` so reusable workflows expose concrete runtime output mappings.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R039",
            ruleNumber: 39,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-workflow-call-output-value",
        },
        messages: {
            invalidValue:
                "`workflow_call` output '{{outputId}}' must set `value` to a non-empty scalar expression.",
            missingValue:
                "`workflow_call` output '{{outputId}}' should declare `value` explicitly.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
