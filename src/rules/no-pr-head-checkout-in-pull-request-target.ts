/**
 * @packageDocumentation
 * Disallow checking out pull-request head content in `pull_request_target` workflows.
 */
import type { Rule } from "eslint";

import {
    getMappingPair,
    getMappingValueAsMapping,
    getMappingValueAsSequence,
    getScalarStringValue,
    getWorkflowEventNames,
    getWorkflowJobs,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Detect `actions/checkout` references. */
const isCheckoutActionReference = (reference: string): boolean =>
    reference.startsWith("actions/checkout@");

/** Detect risky PR-head references in checkout parameters. */
const hasPullRequestHeadReference = (value: string): boolean =>
    /\bgithub\.head_ref\b/u.test(value) ||
    /\bgithub\.event\.pull_request\.head\./u.test(value);

/**
 * Rule implementation for disallowing pull-request head checkouts in
 * pull_request_target.
 */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                const eventNames = getWorkflowEventNames(root);

                if (!eventNames.has("pull_request_target")) {
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

                        const usesPair = getMappingPair(stepMapping, "uses");
                        const usesReference = getScalarStringValue(
                            usesPair?.value ?? null
                        );

                        if (
                            usesPair === null ||
                            usesReference === null ||
                            !isCheckoutActionReference(usesReference)
                        ) {
                            continue;
                        }

                        const withMapping = getMappingValueAsMapping(
                            stepMapping,
                            "with"
                        );

                        if (withMapping === null) {
                            continue;
                        }

                        for (const key of ["ref", "repository"] as const) {
                            const optionPair = getMappingPair(withMapping, key);
                            const optionValue = getScalarStringValue(
                                optionPair?.value ?? null
                            );

                            if (
                                optionPair === null ||
                                optionValue === null ||
                                !hasPullRequestHeadReference(optionValue)
                            ) {
                                continue;
                            }

                            context.report({
                                data: {
                                    jobId: job.id,
                                    key,
                                },
                                messageId: "pullRequestHeadCheckout",
                                node: (optionPair.value ??
                                    optionPair) as unknown as Rule.Node,
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
                "github-actions.configs.security",
                "github-actions.configs.strict",
            ],
            description:
                "disallow `actions/checkout` configurations in `pull_request_target` workflows that fetch pull request head refs, SHAs, or repositories into a privileged run.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R030",
            ruleNumber: 30,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-pr-head-checkout-in-pull-request-target",
        },
        messages: {
            pullRequestHeadCheckout:
                "Job '{{jobId}}' uses `actions/checkout` with `with.{{key}}` pointing at pull request head content inside a `pull_request_target` workflow. Avoid checking out untrusted PR head code in this privileged trigger.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
