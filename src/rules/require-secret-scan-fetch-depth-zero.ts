/**
 * @packageDocumentation
 * Require secret scanning workflows to checkout full history.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import { getSecretScanningActionSteps } from "../_internal/secret-scanning-workflow.ts";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getMappingValueAsSequence,
    getScalarNumberValue,
    getScalarStringValue,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

const isCheckoutReference = (usesReference: string): boolean =>
    usesReference.trim().startsWith("actions/checkout@");

/**
 * Determine whether a step entry is a compliant `actions/checkout` with
 * `fetch-depth: 0`.
 */
const isCompliantCheckoutStep = (
    stepMapping: Readonly<AST.YAMLMapping>
): boolean => {
    const usesReference = getScalarStringValue(
        getMappingPair(stepMapping, "uses")?.value ?? null
    );

    if (usesReference === null || !isCheckoutReference(usesReference)) {
        return false;
    }

    const withMapping = getMappingValueAsMapping(stepMapping, "with");
    const fetchDepthPair =
        withMapping === null
            ? null
            : getMappingPair(withMapping, "fetch-depth");
    const fetchDepthNumber = getScalarNumberValue(
        fetchDepthPair?.value ?? null
    );
    const fetchDepthString = getScalarStringValue(
        fetchDepthPair?.value ?? null
    )?.trim();

    return fetchDepthNumber === 0 || fetchDepthString === "0";
};

/**
 * Determine whether a steps sequence contains at least one compliant checkout
 * step with `fetch-depth: 0`.
 */
const hasCompliantCheckoutInSequence = (
    stepsSequence: Readonly<AST.YAMLSequence>
): boolean => {
    for (const entry of stepsSequence.entries) {
        const stepMapping = unwrapYamlValue(entry);

        if (stepMapping?.type !== "YAMLMapping") {
            continue;
        }

        if (isCompliantCheckoutStep(stepMapping)) {
            return true;
        }
    }

    return false;
};

/** Rule implementation for fetch-depth zero requirements on secret scanners. */
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

                for (const scanStep of getSecretScanningActionSteps(root)) {
                    const stepsSequence = getMappingValueAsSequence(
                        scanStep.job.mapping,
                        "steps"
                    );

                    if (
                        stepsSequence !== null &&
                        hasCompliantCheckoutInSequence(stepsSequence)
                    ) {
                        continue;
                    }

                    context.report({
                        data: { jobId: scanStep.job.id },
                        messageId: "missingFetchDepthZero",
                        node: scanStep.job.idNode as unknown as Rule.Node,
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
                "github-actions.configs.security",
            ],
            description:
                "require secret scanning workflows to checkout full history with `fetch-depth: 0`.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R105",
            ruleNumber: 105,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-secret-scan-fetch-depth-zero",
        },
        messages: {
            missingFetchDepthZero:
                "Job '{{jobId}}' runs a secret scanner and should checkout repository history with `fetch-depth: 0`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
