/**
 * @packageDocumentation
 * Shared helpers for workflow steps that use actions or run shell scripts.
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

/** Workflow step using an external action via `uses`. */
export type WorkflowActionStep = {
    readonly job: WorkflowJobEntry;
    readonly stepMapping: AST.YAMLMapping;
    readonly usesPair: AST.YAMLPair;
    readonly usesReference: string;
};

/** Workflow step running a shell script via `run`. */
export type WorkflowRunStep = {
    readonly job: WorkflowJobEntry;
    readonly runPair: AST.YAMLPair;
    readonly runScript: string;
    readonly stepMapping: AST.YAMLMapping;
};

/**
 * Collect workflow steps using actions whose `uses` reference matches a
 * predicate.
 */
export const getWorkflowActionSteps = (
    root: AST.YAMLMapping,
    matchesReference: (usesReference: string) => boolean
): readonly WorkflowActionStep[] => {
    const steps: WorkflowActionStep[] = [];

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

            if (!matchesReference(usesReference)) {
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

/**
 * Determine whether any workflow step uses an action whose reference matches a
 * predicate.
 */
export const hasWorkflowActionStep = (
    root: AST.YAMLMapping,
    matchesReference: (usesReference: string) => boolean
): boolean => getWorkflowActionSteps(root, matchesReference).length > 0;

/** Collect workflow run steps whose run script matches a predicate. */
export const getWorkflowRunSteps = (
    root: AST.YAMLMapping,
    matchesRunScript: (runScript: string) => boolean
): readonly WorkflowRunStep[] => {
    const steps: WorkflowRunStep[] = [];

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

            const runPair = getMappingPair(stepMapping, "run");
            const runScript = getScalarStringValue(runPair?.value ?? null);

            if (runPair === null || runScript === null) {
                continue;
            }

            if (!matchesRunScript(runScript)) {
                continue;
            }

            steps.push({
                job,
                runPair,
                runScript,
                stepMapping,
            });
        }
    }

    return steps;
};

/** Determine whether any workflow run step matches a script predicate. */
export const hasWorkflowRunStep = (
    root: AST.YAMLMapping,
    matchesRunScript: (runScript: string) => boolean
): boolean => getWorkflowRunSteps(root, matchesRunScript).length > 0;

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable readonly-parameter checks outside parser AST helper signatures. */
