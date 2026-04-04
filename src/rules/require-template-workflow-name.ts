/**
 * @packageDocumentation
 * Require template workflow YAML files to declare a non-empty top-level `name`.
 */
import type { Rule } from "eslint";

import { isWorkflowTemplateYamlFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getScalarStringValue,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring workflow names in template YAML files. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program(node) {
                if (!isWorkflowTemplateYamlFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                const namePair = getMappingPair(root, "name");
                const workflowName = getScalarStringValue(namePair?.value);

                if (workflowName !== null && workflowName.trim().length > 0) {
                    return;
                }

                context.report({
                    messageId: "missingTemplateWorkflowName",
                    node: (namePair ?? node) as unknown as Rule.Node,
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
                "require workflow template YAML files to declare a non-empty top-level `name`.",
            dialects: ["GitHub Actions workflow template"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R067",
            ruleNumber: 67,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-template-workflow-name",
        },
        messages: {
            missingTemplateWorkflowName:
                "Workflow template files should declare a non-empty top-level `name`.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
