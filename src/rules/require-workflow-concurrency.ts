/**
 * @packageDocumentation
 * Require top-level workflow concurrency controls for relevant workflow triggers.
 */
import type { Rule } from "eslint";
import type { UnknownArray } from "type-fest";
import type { AST } from "yaml-eslint-parser";

import { arrayFirst, isDefined, safeCastTo, setHas } from "ts-extras";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import { reportYamlNode } from "../_internal/report.js";
import {
    getMappingPair,
    getScalarStringValue,
    getWorkflowEventNames,
    getWorkflowRoot,
    isGithubExpressionScalar,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Default event set that most benefits from workflow-level concurrency. */
const DEFAULT_TRIGGER_EVENTS = [
    "merge_group",
    "pull_request",
    "pull_request_target",
    "push",
    "workflow_dispatch",
] as const;

interface RequireWorkflowConcurrencyOption {
    readonly onlyForEvents?: readonly string[];
    readonly requireCancelInProgress?: boolean;
}

/** Determine whether an unknown value is a valid rule option object. */
const isRequireWorkflowConcurrencyOption = (
    value: unknown
): value is RequireWorkflowConcurrencyOption => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const onlyForEvents: unknown = Reflect.get(value, "onlyForEvents");

    if (
        isDefined(onlyForEvents) &&
        (!Array.isArray(onlyForEvents) ||
            !onlyForEvents.every((eventName) => typeof eventName === "string"))
    ) {
        return false;
    }

    const requireCancelInProgress: unknown = Reflect.get(
        value,
        "requireCancelInProgress"
    );

    return (
        !isDefined(requireCancelInProgress) ||
        typeof requireCancelInProgress === "boolean"
    );
};

/**
 * Validate the `cancel-in-progress` key inside a concurrency mapping and report
 * any violations.
 */
const checkCancelInProgress = (
    context: Readonly<Rule.RuleContext>,
    concurrencyMapping: Readonly<AST.YAMLMapping>
): void => {
    const cancelInProgressPair = getMappingPair(
        concurrencyMapping,
        "cancel-in-progress"
    );

    if (cancelInProgressPair === null) {
        reportYamlNode(context, {
            messageId: "missingCancelInProgress",
            node: concurrencyMapping,
        });

        return;
    }

    if (isGithubExpressionScalar(cancelInProgressPair.value)) {
        return;
    }

    if (
        unwrapYamlValue(cancelInProgressPair.value)?.type !== "YAMLScalar" ||
        cancelInProgressPair.value?.type !== "YAMLScalar"
    ) {
        reportYamlNode(context, {
            messageId: "cancelInProgressDisabled",
            node: cancelInProgressPair.value ?? cancelInProgressPair,
        });

        return;
    }

    if (cancelInProgressPair.value.value !== true) {
        reportYamlNode(context, {
            messageId: "cancelInProgressDisabled",
            node: cancelInProgressPair.value,
        });
    }
};

/** Rule implementation for requiring workflow-level concurrency controls. */
const rule: Rule.RuleModule = {
    create(context) {
        const rawOption = arrayFirst(
            safeCastTo<Readonly<UnknownArray>>(context.options)
        );
        const options = isRequireWorkflowConcurrencyOption(rawOption)
            ? rawOption
            : undefined;
        const requiredTriggerEvents = new Set<string>(
            options?.onlyForEvents ?? DEFAULT_TRIGGER_EVENTS
        );
        const requireCancelInProgress =
            options?.requireCancelInProgress ?? true;

        return {
            Program() {
                if (!isWorkflowFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                const eventNames = getWorkflowEventNames(root);
                const shouldRequireConcurrency = [
                    ...requiredTriggerEvents,
                ].some((eventName) => setHas(eventNames, eventName));

                if (!shouldRequireConcurrency) {
                    return;
                }

                const concurrencyPair = getMappingPair(root, "concurrency");

                if (concurrencyPair === null) {
                    reportYamlNode(context, {
                        messageId: "missingConcurrency",
                        node: root,
                    });

                    return;
                }

                const concurrencyValue = unwrapYamlValue(concurrencyPair.value);

                if (concurrencyValue === null) {
                    reportYamlNode(context, {
                        messageId: "invalidConcurrency",
                        node: concurrencyPair,
                    });

                    return;
                }

                if (concurrencyValue.type === "YAMLScalar") {
                    const groupValue = getScalarStringValue(concurrencyValue);

                    if (groupValue === null || groupValue.trim().length === 0) {
                        reportYamlNode(context, {
                            messageId: "invalidConcurrency",
                            node: concurrencyValue,
                        });
                    }

                    return;
                }

                if (concurrencyValue.type !== "YAMLMapping") {
                    reportYamlNode(context, {
                        messageId: "invalidConcurrency",
                        node: concurrencyValue,
                    });

                    return;
                }

                const groupPair = getMappingPair(concurrencyValue, "group");
                const groupValue = getScalarStringValue(
                    groupPair?.value ?? null
                );

                if (
                    groupPair === null ||
                    groupValue === null ||
                    groupValue.trim() === ""
                ) {
                    reportYamlNode(context, {
                        messageId: "missingGroup",
                        node: groupPair?.key ?? concurrencyValue,
                    });
                }

                if (requireCancelInProgress) {
                    checkCancelInProgress(context, concurrencyValue);
                }
            },
        };
    },
    meta: {
        defaultOptions: [{}],
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.strict",
            ],
            description:
                "require workflow-level `concurrency` so redundant runs can be deduplicated predictably.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R004",
            ruleNumber: 4,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-workflow-concurrency",
        },
        messages: {
            cancelInProgressDisabled:
                "Workflow `concurrency.cancel-in-progress` should be `true` or a GitHub expression so stale runs can be cancelled.",
            invalidConcurrency:
                "Workflow `concurrency` should be a string/expression or an object containing at least `group`.",
            missingCancelInProgress:
                "Workflow `concurrency` should set `cancel-in-progress` to cancel superseded runs.",
            missingConcurrency:
                "Add a top-level `concurrency` block so overlapping workflow runs do not pile up.",
            missingGroup:
                "Workflow `concurrency` should declare a non-empty `group` value.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Optional configuration for which events require workflow-level concurrency and whether cancel-in-progress is mandatory.",
                properties: {
                    onlyForEvents: {
                        description:
                            "Event names that should trigger the workflow-level concurrency requirement.",
                        items: {
                            minLength: 1,
                            type: "string",
                        },
                        type: "array",
                        uniqueItems: true,
                    },
                    requireCancelInProgress: {
                        description:
                            "Require concurrency.cancel-in-progress so newer runs can cancel superseded work.",
                        type: "boolean",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
