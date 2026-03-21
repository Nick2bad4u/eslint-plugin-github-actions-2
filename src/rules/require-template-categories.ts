/**
 * @packageDocumentation
 * Require `categories` in workflow-template properties metadata.
 */
import type { Rule } from "eslint";

import { isWorkflowTemplatePropertiesFile } from "../_internal/lint-targets.js";
import {
    getWorkflowTemplatePropertiesRoot,
    getWorkflowTemplateStringProperty,
} from "../_internal/workflow-template-properties.js";
import { getMappingValueAsSequence } from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring template categories. */
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

                const categoriesSequence = getMappingValueAsSequence(
                    root,
                    "categories"
                );

                if (
                    categoriesSequence !== null &&
                    categoriesSequence.entries.length > 0
                ) {
                    return;
                }

                const templateName =
                    getWorkflowTemplateStringProperty(root, "name") ??
                    "<unnamed-template>";

                context.report({
                    data: {
                        templateName,
                    },
                    messageId: "missingCategories",
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
                "require non-empty `categories` in workflow-template metadata.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R057",
            ruleNumber: 57,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-template-categories",
        },
        messages: {
            missingCategories:
                "Workflow template '{{templateName}}' should declare at least one category in `categories`.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
