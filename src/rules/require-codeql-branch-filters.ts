/**
 * @packageDocumentation
 * Require CodeQL push and pull_request triggers to scope branches explicitly.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { getCodeqlInitSteps } from "../_internal/code-scanning-workflow.ts";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

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

/**
 * Rule implementation for requiring branch filters on CodeQL push and PR
 * triggers.
 */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null || getCodeqlInitSteps(root).length === 0) {
                    return;
                }

                const onMapping = getMappingValueAsMapping(root, "on");

                if (onMapping === null) {
                    return;
                }

                for (const triggerName of ["push", "pull_request"]) {
                    const triggerPair = getMappingPair(onMapping, triggerName);
                    const triggerMapping =
                        triggerPair === null
                            ? null
                            : unwrapYamlValue(triggerPair.value);

                    if (triggerMapping?.type !== "YAMLMapping") {
                        continue;
                    }

                    const branchesPair = getMappingPair(
                        triggerMapping,
                        "branches"
                    );
                    const branchesIgnorePair = getMappingPair(
                        triggerMapping,
                        "branches-ignore"
                    );

                    if (
                        hasConfiguredBranchFilter(branchesPair) ||
                        hasConfiguredBranchFilter(branchesIgnorePair)
                    ) {
                        continue;
                    }

                    context.report({
                        data: { triggerName },
                        messageId: "missingBranchFilter",
                        node: triggerMapping as unknown as Rule.Node,
                    });
                }
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.codeScanning",
            ],
            description:
                "require CodeQL `push` and `pull_request` triggers to scope branches explicitly.",
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R113",
            ruleNumber: 113,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-codeql-branch-filters",
        },
        messages: {
            missingBranchFilter:
                "CodeQL trigger '{{triggerName}}' should declare a non-empty `branches` or `branches-ignore` filter.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
