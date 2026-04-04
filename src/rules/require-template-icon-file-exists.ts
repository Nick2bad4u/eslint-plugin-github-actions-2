/**
 * @packageDocumentation
 * Require local workflow-template icon files referenced by `iconName` to exist.
 */
import type { Rule } from "eslint";

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

import { isWorkflowTemplatePropertiesFile } from "../_internal/lint-targets.js";
import {
    getWorkflowTemplatePropertiesRoot,
    getWorkflowTemplateStringProperty,
} from "../_internal/workflow-template-properties.js";

/** Rule implementation for template icon file existence checks. */
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

                if (iconName === null || iconName.trim().length === 0) {
                    return;
                }

                if (iconName.startsWith("octicon ")) {
                    return;
                }

                const iconFilePath = join(
                    dirname(context.filename),
                    `${iconName}.svg`
                );

                if (existsSync(iconFilePath)) {
                    return;
                }

                context.report({
                    data: {
                        iconFilePath,
                        iconName,
                    },
                    messageId: "missingTemplateIconFile",
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
                "require local `iconName` references in workflow-template metadata to point to existing SVG files.",
            dialects: ["GitHub Actions workflow template metadata"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R065",
            ruleNumber: 65,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-template-icon-file-exists",
        },
        messages: {
            missingTemplateIconFile:
                "Template `iconName` '{{iconName}}' should resolve to an existing icon file at '{{iconFilePath}}'.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
