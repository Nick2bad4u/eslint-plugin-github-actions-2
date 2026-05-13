/**
 * @packageDocumentation
 * Require each workflow template YAML file to have a paired `.properties.json` metadata file.
 */
import type { Rule } from "eslint";

import { existsSync } from "node:fs";

import { isWorkflowTemplateYamlFile } from "../_internal/lint-targets.js";
import { reportYamlNode } from "../_internal/report.js";
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

                // eslint-disable-next-line n/no-sync, security/detect-non-literal-fs-filename -- pairedPropertiesPath is derived from repository-local workflow template naming conventions.
                if (existsSync(pairedPropertiesPath)) {
                    return;
                }

                reportYamlNode(context, {
                    data: {
                        pairedPropertiesPath,
                    },
                    messageId: "missingTemplatePropertiesPair",
                    node: node,
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.workflowTemplates",
                "github-actions.configs.all",
            ],
            description:
                "require each workflow template YAML file to have a matching `.properties.json` metadata file.",
            dialects: ["GitHub Actions workflow template"],
            frozen: false,
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
