/**
 * @packageDocumentation
 * Require npm Dependabot update entries to define versioning strategy.
 */
import type { Rule } from "eslint";

import {
    getDependabotRoot,
    getDependabotUpdateEntries,
    getDependabotUpdateLabel,
} from "../_internal/dependabot-yaml.js";
import {
    getMappingPair,
    getScalarStringValue,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for npm versioning strategy requirements. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getDependabotRoot(context);

                if (root === null) {
                    return;
                }

                for (const update of getDependabotUpdateEntries(root)) {
                    if (update.packageEcosystem?.trim() !== "npm") {
                        continue;
                    }

                    const strategyPair = getMappingPair(
                        update.mapping,
                        "versioning-strategy"
                    );
                    const strategyValue = getScalarStringValue(
                        strategyPair?.value ?? null
                    )?.trim();

                    if (
                        strategyValue !== undefined &&
                        strategyValue !== null &&
                        strategyValue.length > 0
                    ) {
                        continue;
                    }

                    context.report({
                        data: {
                            updateLabel: getDependabotUpdateLabel(update),
                        },
                        messageId: "missingVersioningStrategy",
                        node: (strategyPair?.value ??
                            strategyPair ??
                            update.node) as unknown as Rule.Node,
                    });
                }
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
                "require npm Dependabot update entries to define `versioning-strategy`.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R088",
            ruleNumber: 88,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-versioning-strategy-for-npm",
        },
        messages: {
            missingVersioningStrategy:
                "{{updateLabel}} should define `versioning-strategy` so npm dependency range updates follow an explicit policy.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
