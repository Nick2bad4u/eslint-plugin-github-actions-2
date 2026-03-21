/**
 * @packageDocumentation
 * Prefer `action.yml` over `action.yaml` for action metadata.
 */
import type { Rule } from "eslint";

import { usesYamlExtension } from "../_internal/lint-targets.js";

/** Rule implementation for preferring `action.yml`. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program(node) {
                if (!context.filename.toLowerCase().endsWith("action.yaml")) {
                    return;
                }

                if (!usesYamlExtension(context.filename)) {
                    return;
                }

                context.report({
                    messageId: "preferActionYml",
                    node: node as unknown as Rule.Node,
                });
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.actionMetadata",
                "github-actions.configs.all",
            ],
            description:
                "require action metadata files to prefer `action.yml` over `action.yaml`.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R043",
            ruleNumber: 43,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/prefer-action-yml",
        },
        messages: {
            preferActionYml:
                "Prefer naming action metadata files `action.yml` instead of `action.yaml`.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
