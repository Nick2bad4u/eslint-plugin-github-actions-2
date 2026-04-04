/**
 * @packageDocumentation
 * Require Dependabot update entries to define an effective target branch.
 */
import type { Rule } from "eslint";

import {
    getDependabotRoot,
    getDependabotUpdateEntries,
    getDependabotUpdateLabel,
    getEffectiveDependabotStringValue,
    getEffectiveDependabotUpdateValue,
} from "../_internal/dependabot-yaml.js";

/** Rule implementation for requiring effective target branches. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getDependabotRoot(context);

                if (root === null) {
                    return;
                }

                for (const update of getDependabotUpdateEntries(root)) {
                    const targetBranchValue = getEffectiveDependabotUpdateValue(
                        root,
                        update,
                        "target-branch"
                    );
                    const targetBranch = getEffectiveDependabotStringValue(
                        root,
                        update,
                        "target-branch"
                    );

                    if (targetBranch !== null) {
                        continue;
                    }

                    context.report({
                        data: {
                            updateLabel: getDependabotUpdateLabel(update),
                        },
                        messageId: "missingTargetBranch",
                        node: (targetBranchValue ??
                            update.node) as unknown as Rule.Node,
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
                "require Dependabot update entries to define an effective `target-branch` directly or via a multi-ecosystem group.",
            dialects: ["Dependabot configuration"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R078",
            ruleNumber: 78,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-target-branch",
        },
        messages: {
            missingTargetBranch:
                "{{updateLabel}} should define `target-branch` so Dependabot pull requests land on the intended maintenance branch.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
