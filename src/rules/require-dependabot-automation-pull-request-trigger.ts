/**
 * @packageDocumentation
 * Require Dependabot pull request automation workflows to run on pull_request.
 */
import type { Rule } from "eslint";

import { hasDependabotAutomation } from "../_internal/dependabot-automation-workflow.ts";
import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getWorkflowEventNames,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/**
 * Rule implementation for requiring pull_request on Dependabot automation
 * workflows.
 */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program(node) {
                if (!isWorkflowFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null || !hasDependabotAutomation(root)) {
                    return;
                }

                if (getWorkflowEventNames(root).has("pull_request")) {
                    return;
                }

                context.report({
                    messageId: "missingPullRequestTrigger",
                    node: node as unknown as Rule.Node,
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.security",
            ],
            description:
                "require Dependabot pull request automation workflows to listen for `pull_request`.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R112",
            ruleNumber: 112,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-automation-pull-request-trigger",
        },
        messages: {
            missingPullRequestTrigger:
                "Dependabot pull request automation workflows should listen for `pull_request`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
