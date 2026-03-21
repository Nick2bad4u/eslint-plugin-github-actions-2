/**
 * @packageDocumentation
 * Disallow path separators in workflow-template `iconName` values.
 */
import type { Rule } from "eslint";

import { isWorkflowTemplatePropertiesFile } from "../_internal/lint-targets.js";
import {
    getWorkflowTemplatePropertiesRoot,
    getWorkflowTemplateStringProperty,
} from "../_internal/workflow-template-properties.js";

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

                const iconName = getWorkflowTemplateStringProperty(
                    root,
                    "iconName"
                );

                if (
                    iconName === null ||
                    (!iconName.includes("/") && !iconName.includes("\\"))
                ) {
                    return;
                }

                context.report({
                    data: {
                        iconName,
                    },
                    messageId: "iconNameContainsPathSeparator",
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
                "disallow path separators in workflow-template `iconName` values.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R064",
            ruleNumber: 64,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-path-separators-in-template-icon-name",
        },
        messages: {
            iconNameContainsPathSeparator:
                "Template `iconName` '{{iconName}}' should be a plain icon token, not a path.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
