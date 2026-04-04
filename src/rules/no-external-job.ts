/**
 * @packageDocumentation
 * Disallow defining jobs as reusable workflow invocations via `uses`.
 */
import type { Rule } from "eslint";

import {
    getMappingPair,
    getWorkflowJobs,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for disallowing reusable-workflow jobs. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                for (const job of getWorkflowJobs(root)) {
                    const usesPair = getMappingPair(job.mapping, "uses");

                    if (usesPair === null) {
                        continue;
                    }

                    context.report({
                        data: {
                            jobId: job.id,
                        },
                        messageId: "externalJob",
                        node: (usesPair.value ??
                            usesPair) as unknown as Rule.Node,
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
                "github-actions.configs.strict",
            ],
            description:
                "disallow reusable-workflow jobs declared with `jobs.<id>.uses` when you want every job defined inline in the workflow file.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R012",
            ruleNumber: 12,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-external-job",
        },
        messages: {
            externalJob:
                "Job '{{jobId}}' uses a reusable workflow via `uses`. Define the job inline instead.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
