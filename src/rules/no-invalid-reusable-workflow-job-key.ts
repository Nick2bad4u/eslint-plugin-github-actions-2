/**
 * @packageDocumentation
 * Disallow unsupported keys on jobs that call reusable workflows.
 */
import type { Rule } from "eslint";

import { arrayJoin, setHas } from "ts-extras";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import { reportYamlNode } from "../_internal/report.js";
import {
    getScalarStringValue,
    getWorkflowJobs,
    getWorkflowRoot,
    isReusableWorkflowJob,
} from "../_internal/workflow-yaml.js";

/** Supported keywords for jobs that call reusable workflows via `uses`. */
const reusableWorkflowJobKeys = [
    "concurrency",
    "if",
    "name",
    "needs",
    "permissions",
    "secrets",
    "strategy",
    "uses",
    "with",
] as const;

/** Constant-time lookup for supported reusable-workflow caller job keys. */
const reusableWorkflowJobKeySet: ReadonlySet<string> = new Set(
    reusableWorkflowJobKeys
);

/** Rule implementation for validating reusable-workflow caller job keys. */
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

            for (const job of getWorkflowJobs(root)) {
                if (!isReusableWorkflowJob(job.mapping)) {
                    continue;
                }

                for (const pair of job.mapping.pairs) {
                    const key = getScalarStringValue(pair.key);

                    if (
                        key === null ||
                        setHas(reusableWorkflowJobKeySet, key)
                    ) {
                        continue;
                    }

                    reportYamlNode(context, {
                        data: {
                            allowedKeys: arrayJoin(
                                reusableWorkflowJobKeys,
                                ", "
                            ),
                            jobId: job.id,
                            key,
                        },
                        messageId: "invalidReusableWorkflowJobKey",
                        node: pair.key,
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
