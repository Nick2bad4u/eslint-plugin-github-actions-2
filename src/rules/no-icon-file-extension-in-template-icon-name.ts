/**
 * @packageDocumentation
 * Disallow including `.svg` extension in workflow-template `iconName`.
 */
import type { Rule } from "eslint";

import { isWorkflowTemplatePropertiesFile } from "../_internal/lint-targets.js";
import { getWorkflowTemplatePropertiesRoot } from "../_internal/workflow-template-properties.js";
import {
    getMappingPair,
    getScalarStringValue,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for `iconName` extension checks. */
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

                if (iconName === null) {
                    return;
                }

                if (!iconName.toLowerCase().endsWith(".svg")) {
                    return;
                }

                context.report({
                    data: {
                        iconName,
                    },
                    fix: (fixer) =>
                        iconNameNode === null
                            ? null
                            : fixer.replaceTextRange(
                                  iconNameNode.range,
                                  JSON.stringify(
                                      iconName.slice(0, -".svg".length)
                                  )
                              ),
                    messageId: "iconNameIncludesExtension",
                    node: (iconNameNode ?? node) as unknown as Rule.Node,
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
                "disallow `.svg` extensions in workflow-template `iconName` values.",
            dialects: ["GitHub Actions workflow template metadata"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R063",
            ruleNumber: 63,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-icon-file-extension-in-template-icon-name",
        },
        fixable: "code",
        messages: {
            iconNameIncludesExtension:
                "Template `iconName` '{{iconName}}' should omit the `.svg` extension.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
