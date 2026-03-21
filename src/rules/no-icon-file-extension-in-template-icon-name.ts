/**
 * @packageDocumentation
 * Disallow including `.svg` extension in workflow-template `iconName`.
 */
import type { Rule } from "eslint";

import { isWorkflowTemplatePropertiesFile } from "../_internal/lint-targets.js";
import {
    getWorkflowTemplatePropertiesRoot,
    getWorkflowTemplateStringProperty,
} from "../_internal/workflow-template-properties.js";

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

                const iconName = getWorkflowTemplateStringProperty(
                    root,
                    "iconName"
                );

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
                    messageId: "iconNameIncludesExtension",
                    node: node as unknown as Rule.Node,
                });
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.workflowTemplateProperties",
                "github-actions.configs.workflowTemplates",
                "github-actions.configs.all",
            ],
            description:
                "disallow `.svg` extensions in workflow-template `iconName` values.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R063",
            ruleNumber: 63,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-icon-file-extension-in-template-icon-name",
        },
        messages: {
            iconNameIncludesExtension:
                "Template `iconName` '{{iconName}}' should omit the `.svg` extension.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
