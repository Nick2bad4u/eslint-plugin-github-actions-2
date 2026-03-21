/**
 * @packageDocumentation
 * Disallow empty or whitespace-only `filePatterns` entries.
 */
import type { Rule } from "eslint";

import { isWorkflowTemplatePropertiesFile } from "../_internal/lint-targets.js";
import {
    getWorkflowTemplateFilePatternEntries,
    getWorkflowTemplatePropertiesRoot,
} from "../_internal/workflow-template-properties.js";

/** Rule implementation for empty template file pattern checks. */
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
                    if (value.trim().length > 0) {
                        continue;
                    }

                    context.report({
                        messageId: "emptyTemplateFilePattern",
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
                "disallow empty or whitespace-only entries in workflow-template `filePatterns`.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R060",
            ruleNumber: 60,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-empty-template-file-pattern",
        },
        messages: {
            emptyTemplateFilePattern:
                "Template `filePatterns` entries must be non-empty regex strings.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
