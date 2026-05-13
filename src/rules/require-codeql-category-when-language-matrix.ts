/**
 * @packageDocumentation
 * Require CodeQL analyze steps to set a category that includes the matrix language when a language matrix is used.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { getCodeqlAnalyzeSteps } from "../_internal/code-scanning-workflow.js";
import { isWorkflowFile } from "../_internal/lint-targets.js";
import { reportYamlNode } from "../_internal/report.js";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getMappingValueAsSequence,
    getScalarStringValue,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- YAML AST nodes are parser-owned mutable structures. */
/** Determine whether a matrix defines a `language` dimension. */
const matrixUsesLanguage = (matrixMapping: AST.YAMLMapping): boolean => {
    if (getMappingPair(matrixMapping, "language") !== null) {
        return true;
    }

    const includeSequence = getMappingValueAsSequence(matrixMapping, "include");

    if (includeSequence === null) {
        return false;
    }

    for (const includeEntry of includeSequence.entries) {
        if (includeEntry?.type !== "YAMLMapping") {
            continue;
        }

        if (getMappingPair(includeEntry, "language") !== null) {
            return true;
        }
    }

    return false;
};
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable readonly-parameter checks outside YAML AST helper signatures. */

/**
 * Rule implementation for requiring CodeQL category when matrix.language is
 * used.
 */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                if (!isWorkflowFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                for (const step of getCodeqlAnalyzeSteps(root)) {
                    const strategyMapping = getMappingValueAsMapping(
                        step.job.mapping,
                        "strategy"
                    );
                    const matrixMapping =
                        strategyMapping === null
                            ? null
                            : getMappingValueAsMapping(
                                  strategyMapping,
                                  "matrix"
                              );

                    if (
                        matrixMapping === null ||
                        !matrixUsesLanguage(matrixMapping)
                    ) {
                        continue;
                    }

                    const withMapping = getMappingValueAsMapping(
                        step.stepMapping,
                        "with"
                    );
                    const categoryPair =
                        withMapping === null
                            ? null
                            : getMappingPair(withMapping, "category");
                    const categoryValue = getScalarStringValue(
                        categoryPair?.value ?? null
                    )?.trim();

                    if (categoryValue?.includes("matrix.language") === true) {
                        continue;
                    }

                    reportYamlNode(context, {
                        data: { jobId: step.job.id },
                        messageId: "missingCategoryForLanguageMatrix",
                        node:
                            categoryPair?.value ??
                            categoryPair ??
                            withMapping ??
                            step.usesPair,
                    });
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.codeScanning",
            ],
            description:
                "require CodeQL analyze steps to set `with.category` using `matrix.language` when the job uses a language matrix.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R114",
            ruleNumber: 114,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-codeql-category-when-language-matrix",
        },
        messages: {
            missingCategoryForLanguageMatrix:
                "CodeQL analyze step in job '{{jobId}}' should set `with.category` to include `matrix.language` when a language matrix is used.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
