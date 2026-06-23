/**
 * @packageDocumentation
 * Require minimum permissions for workflows that automate Dependabot pull requests.
 */
import type { Rule } from "eslint";

import { getDependabotAutomationRunSteps } from "../_internal/dependabot-automation-workflow.js";
import { isWorkflowFile } from "../_internal/lint-targets.js";
import { reportYamlNode } from "../_internal/report.js";
import { hasRequiredWorkflowPermission } from "../_internal/workflow-permissions.js";
import { getWorkflowRoot } from "../_internal/workflow-yaml.js";

/** Rule implementation for Dependabot automation permission requirements. */
const rule: Rule.RuleModule = {
    create: (context) => ({
        Program() {
            if (!isWorkflowFile(context.filename)) {
                return;
            }

            const root = getWorkflowRoot(context);

            if (root === null) {
                return;
            }

            for (const step of getDependabotAutomationRunSteps(root)) {
                if (
                    !hasRequiredWorkflowPermission(
                        root,
                        step.job,
                        "pull-requests",
                        "write"
                    )
                ) {
                    reportYamlNode(context, {
                        data: { jobId: step.job.id },
                        messageId: "missingPullRequestsWrite",
                        node: step.job.idNode,
                    });
                }

                if (
                    step.runScript.includes("gh pr edit") &&
                    step.runScript.includes("--add-label") &&
                    !hasRequiredWorkflowPermission(
                        root,
                        step.job,
                        "issues",
                        "write"
                    )
                ) {
                    reportYamlNode(context, {
                        data: { jobId: step.job.id },
                        messageId: "missingIssuesWrite",
                        node: step.job.idNode,
                    });
                }

                if (
                    step.runScript.includes("gh pr merge") &&
                    !hasRequiredWorkflowPermission(
                        root,
                        step.job,
                        "contents",
                        "write"
                    )
                ) {
                    reportYamlNode(context, {
                        data: { jobId: step.job.id },
                        messageId: "missingContentsWrite",
                        node: step.job.idNode,
                    });
                }
            }
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.security",
            ],
            description:
                "require minimum GitHub token permissions for Dependabot pull request automation steps.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R111",
            ruleNumber: 111,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-automation-permissions",
        },
        messages: {
            missingContentsWrite:
                "Job '{{jobId}}' uses `gh pr merge` and should grant `contents: write`.",
            missingIssuesWrite:
                "Job '{{jobId}}' edits pull request labels and should grant `issues: write`.",
            missingPullRequestsWrite:
                "Job '{{jobId}}' automates pull requests and should grant `pull-requests: write`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
