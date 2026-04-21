/**
 * @packageDocumentation
 * Disallow path separators in workflow-template `iconName` values.
 */
import type { Rule } from "eslint";

import { arrayAt, isDefined, stringSplit } from "ts-extras";

import { isWorkflowTemplatePropertiesFile } from "../_internal/lint-targets.js";
import { getWorkflowTemplatePropertiesRoot } from "../_internal/workflow-template-properties.js";
import {
    getMappingPair,
    getScalarStringValue,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for icon path-separator checks. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program(node) {
                if (!isWorkflowTemplatePropertiesFile(context.filename)) {
                    return;
                }

                const root = getWorkflowTemplatePropertiesRoot(context);

                if (root === null) {
                    return;
                }

                const iconNamePair = getMappingPair(root, "iconName");
                const iconNameNode = iconNamePair?.value ?? null;
                const iconName = getScalarStringValue(iconNameNode);

                if (
                    iconName === null ||
                    (!iconName.includes("/") && !iconName.includes("\\"))
                ) {
                    return;
                }

                const suggestedIconName = arrayAt(
                    stringSplit(iconName.replaceAll("\\", "/"), "/"),
                    -1
                );

                context.report({
                    data: {
                        iconName,
                    },
                    messageId: "iconNameContainsPathSeparator",
                    node: (iconNameNode ?? node) as unknown as Rule.Node,
                    suggest:
                        !isDefined(suggestedIconName) ||
                        suggestedIconName.length === 0 ||
                        iconNameNode === null
                            ? undefined
                            : [
                                  {
                                      data: {
                                          iconName,
                                          suggestedIconName,
                                      },
                                      fix: (fixer) =>
                                          fixer.replaceTextRange(
                                              iconNameNode.range,
                                              JSON.stringify(suggestedIconName)
                                          ),
                                      messageId: "replaceIconNameWithBasename",
                                  },
                              ],
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.workflowTemplateProperties",
                "github-actions.configs.workflowTemplates",
                "github-actions.configs.all",
            ],
            description:
                "disallow path separators in workflow-template `iconName` values.",
            dialects: ["GitHub Actions workflow template metadata"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R064",
            ruleNumber: 64,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-path-separators-in-template-icon-name",
        },
        hasSuggestions: true,
        messages: {
            iconNameContainsPathSeparator:
                "Template `iconName` '{{iconName}}' should be a plain icon token, not a path.",
            replaceIconNameWithBasename:
                "Replace '{{iconName}}' with '{{suggestedIconName}}'.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
