/**
 * @packageDocumentation
 * Require each workflow template properties file to have a paired template YAML file.
 */
import type { Rule } from "eslint";

import { existsSync } from "node:fs";

import { isWorkflowTemplatePropertiesFile } from "../_internal/lint-targets.js";
import { getPairedTemplateYamlPaths } from "../_internal/workflow-template-properties.js";

/** Rule implementation for template metadata pair checks. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program(node) {
                if (!isWorkflowTemplatePropertiesFile(context.filename)) {
                    return;
                }

                const [pairedYmlPath, pairedYamlPath] =
                    getPairedTemplateYamlPaths(context.filename);

                if (existsSync(pairedYmlPath) || existsSync(pairedYamlPath)) {
                    return;
                }

                context.report({
                    data: {
                        pairedYamlPath,
                        pairedYmlPath,
                    },
                    messageId: "missingTemplateYamlPair",
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
                "require each workflow-template `.properties.json` file to have a matching template YAML file.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R055",
            ruleNumber: 55,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-workflow-template-properties-pair",
        },
        messages: {
            missingTemplateYamlPair:
                "Workflow template metadata is missing its paired YAML file. Expected '{{pairedYmlPath}}' or '{{pairedYamlPath}}'.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
