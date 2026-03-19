/**
 * @packageDocumentation
 * Require explicit types for reusable workflow inputs.
 */
import type { Rule } from "eslint";

import {
    getMappingPair,
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Allowed GitHub reusable workflow input types. */
const allowedWorkflowCallInputTypes = [
    "boolean",
    "number",
    "string",
] as const;

/** Constant-time lookup for supported reusable workflow input types. */
const allowedWorkflowCallInputTypeSet: ReadonlySet<string> = new Set(
    allowedWorkflowCallInputTypes
);

/** Rule implementation for requiring explicit workflow_call input types. */
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

                const inputsMapping = getMappingValueAsMapping(
                    workflowCallMapping,
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

                    if (
                        typeValue === null ||
                        !allowedWorkflowCallInputTypeSet.has(typeValue)
                    ) {
                        context.report({
                            data: {
                                allowedTypes:
                                    allowedWorkflowCallInputTypes.join(", "),
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
                "require every `workflow_call` input to declare one of the documented reusable-workflow input types so callers and validators agree on interface semantics.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R034",
            ruleNumber: 34,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-workflow-call-input-type",
        },
        messages: {
            invalidType:
                "`workflow_call` input '{{inputId}}' must set `type` to one of: {{allowedTypes}}.",
            missingType:
                "`workflow_call` input '{{inputId}}' should declare `type` explicitly.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
