/**
 * @packageDocumentation
 * Require CodeQL jobs to grant actions read permissions.
 */
import type { Rule } from "eslint";

import { setHas } from "ts-extras";

import {
    getCodeqlAnalyzeSteps,
    getCodeqlAutobuildSteps,
    getCodeqlInitSteps,
    getSarifUploadSteps,
} from "../_internal/code-scanning-workflow.ts";
import { isWorkflowFile } from "../_internal/lint-targets.js";
import { hasRequiredWorkflowPermission } from "../_internal/workflow-permissions.ts";
import { getWorkflowRoot } from "../_internal/workflow-yaml.js";

/** Rule implementation for CodeQL actions:read requirements. */
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

                const steps = [
                    ...getCodeqlInitSteps(root),
                    ...getCodeqlAutobuildSteps(root),
                    ...getCodeqlAnalyzeSteps(root),
                    ...getSarifUploadSteps(root),
                ];
                const seenJobIds = new Set<string>();

                for (const step of steps) {
                    if (setHas(seenJobIds, step.job.id)) {
                        continue;
                    }

                    seenJobIds.add(step.job.id);

                    if (
                        hasRequiredWorkflowPermission(
                            root,
                            step.job,
                            "actions",
                            "read"
                        )
                    ) {
                        continue;
                    }

                    context.report({
                        data: {
                            jobId: step.job.id,
                        },
                        messageId: "missingActionsRead",
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
            ],
            description:
                "require jobs running CodeQL actions to grant `actions: read`.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R099",
            ruleNumber: 99,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-codeql-actions-read",
        },
        messages: {
            missingActionsRead:
                "Job '{{jobId}}' uses CodeQL actions and should grant `actions: read`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
