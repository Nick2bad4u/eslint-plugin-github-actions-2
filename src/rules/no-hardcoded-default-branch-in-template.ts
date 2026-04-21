/**
 * @packageDocumentation
 * Disallow hardcoded default branch names in workflow templates.
 */
import type { Rule } from "eslint";

import { setHas } from "ts-extras";

import { isWorkflowTemplateYamlFile } from "../_internal/lint-targets.js";
import { getWorkflowRoot } from "../_internal/workflow-yaml.js";
import { visitYamlStringScalars } from "../_internal/yaml-traversal.js";

/** Branch literals that should be replaced with `$default-branch` in templates. */
const hardcodedDefaultBranchNames = new Set(["main", "master"]);

/** Rule implementation for hardcoded default branch checks in templates. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                if (!isWorkflowTemplateYamlFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                visitYamlStringScalars(root, (node, value) => {
                    if (!setHas(hardcodedDefaultBranchNames, value.trim())) {
                        return;
                    }

                    context.report({
                        data: {
                            branchName: value,
                        },
                        messageId: "hardcodedDefaultBranch",
                        node: node as unknown as Rule.Node,
                    });
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
                "disallow hardcoded `main`/`master` branch literals in workflow template YAML files.",
            dialects: ["GitHub Actions workflow template"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R068",
            ruleNumber: 68,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-hardcoded-default-branch-in-template",
        },
        messages: {
            hardcodedDefaultBranch:
                "Template contains hardcoded default branch '{{branchName}}'; prefer `$default-branch` placeholder.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
