/**
 * @packageDocumentation
 * Require `filePatterns` in workflow-template properties metadata.
 */
import type { Rule } from "eslint";

import { isWorkflowTemplatePropertiesFile } from "../_internal/lint-targets.js";
import {
    getWorkflowTemplatePropertiesRoot,
    getWorkflowTemplateStringProperty,
} from "../_internal/workflow-template-properties.js";
import { getMappingValueAsSequence } from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring non-empty template file patterns. */
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

                const filePatternsSequence = getMappingValueAsSequence(
                    root,
                    "filePatterns"
                );

                if (
                    filePatternsSequence !== null &&
                    filePatternsSequence.entries.length > 0
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
                    messageId: "missingFilePatterns",
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
                "require non-empty `filePatterns` in workflow-template metadata.",
            dialects: ["GitHub Actions workflow template metadata"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R058",
            ruleNumber: 58,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-template-file-patterns",
        },
        messages: {
            missingFilePatterns:
                "Workflow template '{{templateName}}' should declare `filePatterns` to improve chooser relevance.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
