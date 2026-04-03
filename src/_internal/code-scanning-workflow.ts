/**
 * @packageDocumentation
 * Helpers for CodeQL, SARIF, and code-scanning related workflows.
 */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- YAML AST nodes come from parser-owned mutable types shared across helper boundaries. */
import type { AST } from "yaml-eslint-parser";

import type { WorkflowActionStep } from "./workflow-action-steps.js";

import { getWorkflowActionSteps } from "./workflow-action-steps.js";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getMappingValueAsSequence,
    getScalarStringValue,
} from "./workflow-yaml.js";

const codeqlLanguageAliases = new Set([
    "javascript",
    "javascript-typescript",
    "typescript",
]);

const matrixLanguageExpression = `\${{ matrix.language }}`;

/** Determine whether a `uses` reference points to a specific CodeQL action step. */
const isCodeqlActionReference = (
    usesReference: string,
    actionName: string
): boolean =>
    usesReference.trim().startsWith(`github/codeql-action/${actionName}@`);

/** Determine whether a `uses` reference points to the CodeQL init action. */
export const isCodeqlInitReference = (usesReference: string): boolean =>
    isCodeqlActionReference(usesReference, "init");

/** Determine whether a `uses` reference points to the CodeQL analyze action. */
export const isCodeqlAnalyzeReference = (usesReference: string): boolean =>
    isCodeqlActionReference(usesReference, "analyze");

/** Determine whether a `uses` reference points to the CodeQL autobuild action. */
export const isCodeqlAutobuildReference = (usesReference: string): boolean =>
    isCodeqlActionReference(usesReference, "autobuild");

/**
 * Determine whether a `uses` reference points to the CodeQL SARIF upload
 * action.
 */
export const isSarifUploadReference = (usesReference: string): boolean =>
    isCodeqlActionReference(usesReference, "upload-sarif");

/** Determine whether a `uses` reference points to the Scorecard action. */
export const isScorecardActionReference = (usesReference: string): boolean =>
    usesReference.trim().startsWith("ossf/scorecard-action@");

/** Collect all CodeQL init steps in a workflow. */
export const getCodeqlInitSteps = (
    root: AST.YAMLMapping
): readonly WorkflowActionStep[] =>
    getWorkflowActionSteps(root, isCodeqlInitReference);

/** Collect all CodeQL analyze steps in a workflow. */
export const getCodeqlAnalyzeSteps = (
    root: AST.YAMLMapping
): readonly WorkflowActionStep[] =>
    getWorkflowActionSteps(root, isCodeqlAnalyzeReference);

/** Collect all CodeQL autobuild steps in a workflow. */
export const getCodeqlAutobuildSteps = (
    root: AST.YAMLMapping
): readonly WorkflowActionStep[] =>
    getWorkflowActionSteps(root, isCodeqlAutobuildReference);

/** Collect all CodeQL SARIF upload steps in a workflow. */
export const getSarifUploadSteps = (
    root: AST.YAMLMapping
): readonly WorkflowActionStep[] =>
    getWorkflowActionSteps(root, isSarifUploadReference);

/** Collect all Scorecard action steps in a workflow. */
export const getScorecardSteps = (
    root: AST.YAMLMapping
): readonly WorkflowActionStep[] =>
    getWorkflowActionSteps(root, isScorecardActionReference);

/**
 * Resolve literal language values used by a CodeQL init step when statically
 * knowable.
 */
export const getCodeqlLanguageValues = (
    step: WorkflowActionStep
): readonly string[] => {
    const languagesMappingValue = getScalarStringValue(
        getMappingPair(
            getMappingValueAsMapping(step.stepMapping, "with") ??
                step.stepMapping,
            "languages"
        )?.value ?? null
    )?.trim();

    if (
        languagesMappingValue === undefined ||
        languagesMappingValue.length === 0
    ) {
        return [];
    }

    if (languagesMappingValue === matrixLanguageExpression) {
        const strategyMapping = getMappingValueAsMapping(
            step.job.mapping,
            "strategy"
        );
        const matrixMapping =
            strategyMapping === null
                ? null
                : getMappingValueAsMapping(strategyMapping, "matrix");

        if (matrixMapping === null) {
            return [];
        }

        const languageSequence = getMappingValueAsSequence(
            matrixMapping,
            "language"
        );

        if (languageSequence !== null) {
            return languageSequence.entries
                .map((entry) => getScalarStringValue(entry)?.trim() ?? null)
                .filter(
                    (value): value is string =>
                        value !== null && value.length > 0
                );
        }

        const singleLanguage = getScalarStringValue(
            getMappingPair(matrixMapping, "language")?.value ?? null
        )?.trim();

        return singleLanguage === undefined || singleLanguage.length === 0
            ? []
            : [singleLanguage];
    }

    return languagesMappingValue
        .split(",")
        .map((value) => value.trim())
        .filter((value) => value.length > 0);
};

/** Determine whether all statically resolved CodeQL languages are JS/TS aliases. */
export const codeqlLanguagesAreOnlyJavaScriptTypeScript = (
    languages: readonly string[]
): boolean =>
    languages.length > 0 &&
    languages.every((language) => codeqlLanguageAliases.has(language));

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable readonly-parameter checks outside parser AST helper signatures. */
