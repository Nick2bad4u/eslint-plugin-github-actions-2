/**
 * @packageDocumentation
 * Disallow workflow-template file patterns that target subdirectory paths.
 */
import type { Rule } from "eslint";

import { isWorkflowTemplatePropertiesFile } from "../_internal/lint-targets.js";
import {
    getWorkflowTemplateFilePatternEntries,
    getWorkflowTemplatePropertiesRoot,
} from "../_internal/workflow-template-properties.js";

/** Rule implementation for root-directory-oriented template file pattern checks. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                if (!isWorkflowTemplatePropertiesFile(context.filename)) {
                    return;
                }

                const root = getWorkflowTemplatePropertiesRoot(context);

                if (root === null) {
                    return;
                }

                for (const {
                    node,
                    value,
                } of getWorkflowTemplateFilePatternEntries(root)) {
                    if (!value.includes("/") && !value.includes("\\")) {
                        continue;
                    }

                    context.report({
                        data: {
                            pattern: value,
                        },
                        messageId: "subdirectoryTemplateFilePattern",
                        node: node as unknown as Rule.Node,
                    });
                }
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
                "disallow workflow-template `filePatterns` that match subdirectory paths instead of repository-root files.",
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R062",
            ruleNumber: 62,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-subdirectory-template-file-pattern",
        },
        messages: {
            subdirectoryTemplateFilePattern:
                "Template file pattern '{{pattern}}' targets subdirectory paths; workflow-template file patterns should match repository-root files.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
