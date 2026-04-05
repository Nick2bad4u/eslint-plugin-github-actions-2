/**
 * @packageDocumentation
 * Require top-level workflow concurrency controls for relevant workflow triggers.
 */
import type { Rule } from "eslint";

import { isWorkflowFile } from "../_internal/lint-targets.js";
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

/** Rule options for `require-workflow-concurrency`. */
type RequireWorkflowConcurrencyOptions = [
    {
        readonly onlyForEvents?: readonly string[];
        readonly requireCancelInProgress?: boolean;
    }?,
];

/** Rule implementation for requiring workflow-level concurrency controls. */
const rule: Rule.RuleModule = {
    create(context) {
        const [options] = context.options as RequireWorkflowConcurrencyOptions;
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
                ].some((eventName) => eventNames.has(eventName));

                if (!shouldRequireConcurrency) {
                    return;
                }

                const concurrencyPair = getMappingPair(root, "concurrency");

                if (concurrencyPair === null) {
                    context.report({
                        messageId: "missingConcurrency",
                        node: root,
                    });

                    return;
                }

                const concurrencyValue = unwrapYamlValue(concurrencyPair.value);

                if (concurrencyValue === null) {
                    context.report({
                        messageId: "invalidConcurrency",
                        node: concurrencyPair,
                    });

                    return;
                }

                if (concurrencyValue.type === "YAMLScalar") {
                    const groupValue = getScalarStringValue(concurrencyValue);

                    if (groupValue === null || groupValue.trim().length === 0) {
                        context.report({
                            messageId: "invalidConcurrency",
                            node: concurrencyValue,
                        });
                    }

                    return;
                }

                if (concurrencyValue.type !== "YAMLMapping") {
                    context.report({
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
                    context.report({
                        messageId: "missingGroup",
                        node: groupPair?.key ?? concurrencyValue,
                    });
                }

                if (!requireCancelInProgress) {
                    return;
                }

                const cancelInProgressPair = getMappingPair(
                    concurrencyValue,
                    "cancel-in-progress"
                );

                if (cancelInProgressPair === null) {
                    context.report({
                        messageId: "missingCancelInProgress",
                        node: concurrencyValue,
                    });

                    return;
                }

                if (isGithubExpressionScalar(cancelInProgressPair.value)) {
                    return;
                }

                if (
                    unwrapYamlValue(cancelInProgressPair.value)?.type !==
                    "YAMLScalar"
                ) {
                    context.report({
                        messageId: "cancelInProgressDisabled",
                        node:
                            cancelInProgressPair.value ?? cancelInProgressPair,
                    });

                    return;
                }

                if (cancelInProgressPair.value?.type !== "YAMLScalar") {
                    context.report({
                        messageId: "cancelInProgressDisabled",
                        node:
                            cancelInProgressPair.value ?? cancelInProgressPair,
                    });

                    return;
                }

                if (cancelInProgressPair.value.value !== true) {
                    context.report({
                        messageId: "cancelInProgressDisabled",
                        node: cancelInProgressPair.value,
                    });
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
