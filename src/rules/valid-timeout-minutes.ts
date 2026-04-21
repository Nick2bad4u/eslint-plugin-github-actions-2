/**
 * @packageDocumentation
 * Validate literal job and step timeout-minutes values.
 */
import type { Rule } from "eslint";
import type { UnknownRecord } from "type-fest";
import type { AST } from "yaml-eslint-parser";

import { isDefined, isInteger, keyIn } from "ts-extras";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getMappingValueAsSequence,
    getScalarNumberValue,
    getWorkflowRoot,
    isGithubExpressionScalar,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Timeout range accepted by a timeout validator. */
type TimeoutRange = {
    readonly max?: number;
    readonly min?: number;
};

/** Split timeout configuration for jobs and steps. */
type TimeoutScopeOptions = {
    readonly job?: number | TimeoutRange;
    readonly step?: number | TimeoutRange;
};

/** Rule options for `valid-timeout-minutes`. */
type ValidTimeoutMinutesOptions = [
    (number | TimeoutRange | TimeoutScopeOptions)?,
];

/** Default lower bound for literal timeout-minutes values. */
const MIN_TIMEOUT_MINUTES = 1;

/** Default upper bound for literal timeout-minutes values. */
const MAX_TIMEOUT_MINUTES = 24 * 60;

/** Default recommended upper bound when only a single number is configured. */
const DEFAULT_MAX_TIMEOUT_MINUTES = 6 * 60;

/** Normalize timeout range input into concrete min/max bounds. */
const normalizeTimeoutRange = (
    value: Readonly<number | TimeoutRange | undefined>,
    fallback: Readonly<{ max: number; min: number }>
): { max: number; min: number } => {
    if (typeof value === "number") {
        return {
            max: value,
            min: fallback.min,
        };
    }

    if (!isDefined(value)) {
        return {
            max: fallback.max,
            min: fallback.min,
        };
    }

    return {
        max: value.max ?? fallback.max,
        min: value.min ?? fallback.min,
    };
};

/** Determine whether an options value represents a shared timeout range. */
const isTimeoutRange = (value: unknown): value is TimeoutRange =>
    typeof value === "object" &&
    value !== null &&
    (keyIn(value as UnknownRecord, "min") ||
        keyIn(value as UnknownRecord, "max"));

/** Determine whether an options value represents split job/step timeout config. */
const isTimeoutScopeOptions = (value: unknown): value is TimeoutScopeOptions =>
    typeof value === "object" &&
    value !== null &&
    (keyIn(value as UnknownRecord, "job") ||
        keyIn(value as UnknownRecord, "step"));

/** Rule implementation for validating timeout-minutes ranges. */
const rule: Rule.RuleModule = {
    create(context) {
        const [options] = context.options as ValidTimeoutMinutesOptions;
        const defaultRange = {
            max: DEFAULT_MAX_TIMEOUT_MINUTES,
            min: MIN_TIMEOUT_MINUTES,
        };
        const workflowMaximumRange = {
            max: MAX_TIMEOUT_MINUTES,
        };

        const jobRange = normalizeTimeoutRange(
            typeof options === "number" || isTimeoutRange(options)
                ? options
                : options?.job,
            defaultRange
        );
        const stepRange = normalizeTimeoutRange(
            typeof options === "number" || isTimeoutRange(options)
                ? options
                : options?.step,
            defaultRange
        );

        if (isTimeoutScopeOptions(options)) {
            jobRange.max = normalizeTimeoutRange(options.job, defaultRange).max;
            jobRange.min = normalizeTimeoutRange(options.job, defaultRange).min;
            stepRange.max = normalizeTimeoutRange(
                options.step,
                defaultRange
            ).max;
            stepRange.min = normalizeTimeoutRange(
                options.step,
                defaultRange
            ).min;
        }

        const validateTimeoutPair = (
            timeoutPair: Readonly<AST.YAMLPair>,
            range: Readonly<{ max: number; min: number }>
        ): "invalidRange" | "notInteger" | null => {
            if (isGithubExpressionScalar(timeoutPair.value)) {
                return null;
            }

            const timeoutValue = getScalarNumberValue(timeoutPair.value);

            if (
                timeoutValue === null ||
                !isInteger(timeoutValue) ||
                timeoutValue <= 0
            ) {
                return "notInteger";
            }

            if (
                timeoutValue < range.min ||
                timeoutValue > range.max ||
                timeoutValue > workflowMaximumRange.max
            ) {
                return "invalidRange";
            }

            return null;
        };

        return {
            Program() {
                if (!isWorkflowFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                const jobsMapping = getMappingValueAsMapping(root, "jobs");

                if (jobsMapping === null) {
                    return;
                }

                for (const jobPair of jobsMapping.pairs) {
                    const jobValue = unwrapYamlValue(jobPair.value);

                    if (jobValue?.type !== "YAMLMapping") {
                        continue;
                    }

                    const jobTimeoutPair = getMappingPair(
                        jobValue,
                        "timeout-minutes"
                    );

                    if (jobTimeoutPair !== null) {
                        const validationResult = validateTimeoutPair(
                            jobTimeoutPair,
                            jobRange
                        );

                        if (validationResult !== null) {
                            context.report({
                                data: {
                                    max: String(jobRange.max),
                                    min: String(jobRange.min),
                                },
                                messageId: validationResult,
                                node: (jobTimeoutPair.value ??
                                    jobTimeoutPair) as unknown as Rule.Node,
                            });
                        }
                    }

                    const stepsSequence = getMappingValueAsSequence(
                        jobValue,
                        "steps"
                    );

                    if (stepsSequence === null) {
                        continue;
                    }

                    for (const stepEntry of stepsSequence.entries) {
                        const stepValue = unwrapYamlValue(stepEntry);

                        if (stepValue?.type !== "YAMLMapping") {
                            continue;
                        }

                        const stepTimeoutPair = getMappingPair(
                            stepValue,
                            "timeout-minutes"
                        );

                        if (stepTimeoutPair === null) {
                            continue;
                        }

                        const validationResult = validateTimeoutPair(
                            stepTimeoutPair,
                            stepRange
                        );

                        if (validationResult !== null) {
                            context.report({
                                data: {
                                    max: String(stepRange.max),
                                    min: String(stepRange.min),
                                },
                                messageId: validationResult,
                                node: (stepTimeoutPair.value ??
                                    stepTimeoutPair) as unknown as Rule.Node,
                            });
                        }
                    }
                }
            },
        };
    },
    meta: {
        defaultOptions: [DEFAULT_MAX_TIMEOUT_MINUTES],
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.recommended",
                "github-actions.configs.strict",
            ],
            description:
                "disallow invalid literal `timeout-minutes` values for jobs and steps.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R017",
            ruleNumber: 17,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/valid-timeout-minutes",
        },
        messages: {
            invalidRange:
                "`timeout-minutes` must stay within the configured range of {{min}}-{{max}}.",
            notInteger:
                "`timeout-minutes` must be a positive integer or a GitHub expression.",
        },
        schema: [
            {
                anyOf: [
                    {
                        description:
                            "Maximum allowed timeout-minutes value for both jobs and steps.",
                        maximum: MAX_TIMEOUT_MINUTES,
                        minimum: MIN_TIMEOUT_MINUTES,
                        type: "integer",
                    },
                    {
                        additionalProperties: false,
                        description:
                            "Shared min/max range for literal job and step timeout-minutes values.",
                        properties: {
                            max: {
                                description:
                                    "Maximum allowed timeout-minutes value.",
                                maximum: MAX_TIMEOUT_MINUTES,
                                minimum: MIN_TIMEOUT_MINUTES,
                                type: "integer",
                            },
                            min: {
                                description:
                                    "Minimum allowed timeout-minutes value.",
                                maximum: MAX_TIMEOUT_MINUTES,
                                minimum: MIN_TIMEOUT_MINUTES,
                                type: "integer",
                            },
                        },
                        type: "object",
                    },
                    {
                        additionalProperties: false,
                        description:
                            "Separate timeout-minutes limits for jobs and steps.",
                        properties: {
                            job: {
                                anyOf: [
                                    {
                                        description:
                                            "Maximum allowed timeout-minutes value for jobs.",
                                        maximum: MAX_TIMEOUT_MINUTES,
                                        minimum: MIN_TIMEOUT_MINUTES,
                                        type: "integer",
                                    },
                                    {
                                        additionalProperties: false,
                                        description:
                                            "Min/max range for literal job timeout-minutes values.",
                                        properties: {
                                            max: {
                                                description:
                                                    "Maximum allowed job timeout-minutes value.",
                                                maximum: MAX_TIMEOUT_MINUTES,
                                                minimum: MIN_TIMEOUT_MINUTES,
                                                type: "integer",
                                            },
                                            min: {
                                                description:
                                                    "Minimum allowed job timeout-minutes value.",
                                                maximum: MAX_TIMEOUT_MINUTES,
                                                minimum: MIN_TIMEOUT_MINUTES,
                                                type: "integer",
                                            },
                                        },
                                        type: "object",
                                    },
                                ],
                            },
                            step: {
                                anyOf: [
                                    {
                                        description:
                                            "Maximum allowed timeout-minutes value for steps.",
                                        maximum: MAX_TIMEOUT_MINUTES,
                                        minimum: MIN_TIMEOUT_MINUTES,
                                        type: "integer",
                                    },
                                    {
                                        additionalProperties: false,
                                        description:
                                            "Min/max range for literal step timeout-minutes values.",
                                        properties: {
                                            max: {
                                                description:
                                                    "Maximum allowed step timeout-minutes value.",
                                                maximum: MAX_TIMEOUT_MINUTES,
                                                minimum: MIN_TIMEOUT_MINUTES,
                                                type: "integer",
                                            },
                                            min: {
                                                description:
                                                    "Minimum allowed step timeout-minutes value.",
                                                maximum: MAX_TIMEOUT_MINUTES,
                                                minimum: MIN_TIMEOUT_MINUTES,
                                                type: "integer",
                                            },
                                        },
                                        type: "object",
                                    },
                                ],
                            },
                        },
                        type: "object",
                    },
                ],
                description:
                    "Configure literal timeout-minutes validation for jobs and steps.",
            },
        ],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
