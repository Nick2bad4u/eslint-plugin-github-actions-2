/**
 * @packageDocumentation
 * Prefer matrix fail-fast behavior over explicitly disabling it.
 */
import type { Rule } from "eslint";

import {
    getMappingPair,
    getScalarStringValue,
    getWorkflowJobs,
    getWorkflowRoot,
    isGithubExpressionScalar,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for discouraging `strategy.fail-fast: false`. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                for (const job of getWorkflowJobs(root)) {
                    const strategyPair = getMappingPair(
                        job.mapping,
                        "strategy"
                    );
                    const strategyValue = unwrapYamlValue(
                        strategyPair?.value ?? null
                    );

                    if (strategyValue?.type !== "YAMLMapping") {
                        continue;
                    }

                    const failFastPair = getMappingPair(
                        strategyValue,
                        "fail-fast"
                    );

                    if (
                        failFastPair === null ||
                        isGithubExpressionScalar(failFastPair.value)
                    ) {
                        continue;
                    }

                    const failFastValue = unwrapYamlValue(failFastPair.value);
                    const failFastText = getScalarStringValue(
                        failFastPair.value
                    );

                    if (
                        failFastValue?.type === "YAMLScalar" &&
                        (failFastValue.value === false ||
                            failFastText === "false")
                    ) {
                        context.report({
                            data: {
                                jobId: job.id,
                            },
                            messageId: "failFastDisabled",
                            node: (failFastPair.value ??
                                failFastPair) as unknown as Rule.Node,
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
                "github-actions.configs.strict",
            ],
            description:
                "disallow `strategy.fail-fast: false` so failing matrix jobs can stop redundant work sooner.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R015",
            ruleNumber: 15,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/prefer-fail-fast",
        },
        messages: {
            failFastDisabled:
                "Job '{{jobId}}' disables `strategy.fail-fast`. Prefer `true` or a GitHub expression instead.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
