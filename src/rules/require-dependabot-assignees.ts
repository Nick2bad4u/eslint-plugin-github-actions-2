/**
 * @packageDocumentation
 * Require Dependabot update entries to define effective assignees.
 */
import type { Rule } from "eslint";

import {
    getDependabotRoot,
    getDependabotUpdateEntries,
    getDependabotUpdateLabel,
    getEffectiveDependabotUpdateValue,
    getNonEmptyStringSequenceEntries,
} from "../_internal/dependabot-yaml.js";

/** Rule implementation for requiring effective assignees. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getDependabotRoot(context);

                if (root === null) {
                    return;
                }

                for (const update of getDependabotUpdateEntries(root)) {
                    const assigneesValue = getEffectiveDependabotUpdateValue(
                        root,
                        update,
                        "assignees"
                    );

                    if (
                        getNonEmptyStringSequenceEntries(assigneesValue)
                            .length > 0
                    ) {
                        continue;
                    }

                    context.report({
                        data: {
                            updateLabel: getDependabotUpdateLabel(update),
                        },
                        messageId: "missingAssignees",
                        node: (assigneesValue ??
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
                "require Dependabot update entries to define effective `assignees` directly or via a multi-ecosystem group.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R077",
            ruleNumber: 77,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-assignees",
        },
        messages: {
            missingAssignees:
                "{{updateLabel}} should define non-empty `assignees` so Dependabot pull requests have clear ownership.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
