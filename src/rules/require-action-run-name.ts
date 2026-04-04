/**
 * @packageDocumentation
 * Require every workflow file to declare a run-name string.
 */
import type { Rule } from "eslint";

import {
    getMappingPair,
    getScalarStringValue,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring a string workflow run-name. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program(node) {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    context.report({
                        messageId: "missingRunName",
                        node: node as unknown as Rule.Node,
                    });

                    return;
                }

                const runNamePair = getMappingPair(root, "run-name");

                if (runNamePair === null) {
                    context.report({
                        messageId: "missingRunName",
                        node: root as unknown as Rule.Node,
                    });

                    return;
                }

                const runNameValue = getScalarStringValue(runNamePair.value);

                if (runNameValue === null || runNameValue.trim().length === 0) {
                    context.report({
                        messageId: "invalidRunName",
                        node: (runNamePair.value ??
                            runNamePair) as unknown as Rule.Node,
                    });
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.strict",
            ],
            description:
                "require a non-empty string workflow `run-name` when you want queued and in-progress runs to remain self-describing.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R006",
            ruleNumber: 6,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-action-run-name",
        },
        messages: {
            invalidRunName: "Workflow `run-name` must be a non-empty string.",
            missingRunName:
                "Add a top-level workflow `run-name` so individual workflow runs are easier to distinguish.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
