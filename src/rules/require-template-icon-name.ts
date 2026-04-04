/**
 * @packageDocumentation
 * Require `iconName` in workflow-template properties.
 */
import type { Rule } from "eslint";

import { isWorkflowTemplatePropertiesFile } from "../_internal/lint-targets.js";
import {
    getWorkflowTemplatePropertiesRoot,
    getWorkflowTemplateStringProperty,
} from "../_internal/workflow-template-properties.js";

/** Rule implementation for requiring `iconName` in template properties metadata. */
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

                if (iconName !== null && iconName.trim().length > 0) {
                    return;
                }

                context.report({
                    messageId: "missingIconName",
                    node: node as unknown as Rule.Node,
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
                "require `iconName` in workflow-template `.properties.json` metadata.",
            dialects: ["GitHub Actions workflow template metadata"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R056",
            ruleNumber: 56,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-template-icon-name",
        },
        messages: {
            missingIconName:
                "Workflow template metadata should define a non-empty `iconName`.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
