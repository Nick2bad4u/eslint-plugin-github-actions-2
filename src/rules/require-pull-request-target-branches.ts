/**
 * @packageDocumentation
 * Require base-branch scoping for `pull_request_target` triggers.
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

/** Determine whether a branch filter node is meaningfully configured. */
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

/** Rule implementation for requiring `pull_request_target` branch filters. */
const rule: Rule.RuleModule = {
    create(context) {
        const reportMissingBranchFilter = (
            node: Readonly<AST.YAMLNode>
        ): void => {
            context.report({
                messageId: "missingBranchFilter",
                node: node as unknown as Rule.Node,
            });
        };

        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                const onPair = getMappingPair(root, "on");
                const onValue = unwrapYamlValue(onPair?.value ?? null);

                if (onValue === null) {
                    return;
                }

                if (onValue.type === "YAMLScalar") {
                    if (
                        getScalarStringValue(onValue) === "pull_request_target"
                    ) {
                        reportMissingBranchFilter(onValue);
                    }

                    return;
                }

                if (onValue.type === "YAMLSequence") {
                    for (const entry of onValue.entries) {
                        if (
                            entry !== null &&
                            getScalarStringValue(entry) ===
                                "pull_request_target"
                        ) {
                            reportMissingBranchFilter(entry);
                        }
                    }

                    return;
                }

                const onMapping = getMappingValueAsMapping(root, "on");

                if (onMapping === null) {
                    return;
                }

                const pullRequestTargetPair = getMappingPair(
                    onMapping,
                    "pull_request_target"
                );
                const pullRequestTargetValue = unwrapYamlValue(
                    pullRequestTargetPair?.value ?? null
                );

                if (pullRequestTargetPair === null) {
                    return;
                }

                if (pullRequestTargetValue?.type !== "YAMLMapping") {
                    reportMissingBranchFilter(
                        (pullRequestTargetPair.value ??
                            pullRequestTargetPair) as AST.YAMLNode
                    );

                    return;
                }

                const branchesPair = getMappingPair(
                    pullRequestTargetValue,
                    "branches"
                );
                const branchesIgnorePair = getMappingPair(
                    pullRequestTargetValue,
                    "branches-ignore"
                );

                if (
                    hasConfiguredBranchFilter(branchesPair) ||
                    hasConfiguredBranchFilter(branchesIgnorePair)
                ) {
                    return;
                }

                reportMissingBranchFilter(pullRequestTargetValue);
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
                "require `on.pull_request_target` triggers to scope target base branches with `branches` or `branches-ignore` so privileged workflows do not react to every branch by default.",
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R032",
            ruleNumber: 32,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-pull-request-target-branches",
        },
        messages: {
            missingBranchFilter:
                "`on.pull_request_target` should declare a non-empty `branches` or `branches-ignore` filter to scope which base branches can trigger this privileged workflow.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
