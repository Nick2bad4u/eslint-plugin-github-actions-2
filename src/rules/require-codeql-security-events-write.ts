/**
 * @packageDocumentation
 * Require CodeQL analysis jobs to grant security-events write permissions.
 */
import type { Rule } from "eslint";

import { getCodeqlAnalyzeSteps } from "../_internal/code-scanning-workflow.ts";
import { isWorkflowFile } from "../_internal/lint-targets.js";
import { hasRequiredWorkflowPermission } from "../_internal/workflow-permissions.ts";
import { getWorkflowRoot } from "../_internal/workflow-yaml.js";

/** Rule implementation for CodeQL security-events permission requirements. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                if (!isWorkflowFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                for (const step of getCodeqlAnalyzeSteps(root)) {
                    if (
                        hasRequiredWorkflowPermission(
                            root,
                            step.job,
                            "security-events",
                            "write"
                        )
                    ) {
                        continue;
                    }

                    context.report({
                        data: {
                            jobId: step.job.id,
                        },
                        messageId: "missingSecurityEventsWrite",
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
                "require jobs running CodeQL analysis to grant `security-events: write`.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R098",
            ruleNumber: 98,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-codeql-security-events-write",
        },
        messages: {
            missingSecurityEventsWrite:
                "Job '{{jobId}}' runs CodeQL analysis and should grant `security-events: write`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
