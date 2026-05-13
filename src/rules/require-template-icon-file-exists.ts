/**
 * @packageDocumentation
 * Require local workflow-template icon files referenced by `iconName` to exist.
 */
import type { Rule } from "eslint";

import { existsSync } from "node:fs";
import path from "node:path";

import { isWorkflowTemplatePropertiesFile } from "../_internal/lint-targets.js";
import { reportYamlNode } from "../_internal/report.js";
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

                const iconFilePath = path.join(
                    path.dirname(context.filename),
                    `${iconName}.svg`
                );

                // eslint-disable-next-line n/no-sync, security/detect-non-literal-fs-filename -- iconFilePath is derived from repository-local workflow-template metadata and resolved helper paths.
                if (existsSync(iconFilePath)) {
                    return;
                }

                reportYamlNode(context, {
                    data: {
                        iconFilePath,
                        iconName,
                    },
                    messageId: "missingTemplateIconFile",
                    node: node,
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
