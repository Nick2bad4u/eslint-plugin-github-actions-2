/**
 * @packageDocumentation
 * Disallow invalid regular expressions in workflow-template `filePatterns`.
 */
import type { Rule } from "eslint";

import { isWorkflowTemplatePropertiesFile } from "../_internal/lint-targets.js";
import {
    getWorkflowTemplateFilePatternEntries,
    getWorkflowTemplatePropertiesRoot,
} from "../_internal/workflow-template-properties.js";

/** Construct a unicode regex from a pattern string. */
const createUnicodeRegex = (pattern: string): RegExp =>
    // eslint-disable-next-line security/detect-non-literal-regexp -- Intentional syntax validation of user-provided regex patterns.
    new RegExp(pattern, "u");

/** Rule implementation for validating `filePatterns` regex syntax. */
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
                    try {
                        createUnicodeRegex(value);
                    } catch {
                        context.report({
                            data: {
                                pattern: value,
                            },
                            messageId: "invalidTemplateFilePatternRegex",
                            node: node as unknown as Rule.Node,
                        });
                    }
                }
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
                "disallow syntactically invalid regexes in workflow-template `filePatterns`.",
            dialects: ["GitHub Actions workflow template metadata"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R059",
            ruleNumber: 59,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-invalid-template-file-pattern-regex",
        },
        messages: {
            invalidTemplateFilePatternRegex:
                "Template `filePatterns` entry '{{pattern}}' is not a valid regular expression.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
