/**
 * @packageDocumentation
 * Require every workflow step to declare a string name.
 */
import type { Rule } from "eslint";

import {
    getMappingPair,
    getMappingValueAsSequence,
    getScalarStringValue,
    getWorkflowJobs,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring explicit job step names. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                for (const job of getWorkflowJobs(root)) {
                    const stepsSequence = getMappingValueAsSequence(
                        job.mapping,
                        "steps"
                    );

                    if (stepsSequence === null) {
                        continue;
                    }

                    for (const entry of stepsSequence.entries) {
                        const stepMapping = unwrapYamlValue(entry);

                        if (stepMapping?.type !== "YAMLMapping") {
                            continue;
                        }

                        const namePair = getMappingPair(stepMapping, "name");

                        if (namePair === null) {
                            context.report({
                                data: {
                                    jobId: job.id,
                                },
                                messageId: "missingStepName",
                                node: stepMapping as unknown as Rule.Node,
                            });

                            continue;
                        }

                        const nameValue = getScalarStringValue(namePair.value);

                        if (
                            nameValue === null ||
                            nameValue.trim().length === 0
                        ) {
                            context.report({
                                data: {
                                    jobId: job.id,
                                },
                                messageId: "invalidStepName",
                                node: (namePair.value ??
                                    namePair) as unknown as Rule.Node,
                            });
                        }
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
                "github-actions.configs.strict",
            ],
            description:
                "require every workflow step to declare a non-empty string `name` so job logs remain readable.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R008",
            ruleNumber: 8,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-job-step-name",
        },
        messages: {
            invalidStepName:
                "A step in job '{{jobId}}' must set `name` to a non-empty string.",
            missingStepName:
                "A step in job '{{jobId}}' is missing a human-readable `name`.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
