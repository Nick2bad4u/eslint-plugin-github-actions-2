/**
 * @packageDocumentation
 * Prefer `.yml` over `.yaml` for workflow template YAML files.
 */
import type { Rule } from "eslint";

import {
    isWorkflowTemplateYamlFile,
    usesYamlExtension,
} from "../_internal/lint-targets.js";

/** Rule implementation for template YAML extension preference checks. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program(node) {
                if (!isWorkflowTemplateYamlFile(context.filename)) {
                    return;
                }

                if (!usesYamlExtension(context.filename)) {
                    return;
                }

                context.report({
                    messageId: "preferTemplateYml",
                    node: node as unknown as Rule.Node,
                });
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.workflowTemplates",
                "github-actions.configs.all",
            ],
            description:
                "require workflow template files to prefer `.yml` over `.yaml`.",
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
