/**
 * @packageDocumentation
 * Require explicit types for `workflow_dispatch` inputs.
 */
import type { Rule } from "eslint";

import {
    getMappingPair,
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring explicit workflow_dispatch input types. */
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

                const workflowDispatchMapping = unwrapYamlValue(
                    getMappingPair(onMapping, "workflow_dispatch")?.value ??
                        null
                );

                if (workflowDispatchMapping?.type !== "YAMLMapping") {
                    return;
                }

                const inputsMapping = getMappingValueAsMapping(
                    workflowDispatchMapping,
                    "inputs"
                );

                if (inputsMapping === null) {
                    return;
                }

                for (const pair of inputsMapping.pairs) {
                    const inputId = getScalarStringValue(pair.key);
                    const inputMapping = unwrapYamlValue(pair.value);

                    if (
                        inputId === null ||
                        inputMapping?.type !== "YAMLMapping"
                    ) {
                        continue;
                    }

                    const typePair = getMappingPair(inputMapping, "type");

                    if (typePair === null) {
                        context.report({
                            data: {
                                inputId,
                            },
                            messageId: "missingType",
                            node: pair.key as unknown as Rule.Node,
                        });

                        continue;
                    }

                    const typeValue = getScalarStringValue(typePair.value);

                    if (typeValue === null || typeValue.trim().length === 0) {
                        context.report({
                            data: {
                                inputId,
                            },
                            messageId: "invalidType",
                            node: (typePair.value ??
                                typePair) as unknown as Rule.Node,
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
                "require every `workflow_dispatch` input to declare an explicit `type` so manual runs expose clearer controls and preserve intended value semantics.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R022",
            ruleNumber: 22,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-workflow-dispatch-input-type",
        },
        messages: {
            invalidType:
                "`workflow_dispatch` input '{{inputId}}' must set `type` to a non-empty string.",
            missingType:
                "`workflow_dispatch` input '{{inputId}}' should declare `type` explicitly.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
