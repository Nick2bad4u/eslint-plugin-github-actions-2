/**
 * @packageDocumentation
 * Require workflows uploading SARIF to grant security-events write.
 */
import type { Rule } from "eslint";

import { getSarifUploadSteps } from "../_internal/code-scanning-workflow.ts";
import { hasRequiredWorkflowPermission } from "../_internal/workflow-permissions.ts";
import { getWorkflowRoot } from "../_internal/workflow-yaml.js";

/** Rule implementation for SARIF upload permission requirements. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                for (const step of getSarifUploadSteps(root)) {
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
                        data: { jobId: step.job.id },
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
                "require jobs uploading SARIF to GitHub code scanning to grant `security-events: write`.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R102",
            ruleNumber: 102,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-sarif-upload-security-events-write",
        },
        messages: {
            missingSecurityEventsWrite:
                "Job '{{jobId}}' uploads SARIF results and should grant `security-events: write`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
