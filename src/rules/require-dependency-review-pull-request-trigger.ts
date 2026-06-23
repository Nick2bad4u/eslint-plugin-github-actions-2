/**
 * @packageDocumentation
 * Require workflows using actions/dependency-review-action to run on pull_request.
 */
import type { Rule } from "eslint";

import { setHas } from "ts-extras";

import { hasDependencyReviewAction } from "../_internal/dependency-review-workflow.js";
import { isWorkflowFile } from "../_internal/lint-targets.js";
import { reportYamlNode } from "../_internal/report.js";
import {
    getWorkflowEventNames,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for dependency review pull_request trigger requirements. */
const rule: Rule.RuleModule = {
    create: (context) => ({
        Program() {
            if (!isWorkflowFile(context.filename)) {
                return;
            }

            const root = getWorkflowRoot(context);

            if (root === null || !hasDependencyReviewAction(root)) {
                return;
            }

            if (setHas(getWorkflowEventNames(root), "pull_request")) {
                return;
            }

            reportYamlNode(context, {
                messageId: "missingPullRequestTrigger",
                node: root,
            });
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.codeScanning",
                "github-actions.configs.security",
            ],
            description:
                "require workflows using `actions/dependency-review-action` to listen for `pull_request`.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R094",
            ruleNumber: 94,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependency-review-pull-request-trigger",
        },
        messages: {
            missingPullRequestTrigger:
                "Workflows using `actions/dependency-review-action` should listen for `pull_request` so dependency review runs on pull request changes.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
