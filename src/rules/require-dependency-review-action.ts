/**
 * @packageDocumentation
 * Require dependency-review workflow files to invoke actions/dependency-review-action.
 */
import type { Rule } from "eslint";

import { getDependencyReviewActionSteps } from "../_internal/dependency-review-workflow.ts";
import { isDependencyReviewWorkflowFile } from "../_internal/lint-targets.js";
import { getWorkflowRoot } from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring dependency review action usage. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program(node) {
                if (!isDependencyReviewWorkflowFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                if (getDependencyReviewActionSteps(root).length > 0) {
                    return;
                }

                context.report({
                    messageId: "missingDependencyReviewAction",
                    node: node as unknown as Rule.Node,
                });
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.security",
            ],
            description:
                "require dependency-review workflow files to invoke `actions/dependency-review-action`.",
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R091",
            ruleNumber: 91,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependency-review-action",
        },
        messages: {
            missingDependencyReviewAction:
                "Dependency review workflow files should invoke `actions/dependency-review-action` in at least one job step.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
