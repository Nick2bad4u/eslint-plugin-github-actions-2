/**
 * @packageDocumentation
 * Validate GitHub Actions workflow trigger event names.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { setHas } from "ts-extras";

import { githubActionsTriggerEventSet } from "../_internal/github-actions-trigger-events.js";
import { isWorkflowFile } from "../_internal/lint-targets.js";
import { reportYamlNode } from "../_internal/report.js";
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
            reportYamlNode(context, {
                data: {
                    event: eventName,
                },
                messageId: "invalidEvent",
                node: node,
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
                        !setHas(githubActionsTriggerEventSet, eventName)
                    ) {
                        reportInvalidEvent(onValue, eventName);
                    }

                    return;
                }

                if (onValue.type === "YAMLSequence") {
                    for (const entry of onValue.entries) {
                        const unwrappedEntry = unwrapYamlValue(entry);
                        const eventName = getScalarStringValue(unwrappedEntry);

                        if (eventName === null) {
                            reportYamlNode(context, {
                                data: {
                                    event: "<unknown>",
                                },
                                messageId: "invalidEventEntry",
                                node: unwrappedEntry ?? entry ?? onValue,
                            });

                            continue;
                        }

                        if (!setHas(githubActionsTriggerEventSet, eventName)) {
                            reportYamlNode(context, {
                                data: {
                                    event: eventName,
                                },
                                messageId: "invalidEvent",
                                node: unwrappedEntry ?? entry ?? onValue,
                            });
                        }
                    }

                    return;
                }

                if (onValue.type !== "YAMLMapping") {
                    reportYamlNode(context, {
                        messageId: "invalidEventEntry",
                        node: onValue,
                    });

                    return;
                }

                for (const pair of onValue.pairs) {
                    const eventName = getScalarStringValue(pair.key);

                    if (eventName === null) {
                        reportYamlNode(context, {
                            messageId: "invalidEventEntry",
                            node: pair,
                        });

                        continue;
                    }

                    if (!setHas(githubActionsTriggerEventSet, eventName)) {
                        const eventNode = pair.key;

                        if (eventNode === null) {
                            continue;
                        }

                        reportInvalidEvent(eventNode, eventName);
                    }
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.recommended",
                "github-actions.configs.strict",
            ],
            description:
                "disallow invalid GitHub Actions trigger events under the workflow `on` key.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
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
