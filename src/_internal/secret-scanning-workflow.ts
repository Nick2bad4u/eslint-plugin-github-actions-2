/**
 * @packageDocumentation
 * Helpers for secret-scanning workflows such as Gitleaks and TruffleHog.
 */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- YAML AST nodes come from parser-owned mutable types shared across helper boundaries. */
import type { AST } from "yaml-eslint-parser";

import type { WorkflowActionStep } from "./workflow-action-steps.js";

import { getWorkflowActionSteps } from "./workflow-action-steps.js";

/** Determine whether a `uses` reference points to the Gitleaks action. */
export const isGitleaksActionReference = (usesReference: string): boolean =>
    usesReference.trim().startsWith("gitleaks/gitleaks-action@");

/** Determine whether a `uses` reference points to the TruffleHog action. */
export const isTrufflehogActionReference = (usesReference: string): boolean =>
    usesReference.trim().startsWith("trufflesecurity/trufflehog@");

/**
 * Determine whether a `uses` reference points to a supported secret scanning
 * action.
 */
export const isSecretScanningActionReference = (
    usesReference: string
): boolean =>
    isGitleaksActionReference(usesReference) ||
    isTrufflehogActionReference(usesReference);

/** Collect all supported secret scanning action steps in a workflow. */
export const getSecretScanningActionSteps = (
    root: AST.YAMLMapping
): readonly WorkflowActionStep[] =>
    getWorkflowActionSteps(root, isSecretScanningActionReference);

/** Collect all Gitleaks action steps in a workflow. */
export const getGitleaksActionSteps = (
    root: AST.YAMLMapping
): readonly WorkflowActionStep[] =>
    getWorkflowActionSteps(root, isGitleaksActionReference);

/** Collect all TruffleHog action steps in a workflow. */
export const getTrufflehogActionSteps = (
    root: AST.YAMLMapping
): readonly WorkflowActionStep[] =>
    getWorkflowActionSteps(root, isTrufflehogActionReference);

/** Determine whether a workflow uses any supported secret scanning action. */
export const hasSecretScanningAction = (root: AST.YAMLMapping): boolean =>
    getSecretScanningActionSteps(root).length > 0;

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable readonly-parameter checks outside parser AST helper signatures. */
