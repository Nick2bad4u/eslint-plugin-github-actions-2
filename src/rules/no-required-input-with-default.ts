/**
 * @packageDocumentation
 * Disallow action inputs that are both required and defaulted.
 */
import type { Rule } from "eslint";

import { isActionMetadataFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";
import { getEnclosingLineRemovalRange } from "../_internal/yaml-fixes.js";

/** Rule implementation for contradictory action input definitions. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                if (!isActionMetadataFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);
                const inputsMapping =
                    root === null
                        ? null
                        : getMappingValueAsMapping(root, "inputs");

                if (inputsMapping === null) {
                    return;
                }

                for (const pair of inputsMapping.pairs) {
                    const inputId = getScalarStringValue(pair.key);
                    const inputMapping = unwrapYamlValue(pair.value);

                    if (
                        inputId === null ||
                        inputMapping?.type !== "YAMLMapping"
                    ) {
                        continue;
                    }

                    const requiredPair = getMappingPair(
                        inputMapping,
                        "required"
                    );
                    const defaultPair = getMappingPair(inputMapping, "default");

                    if (requiredPair === null || defaultPair === null) {
                        continue;
                    }

                    const requiredValue = unwrapYamlValue(requiredPair.value);

                    if (
                        requiredValue?.type !== "YAMLScalar" ||
                        requiredValue.value !== true
                    ) {
                        continue;
                    }

                    context.report({
                        data: {
                            inputId,
                        },
                        messageId: "requiredInputWithDefault",
                        node: (defaultPair.value ??
                            defaultPair) as unknown as Rule.Node,
                        suggest: [
                            {
                                data: {
                                    inputId,
                                },
                                fix: (fixer) =>
                                    fixer.removeRange(
                                        getEnclosingLineRemovalRange(
                                            context.sourceCode.text,
                                            requiredPair.range
                                        )
                                    ),
                                messageId: "removeRequiredSuggestion",
                            },
                            {
                                data: {
                                    inputId,
                                },
                                fix: (fixer) =>
                                    fixer.removeRange(
                                        getEnclosingLineRemovalRange(
                                            context.sourceCode.text,
                                            defaultPair.range
                                        )
                                    ),
                                messageId: "removeDefaultSuggestion",
                            },
                        ],
                    });
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.actionMetadata",
                "github-actions.configs.all",
            ],
            description:
                "disallow action inputs that set both `required: true` and `default`.",
            dialects: ["GitHub Action metadata"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R047",
            ruleNumber: 47,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-required-input-with-default",
        },
        hasSuggestions: true,
        messages: {
            removeDefaultSuggestion:
                "Remove the default value from input '{{inputId}}' and keep it required.",
            removeRequiredSuggestion:
                "Remove `required: true` from input '{{inputId}}' and keep the default value.",
            requiredInputWithDefault:
                "Input '{{inputId}}' sets both `required: true` and `default`, which is contradictory for action callers.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
