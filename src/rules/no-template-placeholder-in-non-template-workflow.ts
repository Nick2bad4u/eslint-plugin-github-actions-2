/**
 * @packageDocumentation
 * Disallow `$default-branch` placeholder usage outside workflow template files.
 */
import type { Rule } from "eslint";

import {
    isWorkflowTemplatePropertiesFile,
    isWorkflowTemplateYamlFile,
} from "../_internal/lint-targets.js";
import { getWorkflowRoot } from "../_internal/workflow-yaml.js";
import { visitYamlStringScalars } from "../_internal/yaml-traversal.js";

/** Placeholder token supported in template files. */
const defaultBranchPlaceholder = "$default-branch";

/** Rule implementation for invalid placeholder usage outside templates. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                if (isWorkflowTemplateYamlFile(context.filename)) {
                    return;
                }

                if (isWorkflowTemplatePropertiesFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                visitYamlStringScalars(root, (node, value) => {
                    if (!value.includes(defaultBranchPlaceholder)) {
                        return;
                    }

                    context.report({
                        messageId: "templatePlaceholderOutsideTemplate",
                        node: node as unknown as Rule.Node,
                    });
                });
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.recommended",
                "github-actions.configs.strict",
                "github-actions.configs.all",
            ],
            description:
                "disallow `$default-branch` placeholder usage outside workflow template YAML files.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R069",
            ruleNumber: 69,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-template-placeholder-in-non-template-workflow",
        },
        messages: {
            templatePlaceholderOutsideTemplate:
                "`$default-branch` is intended for workflow template files and should not be used in regular workflow YAML files.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
