/**
 * @packageDocumentation
 * Require explicit GitHub token permissions at workflow or job scope.
 */
import type { Rule } from "eslint";
import type { UnknownArray } from "type-fest";

import { arrayFirst, isDefined, isEmpty, safeCastTo } from "ts-extras";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import { reportYamlNode } from "../_internal/report.js";
import {
    getMappingPair,
    getWorkflowJobs,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

interface RequireWorkflowPermissionsOption {
    readonly allowJobLevelPermissions?: boolean;
}

/** Determine whether an unknown value is a valid rule option object. */
const isRequireWorkflowPermissionsOption = (
    value: unknown
): value is RequireWorkflowPermissionsOption => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const allowJobLevelPermissions: unknown = Reflect.get(
        value,
        "allowJobLevelPermissions"
    );

    return (
        !isDefined(allowJobLevelPermissions) ||
        typeof allowJobLevelPermissions === "boolean"
    );
};

/** Rule implementation for requiring explicit workflow or job token permissions. */
const rule: Rule.RuleModule = {
    create(context) {
        const rawOption = arrayFirst(
            safeCastTo<Readonly<UnknownArray>>(context.options)
        );
        const options = isRequireWorkflowPermissionsOption(rawOption)
            ? rawOption
            : undefined;
        const allowJobLevelPermissions =
            options?.allowJobLevelPermissions ?? true;

        return {
            Program() {
                if (!isWorkflowFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                if (getMappingPair(root, "permissions") !== null) {
                    return;
                }

                const jobs = getWorkflowJobs(root);

                if (!allowJobLevelPermissions) {
                    reportYamlNode(context, {
                        messageId: "missingWorkflowPermissions",
                        node: root,
                    });

                    return;
                }

                if (isEmpty(jobs)) {
                    reportYamlNode(context, {
                        messageId: "missingWorkflowPermissions",
                        node: root,
                    });

                    return;
                }

                for (const job of jobs) {
                    if (getMappingPair(job.mapping, "permissions") !== null) {
                        continue;
                    }

                    reportYamlNode(context, {
                        data: {
                            jobId: job.id,
                        },
                        messageId: "missingJobPermissions",
                        node: job.idNode,
                    });
                }
            },
        };
    },
    meta: {
        defaultOptions: [{}],
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.recommended",
                "github-actions.configs.security",
                "github-actions.configs.strict",
            ],
            description:
                "require explicit `permissions` to avoid relying on GitHub Actions' default token scope.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R001",
            ruleNumber: 1,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-workflow-permissions",
        },
        messages: {
            missingJobPermissions:
                "Job '{{jobId}}' is missing explicit `permissions`. Define workflow-level `permissions` or add `jobs.{{jobId}}.permissions`.",
            missingWorkflowPermissions:
                "Define explicit top-level `permissions` for this workflow, or configure job-level `permissions` for every job.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Optional configuration for how strictly workflow permissions must be declared.",
                properties: {
                    allowJobLevelPermissions: {
                        description:
                            "Allow each job to declare its own permissions when the workflow omits a top-level permissions block.",
                        type: "boolean",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
