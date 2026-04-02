/**
 * @packageDocumentation
 * Disallow the unused top-level `enable-beta-ecosystems` Dependabot setting.
 */
import type { Rule } from "eslint";

import { getDependabotRoot } from "../_internal/dependabot-yaml.js";
import { getMappingPair } from "../_internal/workflow-yaml.js";

/** Rule implementation for the unused `enable-beta-ecosystems` key. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getDependabotRoot(context);

                if (root === null) {
                    return;
                }

                const enableBetaEcosystemsPair = getMappingPair(
                    root,
                    "enable-beta-ecosystems"
                );

                if (enableBetaEcosystemsPair === null) {
                    return;
                }

                context.report({
                    messageId: "unusedEnableBetaEcosystems",
                    node: (enableBetaEcosystemsPair.value ??
                        enableBetaEcosystemsPair) as unknown as Rule.Node,
                });
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.dependabot",
            ],
            description:
                "disallow the top-level Dependabot `enable-beta-ecosystems` setting because GitHub currently documents it as unused.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R085",
            ruleNumber: 85,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-unused-dependabot-enable-beta-ecosystems",
        },
        messages: {
            unusedEnableBetaEcosystems:
                "Remove `enable-beta-ecosystems`. GitHub currently documents this Dependabot setting as not in use.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
