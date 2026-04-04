/**
 * @packageDocumentation
 * Disallow unsupported keys on jobs that call reusable workflows.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import {
    getMappingPair,
    getScalarStringValue,
    getWorkflowJobs,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Supported keywords for jobs that call reusable workflows via `uses`. */
const reusableWorkflowJobKeys = [
    "name",
    "uses",
    "with",
    "secrets",
    "strategy",
    "needs",
    "if",
    "concurrency",
    "permissions",
] as const;

/** Constant-time lookup for supported reusable-workflow caller job keys. */
const reusableWorkflowJobKeySet: ReadonlySet<string> = new Set(
    reusableWorkflowJobKeys
);

/** Determine whether a job calls a reusable workflow. */
const isReusableWorkflowJob = (
    jobMapping: Readonly<AST.YAMLMapping>
): boolean => getMappingPair(jobMapping, "uses") !== null;

/** Rule implementation for validating reusable-workflow caller job keys. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                for (const job of getWorkflowJobs(root)) {
                    if (!isReusableWorkflowJob(job.mapping)) {
                        continue;
                    }

                    for (const pair of job.mapping.pairs) {
                        const key = getScalarStringValue(pair.key);

                        if (
                            key === null ||
                            reusableWorkflowJobKeySet.has(key)
                        ) {
                            continue;
                        }

                        context.report({
                            data: {
                                allowedKeys: reusableWorkflowJobKeys.join(", "),
                                jobId: job.id,
                                key,
                            },
                            messageId: "invalidReusableWorkflowJobKey",
                            node: pair.key as unknown as Rule.Node,
                        });
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
                "github-actions.configs.strict",
            ],
            description:
                "disallow unsupported keys on jobs that call reusable workflows via `jobs.<job_id>.uses`.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R041",
            ruleNumber: 41,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-invalid-reusable-workflow-job-key",
        },
        messages: {
            invalidReusableWorkflowJobKey:
                "Job '{{jobId}}' calls a reusable workflow via `uses`, so `{{key}}` is not supported here. Caller jobs may only use: {{allowedKeys}}.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
