/**
 * @packageDocumentation
 * Require descriptions for manual and reusable workflow interfaces.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import {
    getMappingPair,
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Report missing or invalid descriptions across interface mappings. */
const checkInterfaceDescriptions = (
    context: Readonly<Rule.RuleContext>,
    mapping: Readonly<AST.YAMLMapping>,
    kind: string
): void => {
    for (const pair of mapping.pairs) {
        const name = getScalarStringValue(pair.key);
        const entryMapping = unwrapYamlValue(pair.value);

        if (name === null || entryMapping?.type !== "YAMLMapping") {
            continue;
        }

        const descriptionPair = getMappingPair(entryMapping, "description");

        if (descriptionPair === null) {
            context.report({
                data: {
                    kind,
                    name,
                },
                messageId: "missingDescription",
                node: pair.key as unknown as Rule.Node,
            });

            continue;
        }

        const descriptionValue = getScalarStringValue(descriptionPair.value);

        if (descriptionValue === null || descriptionValue.trim().length === 0) {
            context.report({
                data: {
                    kind,
                    name,
                },
                messageId: "invalidDescription",
                node: (descriptionPair.value ??
                    descriptionPair) as unknown as Rule.Node,
            });
        }
    }
};

/** Rule implementation for requiring workflow interface descriptions. */
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

                if (workflowDispatchMapping?.type === "YAMLMapping") {
                    const dispatchInputsMapping = getMappingValueAsMapping(
                        workflowDispatchMapping,
                        "inputs"
                    );

                    if (dispatchInputsMapping !== null) {
                        checkInterfaceDescriptions(
                            context,
                            dispatchInputsMapping,
                            "workflow_dispatch input"
                        );
                    }
                }

                const workflowCallMapping = unwrapYamlValue(
                    getMappingPair(onMapping, "workflow_call")?.value ?? null
                );

                if (workflowCallMapping?.type !== "YAMLMapping") {
                    return;
                }

                const workflowCallInputsMapping = getMappingValueAsMapping(
                    workflowCallMapping,
                    "inputs"
                );

                if (workflowCallInputsMapping !== null) {
                    checkInterfaceDescriptions(
                        context,
                        workflowCallInputsMapping,
                        "workflow_call input"
                    );
                }

                const workflowCallSecretsMapping = getMappingValueAsMapping(
                    workflowCallMapping,
                    "secrets"
                );

                if (workflowCallSecretsMapping !== null) {
                    checkInterfaceDescriptions(
                        context,
                        workflowCallSecretsMapping,
                        "workflow_call secret"
                    );
                }

                const workflowCallOutputsMapping = getMappingValueAsMapping(
                    workflowCallMapping,
                    "outputs"
                );

                if (workflowCallOutputsMapping !== null) {
                    checkInterfaceDescriptions(
                        context,
                        workflowCallOutputsMapping,
                        "workflow_call output"
                    );
                }
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.strict",
            ],
            description:
                "require descriptions for `workflow_dispatch` inputs and reusable workflow interfaces so manual forms and callable workflows stay self-documenting.",
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R024",
            ruleNumber: 24,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-workflow-interface-description",
        },
        messages: {
            invalidDescription:
                "{{kind}} '{{name}}' must set `description` to a non-empty string.",
            missingDescription:
                "{{kind}} '{{name}}' should declare `description` explicitly.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
