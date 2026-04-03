/**
 * @packageDocumentation
 * Helpers for workflows that automate Dependabot pull requests.
 */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- YAML AST nodes come from parser-owned mutable types shared across helper boundaries. */
import type { AST } from "yaml-eslint-parser";

import type {
    WorkflowActionStep,
    WorkflowRunStep,
} from "./workflow-action-steps.js";

import {
    getWorkflowActionSteps,
    getWorkflowRunSteps,
    hasWorkflowRunStep,
} from "./workflow-action-steps.js";

/**
 * Determine whether a `uses` reference points to the Dependabot fetch-metadata
 * action.
 */
export const isDependabotFetchMetadataReference = (
    usesReference: string
): boolean => usesReference.trim().startsWith("dependabot/fetch-metadata@");

/** Determine whether a run step edits a pull request via `gh pr edit`. */
export const isGhPrEditRunScript = (runScript: string): boolean =>
    /\bgh\s+pr\s+edit\b/u.test(runScript);

/** Determine whether a run step reviews a pull request via `gh pr review`. */
export const isGhPrReviewRunScript = (runScript: string): boolean =>
    /\bgh\s+pr\s+review\b/u.test(runScript);

/** Determine whether a run step merges a pull request via `gh pr merge`. */
export const isGhPrMergeRunScript = (runScript: string): boolean =>
    /\bgh\s+pr\s+merge\b/u.test(runScript);

/** Determine whether a run step automates a pull request via GitHub CLI. */
export const isDependabotAutomationRunScript = (runScript: string): boolean =>
    isGhPrEditRunScript(runScript) ||
    isGhPrReviewRunScript(runScript) ||
    isGhPrMergeRunScript(runScript);

/** Collect all Dependabot fetch-metadata action steps in a workflow. */
export const getDependabotFetchMetadataSteps = (
    root: AST.YAMLMapping
): readonly WorkflowActionStep[] =>
    getWorkflowActionSteps(root, isDependabotFetchMetadataReference);

/** Collect all GitHub CLI run steps that automate pull requests. */
export const getDependabotAutomationRunSteps = (
    root: AST.YAMLMapping
): readonly WorkflowRunStep[] =>
    getWorkflowRunSteps(root, isDependabotAutomationRunScript);

/** Determine whether a workflow contains recognized Dependabot automation steps. */
export const hasDependabotAutomation = (root: AST.YAMLMapping): boolean =>
    getDependabotFetchMetadataSteps(root).length > 0 ||
    hasWorkflowRunStep(root, isDependabotAutomationRunScript);

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable readonly-parameter checks outside parser AST helper signatures. */
