/**
 * @packageDocumentation
 * Disallow universal catch-all regexes in template `filePatterns`.
 */
import type { Rule } from "eslint";

import { setHas } from "ts-extras";

import { isWorkflowTemplatePropertiesFile } from "../_internal/lint-targets.js";
import { reportYamlNode } from "../_internal/report.js";
import {
    getWorkflowTemplateFilePatternEntries,
    getWorkflowTemplatePropertiesRoot,
} from "../_internal/workflow-template-properties.js";

/** Normalized regex strings treated as universal catch-all template patterns. */
const universalTemplateFilePatterns = new Set([
    ".*",
    ".+",
    "^.*$",
    "^.+$",
]);

/** Rule implementation for universal template file pattern checks. */
const rule: Rule.RuleModule = {
    create: (context) => ({
        Program() {
            if (!isWorkflowTemplatePropertiesFile(context.filename)) {
                return;
            }

            const root = getWorkflowTemplatePropertiesRoot(context);

            if (root === null) {
                return;
            }

            for (const { node, value } of getWorkflowTemplateFilePatternEntries(
                root
            )) {
                const normalizedPattern = value.trim();

                if (!setHas(universalTemplateFilePatterns, normalizedPattern)) {
                    continue;
                }

                reportYamlNode(context, {
                    data: {
                        pattern: value,
                    },
                    messageId: "universalTemplateFilePattern",
                    node: node,
                });
            }
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.workflowTemplateProperties",
                "github-actions.configs.workflowTemplates",
                "github-actions.configs.all",
            ],
            description:
                "disallow universal catch-all regexes in workflow-template `filePatterns`.",
            dialects: ["GitHub Actions workflow template metadata"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R061",
            ruleNumber: 61,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-universal-template-file-pattern",
        },
        messages: {
            universalTemplateFilePattern:
                "Template file pattern '{{pattern}}' is too broad and matches nearly every repository.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
