/**
 * @packageDocumentation
 * Require Dependabot update entries to define effective labels.
 */
import type { Rule } from "eslint";

import {
    getDependabotRoot,
    getDependabotUpdateEntries,
    getDependabotUpdateLabel,
    getEffectiveDependabotUpdateValue,
    getNonEmptyStringSequenceEntries,
} from "../_internal/dependabot-yaml.js";

/** Rule implementation for requiring effective labels. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getDependabotRoot(context);

                if (root === null) {
                    return;
                }

                for (const update of getDependabotUpdateEntries(root)) {
                    const labelsValue = getEffectiveDependabotUpdateValue(
                        root,
                        update,
                        "labels"
                    );

                    if (
                        getNonEmptyStringSequenceEntries(labelsValue).length > 0
                    ) {
                        continue;
                    }

                    context.report({
                        data: {
                            updateLabel: getDependabotUpdateLabel(update),
                        },
                        messageId: "missingLabels",
                        node: (labelsValue ??
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
                "require Dependabot update entries to define effective `labels` directly or via a multi-ecosystem group.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R080",
            ruleNumber: 80,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-labels",
        },
        messages: {
            missingLabels:
                "{{updateLabel}} should define non-empty `labels` so Dependabot pull requests stay easy to triage and automate.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
