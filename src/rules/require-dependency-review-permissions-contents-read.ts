/**
 * @packageDocumentation
 * Require workflows using actions/dependency-review-action to set permissions.contents to read.
 */
import type { Rule } from "eslint";

import {
    getDependencyReviewActionSteps,
    hasDependencyReviewAction,
} from "../_internal/dependency-review-workflow.ts";
import { isWorkflowFile } from "../_internal/lint-targets.js";
import { hasExactWorkflowPermission } from "../_internal/workflow-permissions.ts";
import { getWorkflowRoot } from "../_internal/workflow-yaml.js";

/** Rule implementation for dependency-review contents permission requirements. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                if (!isWorkflowFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null || !hasDependencyReviewAction(root)) {
                    return;
                }

                const seenJobIds = new Set<string>();

                for (const step of getDependencyReviewActionSteps(root)) {
                    if (seenJobIds.has(step.job.id)) {
                        continue;
                    }

                    seenJobIds.add(step.job.id);

                    if (
                        hasExactWorkflowPermission(
                            root,
                            step.job,
                            "contents",
                            "read"
                        )
                    ) {
                        continue;
                    }

                    context.report({
                        data: { jobId: step.job.id },
                        messageId: "missingContentsReadPermission",
                        node: step.job.idNode as unknown as Rule.Node,
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
                "github-actions.configs.codeScanning",
                "github-actions.configs.security",
            ],
            description:
                "require jobs using `actions/dependency-review-action` to grant effective `contents: read`.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R092",
            ruleNumber: 92,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependency-review-permissions-contents-read",
        },
        messages: {
            missingContentsReadPermission:
                "Job '{{jobId}}' uses `actions/dependency-review-action` and should grant effective `contents: read` at the job or workflow level.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
