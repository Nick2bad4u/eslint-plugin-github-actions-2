/**
 * @packageDocumentation
 * Require secret scanning workflows to grant contents read permissions.
 */
import type { Rule } from "eslint";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import { getSecretScanningActionSteps } from "../_internal/secret-scanning-workflow.ts";
import { hasExactWorkflowPermission } from "../_internal/workflow-permissions.ts";
import { getWorkflowRoot } from "../_internal/workflow-yaml.js";

/**
 * Rule implementation for secret-scanning contents read permission
 * requirements.
 */
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

                for (const step of getSecretScanningActionSteps(root)) {
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
                        messageId: "missingContentsRead",
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
                "github-actions.configs.security",
            ],
            description:
                "require secret scanning workflows to grant `contents: read`.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R107",
            ruleNumber: 107,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-secret-scan-contents-read",
        },
        messages: {
            missingContentsRead:
                "Job '{{jobId}}' runs a secret scanner and should grant effective `contents: read` at the job or workflow level.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
