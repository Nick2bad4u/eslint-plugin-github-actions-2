/**
 * @packageDocumentation
 * Require merge-queue-aware workflows to listen for merge_group.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import {
    getMappingPair,
    getScalarStringValue,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Determine whether the workflow declares a specific trigger event. */
const hasTriggerEvent = (
    root: Readonly<AST.YAMLMapping>,
    eventName: string
): boolean => {
    const onPair = getMappingPair(root, "on");
    const onValue = unwrapYamlValue(onPair?.value ?? null);

    if (onValue === null) {
        return false;
    }

    if (onValue.type === "YAMLScalar") {
        return getScalarStringValue(onValue) === eventName;
    }

    if (onValue.type === "YAMLSequence") {
        return onValue.entries.some(
            (entry) =>
                entry !== null && getScalarStringValue(entry) === eventName
        );
    }

    if (onValue.type !== "YAMLMapping") {
        return false;
    }

    return getMappingPair(onValue, eventName) !== null;
};

/** Rule implementation for requiring merge_group triggers. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null || !hasTriggerEvent(root, "pull_request")) {
                    return;
                }

                if (hasTriggerEvent(root, "merge_group")) {
                    return;
                }

                const onPair = getMappingPair(root, "on");
                const onValue = unwrapYamlValue(onPair?.value ?? null);

                if (onValue === null) {
                    return;
                }

                context.report({
                    messageId: "missingMergeGroup",
                    node: onValue as unknown as Rule.Node,
                });
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.strict",
            ],
            description:
                "require pull-request validation workflows to include the `merge_group` trigger so required checks also run for merge queues.",
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R035",
            ruleNumber: 35,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-merge-group-trigger",
        },
        messages: {
            missingMergeGroup:
                "Workflows that validate pull requests should also listen to `merge_group` so required status checks are reported when pull requests enter a merge queue.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
