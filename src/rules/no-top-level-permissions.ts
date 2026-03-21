/**
 * @packageDocumentation
 * Disallow declaring workflow permissions at the top level.
 */
import type { Rule } from "eslint";

import { getMappingPair, getWorkflowRoot } from "../_internal/workflow-yaml.js";

/** Rule implementation for disallowing top-level workflow permissions. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                const permissionsPair = getMappingPair(root, "permissions");

                if (permissionsPair !== null) {
                    context.report({
                        messageId: "topLevelPermissions",
                        node: permissionsPair.key as unknown as Rule.Node,
                    });
                }
            },
        };
    },
    meta: {
        docs: {
            configs: ["github-actions.configs.all"],
            description:
                "disallow top-level workflow `permissions` when you want every job to declare its own token scope explicitly.",
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R014",
            ruleNumber: 14,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-top-level-permissions",
        },
        messages: {
            topLevelPermissions:
                "Avoid top-level workflow `permissions`; declare `permissions` on each job instead.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
