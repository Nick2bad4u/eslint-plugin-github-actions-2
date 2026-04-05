/**
 * @packageDocumentation
 * Require explicit activity `types` for selected multi-activity workflow events.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Events where explicit `types` improve trigger precision. */
const eventsRequiringTypes = new Set<string>([
    "branch_protection_rule",
    "check_run",
    "check_suite",
    "discussion",
    "discussion_comment",
    "issue_comment",
    "issues",
    "label",
    "merge_group",
    "milestone",
    "pull_request_review",
    "pull_request_review_comment",
    "registry_package",
    "release",
    "repository_dispatch",
    "watch",
    "workflow_run",
]);

/** Determine whether an event `types` node is meaningfully configured. */
const hasConfiguredTypes = (
    node: null | Readonly<AST.YAMLPair> | undefined
): boolean => {
    const valueNode = unwrapYamlValue(node?.value ?? null);

    if (valueNode === null) {
        return false;
    }

    if (valueNode.type === "YAMLScalar") {
        const value = getScalarStringValue(valueNode);

        return value !== null && value.trim().length > 0;
    }

    if (valueNode.type !== "YAMLSequence") {
        return false;
    }

    return valueNode.entries.some((entry) => {
        const value = getScalarStringValue(entry);

        return value !== null && value.trim().length > 0;
    });
};

/** Rule implementation for requiring explicit event activity types. */
const rule: Rule.RuleModule = {
    create(context) {
        const reportMissingTypes = (
            node: Readonly<AST.YAMLNode>,
            eventName: string
        ): void => {
            context.report({
                data: {
                    event: eventName,
                },
                messageId: "missingTypes",
                node: node as unknown as Rule.Node,
            });
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

                const onPair = getMappingPair(root, "on");
                const onValue = unwrapYamlValue(onPair?.value ?? null);

                if (onValue === null) {
                    return;
                }

                if (onValue.type === "YAMLScalar") {
                    const eventName = getScalarStringValue(onValue);

                    if (
                        eventName !== null &&
                        eventsRequiringTypes.has(eventName)
                    ) {
                        reportMissingTypes(onValue, eventName);
                    }

                    return;
                }

                if (onValue.type === "YAMLSequence") {
                    for (const entry of onValue.entries) {
                        const eventName = getScalarStringValue(entry);

                        if (
                            entry !== null &&
                            eventName !== null &&
                            eventsRequiringTypes.has(eventName)
                        ) {
                            reportMissingTypes(entry, eventName);
                        }
                    }

                    return;
                }

                const onMapping = getMappingValueAsMapping(root, "on");

                if (onMapping === null) {
                    return;
                }

                for (const pair of onMapping.pairs) {
                    const eventName = getScalarStringValue(pair.key);

                    if (
                        eventName === null ||
                        !eventsRequiringTypes.has(eventName)
                    ) {
                        continue;
                    }

                    const eventValue = unwrapYamlValue(pair.value);

                    if (eventValue?.type !== "YAMLMapping") {
                        reportMissingTypes(
                            (pair.value ?? pair.key) as AST.YAMLNode,
                            eventName
                        );

                        continue;
                    }

                    if (
                        hasConfiguredTypes(getMappingPair(eventValue, "types"))
                    ) {
                        continue;
                    }

                    reportMissingTypes(eventValue, eventName);
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.strict",
            ],
            description:
                "require explicit `types` filters for selected multi-activity workflow events so workflows do not subscribe to every supported activity implicitly.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R031",
            ruleNumber: 31,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-trigger-types",
        },
        messages: {
            missingTypes:
                "`on.{{event}}` should declare a non-empty `types` filter so the workflow is scoped to explicit activity types.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
