/**
 * @packageDocumentation
 * Require branch scoping for `workflow_run` triggers.
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

/**
 * Determine whether a workflow_run branch filter node is meaningfully
 * configured.
 */
const hasConfiguredBranchFilter = (
    node: null | Readonly<AST.YAMLPair> | undefined
): boolean => {
    const valueNode = unwrapYamlValue(node?.value ?? null);

    if (valueNode === null) {
        return false;
    }

    if (valueNode.type === "YAMLScalar") {
        const value = getScalarStringValue(valueNode);

        return value !== null && value.trim().length > 0;
    }

    if (valueNode.type !== "YAMLSequence") {
        return false;
    }

    return valueNode.entries.some((entry) => {
        const value = getScalarStringValue(entry);

        return value !== null && value.trim().length > 0;
    });
};

/** Rule implementation for requiring `workflow_run` branch filters. */
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

                const workflowRunPair = getMappingPair(
                    onMapping,
                    "workflow_run"
                );
                const workflowRunMapping = unwrapYamlValue(
                    workflowRunPair?.value ?? null
                );

                if (workflowRunPair === null) {
                    return;
                }

                if (workflowRunMapping?.type !== "YAMLMapping") {
                    context.report({
                        messageId: "missingBranchFilter",
                        node: (workflowRunPair.value ??
                            workflowRunPair) as unknown as Rule.Node,
                    });

                    return;
                }

                const branchesPair = getMappingPair(
                    workflowRunMapping,
                    "branches"
                );
                const branchesIgnorePair = getMappingPair(
                    workflowRunMapping,
                    "branches-ignore"
                );

                if (
                    hasConfiguredBranchFilter(branchesPair) ||
                    hasConfiguredBranchFilter(branchesIgnorePair)
                ) {
                    return;
                }

                context.report({
                    messageId: "missingBranchFilter",
                    node: workflowRunMapping as unknown as Rule.Node,
                });
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.security",
                "github-actions.configs.strict",
            ],
            description:
                "require `on.workflow_run` triggers to scope upstream branches with `branches` or `branches-ignore` so follow-up workflows do not react to every branch indiscriminately.",
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R028",
            ruleNumber: 28,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-workflow-run-branches",
        },
        messages: {
            missingBranchFilter:
                "`on.workflow_run` should declare a non-empty `branches` or `branches-ignore` filter to scope which upstream branches can trigger this workflow.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
