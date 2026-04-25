/**
 * @packageDocumentation
 * Require job timeout when a job contains run steps.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getMappingValueAsSequence,
    getWorkflowJobs,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Determine whether a workflow job has any run steps. */
const jobHasRunSteps = (jobMapping: Readonly<AST.YAMLMapping>): boolean => {
    const stepsSequence = getMappingValueAsSequence(jobMapping, "steps");

    if (stepsSequence === null) {
        return false;
    }

    for (const entry of stepsSequence.entries) {
        const stepMapping = unwrapYamlValue(entry);

        if (stepMapping?.type !== "YAMLMapping") {
            continue;
        }

        if (getMappingPair(stepMapping, "run") !== null) {
            return true;
        }
    }

    return false;
};

/** Rule implementation for requiring timeout on jobs with run steps. */
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

                for (const job of getWorkflowJobs(root)) {
                    // Skip reusable workflows
                    if (getMappingPair(job.mapping, "uses") !== null) {
                        continue;
                    }

                    // Skip jobs that already have a timeout
                    if (
                        getMappingPair(job.mapping, "timeout-minutes") !== null
                    ) {
                        continue;
                    }

                    // Only flag if the job has run steps
                    if (jobHasRunSteps(job.mapping)) {
                        context.report({
                            data: {
                                jobId: job.id,
                            },
                            messageId: "missingTimeout",
                            node: job.idNode,
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
            ],
            description:
                "require workflow jobs containing run steps to declare a `timeout-minutes` value.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R115",
            ruleNumber: 115,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-run-step-timeout",
        },
        messages: {
            missingTimeout:
                "Job '{{jobId}}' has run steps but no `timeout-minutes`. Add a job-level timeout to protect against hung run steps.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
