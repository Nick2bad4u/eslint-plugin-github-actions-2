/**
 * @packageDocumentation
 * Validate GitHub Actions workflow trigger event names.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { githubActionsTriggerEventSet } from "../_internal/github-actions-trigger-events.js";
import {
    getMappingPair,
    getScalarStringValue,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for validating `on:` trigger event names. */
const rule: Rule.RuleModule = {
    create(context) {
        const reportInvalidEvent = (
            node: Readonly<AST.YAMLNode>,
            eventName: string
        ): void => {
            context.report({
                data: {
                    event: eventName,
                },
                messageId: "invalidEvent",
                node: node as unknown as Rule.Node,
            });
        };

        return {
            Program() {
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
                        !githubActionsTriggerEventSet.has(eventName)
                    ) {
                        reportInvalidEvent(onValue, eventName);
                    }

                    return;
                }

                if (onValue.type === "YAMLSequence") {
                    for (const entry of onValue.entries) {
                        const unwrappedEntry = unwrapYamlValue(entry);
                        const eventName = getScalarStringValue(unwrappedEntry);

                        if (
                            unwrappedEntry !== null &&
                            (eventName === null ||
                                !githubActionsTriggerEventSet.has(eventName))
                        ) {
                            context.report({
                                data: {
                                    event: eventName ?? "<unknown>",
                                },
                                messageId:
                                    eventName === null
                                        ? "invalidEventEntry"
                                        : "invalidEvent",
                                node: unwrappedEntry as unknown as Rule.Node,
                            });
                        }
                    }

                    return;
                }

                if (onValue.type !== "YAMLMapping") {
                    context.report({
                        messageId: "invalidEventEntry",
                        node: onValue as unknown as Rule.Node,
                    });

                    return;
                }

                for (const pair of onValue.pairs) {
                    const eventName = getScalarStringValue(pair.key);

                    if (eventName === null) {
                        context.report({
                            messageId: "invalidEventEntry",
                            node: pair as unknown as Rule.Node,
                        });

                        continue;
                    }

                    if (!githubActionsTriggerEventSet.has(eventName)) {
                        reportInvalidEvent(pair.key as AST.YAMLNode, eventName);
                    }
                }
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.recommended",
                "github-actions.configs.strict",
            ],
            description:
                "disallow invalid GitHub Actions trigger events under the workflow `on` key.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R018",
            ruleNumber: 18,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/valid-trigger-events",
        },
        messages: {
            invalidEvent:
                "`{{event}}` is not a documented GitHub Actions workflow trigger event.",
            invalidEventEntry:
                "Workflow `on` entries must use string event names.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
