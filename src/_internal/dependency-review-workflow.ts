/**
 * @packageDocumentation
 * Helpers for workflows that use `actions/dependency-review-action`.
 */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- YAML AST nodes come from parser-owned mutable types shared across helper boundaries. */
import type { AST } from "yaml-eslint-parser";

import type { WorkflowJobEntry } from "./workflow-yaml.js";

import { getWorkflowActionSteps } from "./workflow-action-steps.js";

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
): readonly DependencyReviewActionStep[] =>
    getWorkflowActionSteps(root, isDependencyReviewActionReference);

/** Determine whether a workflow uses the dependency review action anywhere. */
export const hasDependencyReviewAction = (root: AST.YAMLMapping): boolean =>
    getDependencyReviewActionSteps(root).length > 0;

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable readonly-parameter checks outside parser AST helper signatures. */
