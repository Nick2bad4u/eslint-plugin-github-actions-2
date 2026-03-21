/**
 * @packageDocumentation
 * Require each workflow template YAML file to have a paired `.properties.json` metadata file.
 */
import type { Rule } from "eslint";

import { existsSync } from "node:fs";

import { isWorkflowTemplateYamlFile } from "../_internal/lint-targets.js";
import { getPairedTemplatePropertiesPath } from "../_internal/workflow-template-properties.js";

/** Rule implementation for workflow-template YAML pair checks. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program(node) {
                if (!isWorkflowTemplateYamlFile(context.filename)) {
                    return;
                }

                const pairedPropertiesPath = getPairedTemplatePropertiesPath(
                    context.filename
                );

                if (existsSync(pairedPropertiesPath)) {
                    return;
                }

                context.report({
                    data: {
                        pairedPropertiesPath,
                    },
                    messageId: "missingTemplatePropertiesPair",
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
                "require each workflow template YAML file to have a matching `.properties.json` metadata file.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R054",
            ruleNumber: 54,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-workflow-template-pair",
        },
        messages: {
            missingTemplatePropertiesPair:
                "Workflow template file is missing its paired metadata file '{{pairedPropertiesPath}}'.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
