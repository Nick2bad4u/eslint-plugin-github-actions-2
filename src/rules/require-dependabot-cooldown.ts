/**
 * @packageDocumentation
 * Require Dependabot update entries to declare cooldown settings.
 */
import type { Rule } from "eslint";

import {
    getDependabotRoot,
    getDependabotUpdateEntries,
    getDependabotUpdateLabel,
} from "../_internal/dependabot-yaml.js";
import { getMappingPair } from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring cooldown settings. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getDependabotRoot(context);

                if (root === null) {
                    return;
                }

                for (const update of getDependabotUpdateEntries(root)) {
                    const cooldownPair = getMappingPair(
                        update.mapping,
                        "cooldown"
                    );

                    if (cooldownPair !== null) {
                        continue;
                    }

                    context.report({
                        data: {
                            updateLabel: getDependabotUpdateLabel(update),
                        },
                        messageId: "missingCooldown",
                        node: update.node as unknown as Rule.Node,
                    });
                }
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
                "require Dependabot update entries to declare a `cooldown` policy.",
            dialects: ["Dependabot configuration"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R086",
            ruleNumber: 86,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-cooldown",
        },
        messages: {
            missingCooldown:
                "{{updateLabel}} should declare `cooldown` so version update churn is intentionally throttled.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
