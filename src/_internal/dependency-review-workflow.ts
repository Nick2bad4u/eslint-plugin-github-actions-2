/**
 * @packageDocumentation
 * Helpers for workflows that use `actions/dependency-review-action`.
 */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- YAML AST nodes come from parser-owned mutable types shared across helper boundaries. */
import type { AST } from "yaml-eslint-parser";

import {
    getMappingPair,
    getMappingValueAsSequence,
    getScalarStringValue,
    getWorkflowJobs,
    unwrapYamlValue,
    type WorkflowJobEntry,
} from "./workflow-yaml.js";

/** Workflow step using the dependency review action. */
export type DependencyReviewActionStep = {
    readonly job: WorkflowJobEntry;
    readonly stepMapping: AST.YAMLMapping;
    readonly usesPair: AST.YAMLPair;
    readonly usesReference: string;
};

/** Determine whether a `uses` reference points to the dependency review action. */
export const isDependencyReviewActionReference = (
    usesReference: string
): boolean =>
    usesReference.trim().startsWith("actions/dependency-review-action@");

/** Collect all workflow steps that use the dependency review action. */
export const getDependencyReviewActionSteps = (
    root: AST.YAMLMapping
): readonly DependencyReviewActionStep[] => {
    const steps: DependencyReviewActionStep[] = [];

    for (const job of getWorkflowJobs(root)) {
        const stepsSequence = getMappingValueAsSequence(job.mapping, "steps");

        if (stepsSequence === null) {
            continue;
        }

        for (const entry of stepsSequence.entries) {
            const stepMapping = unwrapYamlValue(entry);

            if (stepMapping?.type !== "YAMLMapping") {
                continue;
            }

            const usesPair = getMappingPair(stepMapping, "uses");
            const usesReference = getScalarStringValue(usesPair?.value ?? null);

            if (usesPair === null || usesReference === null) {
                continue;
            }

            if (!isDependencyReviewActionReference(usesReference)) {
                continue;
            }

            steps.push({
                job,
                stepMapping,
                usesPair,
                usesReference,
            });
        }
    }

    return steps;
};

/** Determine whether a workflow uses the dependency review action anywhere. */
export const hasDependencyReviewAction = (root: AST.YAMLMapping): boolean =>
    getDependencyReviewActionSteps(root).length > 0;

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable readonly-parameter checks outside parser AST helper signatures. */
