/**
 * @packageDocumentation
 * Enforce a consistent style for step-level `uses:` references.
 */
import type { Rule } from "eslint";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getMappingValueAsSequence,
    getScalarStringValue,
    getWorkflowJobs,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Supported `uses:` reference styles. */
const usesStyles = [
    "branch",
    "commit",
    "release",
] as const;

/** Object-style configuration for `prefer-step-uses-style`. */
type PreferStepUsesStyleObjectOption = Partial<
    Record<StepUsesStyle, boolean>
> & {
    readonly allowDocker?: boolean;
    readonly allowRepository?: boolean;
    readonly ignores?: readonly string[];
};

/** String literal union of supported `uses:` styles. */
type StepUsesStyle = (typeof usesStyles)[number];

/** Default `uses:` style enforced by the rule. */
const DEFAULT_STEP_USES_STYLE: StepUsesStyle = "commit";

/** Normalize prefer-step-uses-style options into a consistent runtime shape. */
const normalizeStepUsesStyleOptions = (
    option: Readonly<
        PreferStepUsesStyleObjectOption | StepUsesStyle | undefined
    >
): {
    allowDocker: boolean;
    allowedStyles: readonly StepUsesStyle[];
    allowRepository: boolean;
    ignoredReferences: readonly string[];
} => {
    if (option === undefined || typeof option === "string") {
        return {
            allowDocker: false,
            allowedStyles: [option ?? DEFAULT_STEP_USES_STYLE],
            allowRepository: false,
            ignoredReferences: [],
        };
    }

    const allowedStyles = usesStyles.filter((style) => option[style] === true);

    return {
        allowDocker: option.allowDocker ?? false,
        allowedStyles:
            allowedStyles.length > 0
                ? allowedStyles
                : [DEFAULT_STEP_USES_STYLE],
        allowRepository: option.allowRepository ?? false,
        ignoredReferences: [...(option.ignores ?? [])],
    };
};

/** Parse a step-level `uses:` reference into its normalized style. */
const parseStepUsesReference = (
    reference: string
): {
    isDocker: boolean;
    isRepository: boolean;
    style: StepUsesStyle;
} => {
    if (reference.startsWith("./")) {
        return {
            isDocker: false,
            isRepository: true,
            style: DEFAULT_STEP_USES_STYLE,
        };
    }

    if (reference.startsWith("docker://")) {
        return {
            isDocker: true,
            isRepository: false,
            style: DEFAULT_STEP_USES_STYLE,
        };
    }

    const delimiterIndex = reference.lastIndexOf("@");
    const ref =
        delimiterIndex === -1 ? "" : reference.slice(delimiterIndex + 1);

    let isReleaseStyle = ref.startsWith("v") && ref.length > 1;

    if (isReleaseStyle) {
        for (const character of ref.slice(1)) {
            if (character !== "." && (character < "0" || character > "9")) {
                isReleaseStyle = false;
                break;
            }
        }
    }

    if (/^[0-9a-f]{40}$/u.test(ref)) {
        return {
            isDocker: false,
            isRepository: false,
            style: "commit",
        };
    }

    if (isReleaseStyle) {
        return {
            isDocker: false,
            isRepository: false,
            style: "release",
        };
    }

    return {
        isDocker: false,
        isRepository: false,
        style: "branch",
    };
};

/** Rule implementation for enforcing step-level `uses:` reference style. */
const rule: Rule.RuleModule = {
    create(context) {
        const [option] = context.options as [
            (PreferStepUsesStyleObjectOption | StepUsesStyle)?,
        ];
        const {
            allowDocker,
            allowedStyles,
            allowRepository,
            ignoredReferences,
        } = normalizeStepUsesStyleOptions(option ?? undefined);

        return {
            Program() {
                if (!isWorkflowFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                for (const job of getWorkflowJobs(root)) {
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

                        if (ignoredReferences.includes(usesReference)) {
                            continue;
                        }

                        const parsedReference =
                            parseStepUsesReference(usesReference);

                        if (parsedReference.isRepository) {
                            if (!allowRepository) {
                                context.report({
                                    messageId: "repositoryActionDisallowed",
                                    node: (usesPair.value ??
                                        usesPair) as unknown as Rule.Node,
                                });
                            }

                            continue;
                        }

                        if (parsedReference.isDocker) {
                            if (!allowDocker) {
                                context.report({
                                    messageId: "dockerActionDisallowed",
                                    node: (usesPair.value ??
                                        usesPair) as unknown as Rule.Node,
                                });
                            }

                            continue;
                        }

                        if (!allowedStyles.includes(parsedReference.style)) {
                            context.report({
                                data: {
                                    style: parsedReference.style,
                                },
                                messageId: "styleDisallowed",
                                node: (usesPair.value ??
                                    usesPair) as unknown as Rule.Node,
                            });
                        }
                    }
                }
            },
        };
    },
    meta: {
        defaultOptions: [DEFAULT_STEP_USES_STYLE],
        deprecated: false,
        docs: {
            configs: ["github-actions.configs.all"],
            description:
                "enforce a consistent style for step-level `uses` references.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R016",
            ruleNumber: 16,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/prefer-step-uses-style",
        },
        messages: {
            dockerActionDisallowed:
                "Docker-based `uses` references are disallowed by this rule configuration.",
            repositoryActionDisallowed:
                "Repository-local `uses` references are disallowed by this rule configuration.",
            styleDisallowed:
                "Step `uses` references with style '{{style}}' are disallowed by this rule configuration.",
        },
        schema: [
            {
                anyOf: [
                    {
                        description:
                            "Single allowed style for step-level `uses` references.",
                        enum: usesStyles,
                        type: "string",
                    },
                    {
                        additionalProperties: false,
                        description:
                            "Allowed styles and exceptions for step-level `uses` references.",
                        properties: {
                            allowDocker: {
                                description:
                                    "Allow Docker-based step `uses` references such as docker://alpine:3.20.",
                                type: "boolean",
                            },
                            allowRepository: {
                                description:
                                    "Allow repository-local step `uses` references such as ./.github/actions/foo.",
                                type: "boolean",
                            },
                            branch: {
                                description:
                                    "Allow branch-style references such as @main.",
                                type: "boolean",
                            },
                            commit: {
                                description:
                                    "Allow full-commit-SHA references such as @0123...abcd.",
                                type: "boolean",
                            },
                            ignores: {
                                description:
                                    "Literal step `uses` references that should be ignored by this rule.",
                                items: {
                                    type: "string",
                                },
                                type: "array",
                                uniqueItems: true,
                            },
                            release: {
                                description:
                                    "Allow release-style references such as @v4 or @v4.2.0.",
                                type: "boolean",
                            },
                        },
                        type: "object",
                    },
                ],
                description:
                    "Configure the allowed styles for step-level `uses` references.",
            },
        ],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
