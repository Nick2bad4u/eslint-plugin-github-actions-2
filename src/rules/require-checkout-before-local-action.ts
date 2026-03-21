/**
 * @packageDocumentation
 * Require a checkout step before using repository-local actions.
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

/** Determine whether a step uses the checkout action. */
const isCheckoutActionReference = (reference: string): boolean =>
    reference.startsWith("actions/checkout@");

/** Determine whether a step uses a repository-local action path. */
const isLocalActionReference = (reference: string): boolean =>
    reference.startsWith("./");

/** Rule implementation for requiring checkout before local actions. */
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

                    let hasSeenCheckout = false;

                    for (const entry of stepsSequence.entries) {
                        const stepMapping = unwrapYamlValue(entry);

                        if (stepMapping?.type !== "YAMLMapping") {
                            continue;
                        }

                        const usesPair = getMappingPair(stepMapping, "uses");
                        const usesReference = getScalarStringValue(
                            usesPair?.value ?? null
                        );

                        if (usesPair === null || usesReference === null) {
                            continue;
                        }

                        if (isCheckoutActionReference(usesReference)) {
                            hasSeenCheckout = true;
                            continue;
                        }

                        if (
                            isLocalActionReference(usesReference) &&
                            !hasSeenCheckout
                        ) {
                            context.report({
                                data: {
                                    jobId: job.id,
                                    reference: usesReference,
                                },
                                messageId: "missingCheckoutBeforeLocalAction",
                                node: (usesPair.value ??
                                    usesPair) as unknown as Rule.Node,
                            });
                        }
                    }
                }
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.recommended",
                "github-actions.configs.strict",
            ],
            description:
                "require an `actions/checkout` step before using repository-local step actions so local action paths resolve reliably.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R025",
            ruleNumber: 25,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-checkout-before-local-action",
        },
        messages: {
            missingCheckoutBeforeLocalAction:
                "Job '{{jobId}}' uses local action '{{reference}}' before any `actions/checkout` step. Check out the repository first.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
