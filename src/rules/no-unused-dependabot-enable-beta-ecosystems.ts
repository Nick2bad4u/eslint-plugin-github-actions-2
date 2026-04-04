/**
 * @packageDocumentation
 * Disallow the unused top-level `enable-beta-ecosystems` Dependabot setting.
 */
import type { Rule } from "eslint";

import { getDependabotRoot } from "../_internal/dependabot-yaml.js";
import { getMappingPair } from "../_internal/workflow-yaml.js";
import { getEnclosingLineRemovalRange } from "../_internal/yaml-fixes.js";

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
                    fix: (fixer) =>
                        fixer.removeRange(
                            getEnclosingLineRemovalRange(
                                context.sourceCode.text,
                                enableBetaEcosystemsPair.range
                            )
                        ),
                    messageId: "unusedEnableBetaEcosystems",
                    node: (enableBetaEcosystemsPair.value ??
                        enableBetaEcosystemsPair) as unknown as Rule.Node,
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.dependabot",
            ],
            description:
                "disallow the top-level Dependabot `enable-beta-ecosystems` setting because GitHub currently documents it as unused.",
            dialects: ["Dependabot configuration"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R085",
            ruleNumber: 85,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-unused-dependabot-enable-beta-ecosystems",
        },
        fixable: "code",
        messages: {
            unusedEnableBetaEcosystems:
                "Remove `enable-beta-ecosystems`. GitHub currently documents this Dependabot setting as not in use.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
