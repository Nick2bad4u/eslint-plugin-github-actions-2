/**
 * @packageDocumentation
 * Prefer `.yml` over `.yaml` for workflow template YAML files.
 */
import type { Rule } from "eslint";

import {
    isWorkflowTemplateYamlFile,
    usesYamlExtension,
} from "../_internal/lint-targets.js";
import { reportYamlNode } from "../_internal/report.js";

/** Rule implementation for template YAML extension preference checks. */
const rule: Rule.RuleModule = {
    create: (context) => ({
        Program(node) {
            if (!isWorkflowTemplateYamlFile(context.filename)) {
                return;
            }

            if (!usesYamlExtension(context.filename)) {
                return;
            }

            reportYamlNode(context, {
                messageId: "preferTemplateYml",
                node: node,
            });
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.workflowTemplates",
                "github-actions.configs.all",
            ],
            description:
                "require workflow template files to prefer `.yml` over `.yaml`.",
            dialects: ["GitHub Actions workflow template"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R066",
            ruleNumber: 66,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/prefer-template-yml-extension",
        },
        messages: {
            preferTemplateYml:
                "Prefer `.yml` for workflow template files instead of `.yaml`.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
