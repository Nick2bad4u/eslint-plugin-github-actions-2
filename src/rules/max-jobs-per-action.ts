/**
 * @packageDocumentation
 * Enforce an upper bound on the number of jobs declared in one workflow file.
 */
import type { Rule } from "eslint";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getMappingValueAsMapping,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Rule options for `max-jobs-per-action`. */
type MaxJobsPerActionOptions = [number?];

/** Default maximum number of jobs allowed in a single workflow file. */
const DEFAULT_MAX_JOBS = 3;

/** Rule implementation for limiting workflow job counts. */
const rule: Rule.RuleModule = {
    create(context) {
        const [configuredMaxJobs = DEFAULT_MAX_JOBS] =
            context.options as MaxJobsPerActionOptions;
        const maxJobs =
            configuredMaxJobs >= 1 ? configuredMaxJobs : DEFAULT_MAX_JOBS;

        return {
            Program() {
                if (!isWorkflowFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                const jobsMapping = getMappingValueAsMapping(root, "jobs");

                if (jobsMapping === null) {
                    return;
                }

                const jobCount = jobsMapping.pairs.length;

                if (jobCount > maxJobs) {
                    context.report({
                        data: {
                            count: String(jobCount),
                            limit: String(maxJobs),
                        },
                        messageId: "tooManyJobs",
                        node: jobsMapping as unknown as Rule.Node,
                    });
                }
            },
        };
    },
    meta: {
        defaultOptions: [DEFAULT_MAX_JOBS],
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.strict",
            ],
            description:
                "enforce a maximum number of jobs per workflow file so large pipelines stay modular and reviewable.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R011",
            ruleNumber: 11,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/max-jobs-per-action",
        },
        messages: {
            tooManyJobs:
                "This workflow defines {{count}} jobs, which exceeds the configured maximum of {{limit}}.",
        },
        schema: [
            {
                description:
                    "Maximum number of jobs allowed in a single GitHub Actions workflow file.",
                minimum: 1,
                type: "integer",
            },
        ],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
