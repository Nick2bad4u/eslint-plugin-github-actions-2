/**
 * @packageDocumentation
 * Require immutable full-length SHA pins for third-party actions and reusable workflows.
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

/** Full commit SHA pattern recommended by GitHub for pinning action refs. */
const FULL_SHA_PATTERN = /^[0-9a-f]{40}$/u;

/** Determine whether a `uses` reference is a local action path. */
const isLocalActionReference = (reference: string): boolean =>
    reference.startsWith("./");

/** Determine whether a `uses` reference is a Docker image reference. */
const isDockerReference = (reference: string): boolean =>
    reference.startsWith("docker://");

/** Determine whether a `uses` reference targets a reusable workflow. */
const isReusableWorkflowReference = (reference: string): boolean =>
    reference.includes("/.github/workflows/");

/** Extract the ref segment after the final `@` delimiter. */
const getReferenceRef = (reference: string): null | string => {
    const delimiterIndex = reference.lastIndexOf("@");

    return delimiterIndex === -1 ? null : reference.slice(delimiterIndex + 1);
};

/** Determine whether a GitHub `uses` reference must be SHA pinned. */
const shouldValidateUsesReference = (reference: string): boolean =>
    !isLocalActionReference(reference) && !isDockerReference(reference);

/**
 * Rule implementation for requiring immutable SHA pins on external uses
 * references.
 */
const rule: Rule.RuleModule = {
    create(context) {
        const reportReference = (
            node: NonNullable<Rule.Node>,
            reference: string
        ): void => {
            if (!shouldValidateUsesReference(reference)) {
                return;
            }

            const ref = getReferenceRef(reference);

            if (ref === null || FULL_SHA_PATTERN.test(ref)) {
                return;
            }

            context.report({
                data: {
                    ref,
                    reference,
                },
                messageId: isReusableWorkflowReference(reference)
                    ? "unpinnedReusableWorkflow"
                    : "unpinnedAction",
                node,
            });
        };

        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                for (const job of getWorkflowJobs(root)) {
                    const reusableWorkflowPair = getMappingPair(
                        job.mapping,
                        "uses"
                    );
                    const reusableWorkflowReference = getScalarStringValue(
                        reusableWorkflowPair?.value ?? null
                    );

                    if (
                        reusableWorkflowPair !== null &&
                        reusableWorkflowReference !== null
                    ) {
                        reportReference(
                            (reusableWorkflowPair.value ??
                                reusableWorkflowPair) as unknown as Rule.Node,
                            reusableWorkflowReference
                        );
                    }

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

                        if (usesPair === null || usesReference === null) {
                            continue;
                        }

                        reportReference(
                            (usesPair.value ??
                                usesPair) as unknown as Rule.Node,
                            usesReference
                        );
                    }
                }
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.security",
                "github-actions.configs.strict",
            ],
            description:
                "require third-party `uses` references to pin full-length commit SHAs instead of mutable tags or branches.",
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R003",
            ruleNumber: 3,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/pin-action-shas",
        },
        messages: {
            unpinnedAction:
                "Action reference '{{reference}}' should pin a full 40-character commit SHA instead of '{{ref}}'.",
            unpinnedReusableWorkflow:
                "Reusable workflow reference '{{reference}}' should pin a full 40-character commit SHA instead of '{{ref}}'.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
