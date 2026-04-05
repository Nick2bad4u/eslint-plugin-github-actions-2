/**
 * @packageDocumentation
 * Disallow broad `write-all` GitHub token permissions.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getScalarStringValue,
    getWorkflowJobs,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Determine whether a permissions node is the broad `write-all` shortcut. */
const isWriteAllPermissionsValue = (
    permissionsPair: Readonly<AST.YAMLPair>
): boolean =>
    getScalarStringValue(permissionsPair.value)?.trim().toLowerCase() ===
    "write-all";

/** Rule implementation for disallowing `permissions: write-all`. */
const rule: Rule.RuleModule = {
    create(context) {
        const reportWriteAll = (
            permissionsPair: Readonly<AST.YAMLPair>,
            scope: string
        ): void => {
            context.report({
                data: {
                    scope,
                },
                messageId: "writeAllPermissions",
                node: permissionsPair.value as unknown as Rule.Node,
            });
        };

        return {
            Program() {
                if (!isWorkflowFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                const workflowPermissionsPair = getMappingPair(
                    root,
                    "permissions"
                );

                if (
                    workflowPermissionsPair !== null &&
                    isWriteAllPermissionsValue(workflowPermissionsPair)
                ) {
                    reportWriteAll(
                        workflowPermissionsPair,
                        "top-level workflow `permissions`"
                    );
                }

                for (const job of getWorkflowJobs(root)) {
                    const jobPermissionsPair = getMappingPair(
                        job.mapping,
                        "permissions"
                    );

                    if (
                        jobPermissionsPair !== null &&
                        isWriteAllPermissionsValue(jobPermissionsPair)
                    ) {
                        reportWriteAll(
                            jobPermissionsPair,
                            `job '${job.id}' permissions`
                        );
                    }
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.recommended",
                "github-actions.configs.security",
                "github-actions.configs.strict",
            ],
            description:
                "disallow `permissions: write-all` so workflows and jobs keep GitHub token scopes least-privileged.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R023",
            ruleNumber: 23,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-write-all-permissions",
        },
        messages: {
            writeAllPermissions:
                "Avoid `write-all` in {{scope}}. Declare only the specific write scopes the workflow or job actually needs.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
