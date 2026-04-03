/**
 * @packageDocumentation
 * Require Dependabot update entries to define an effective commit message prefix.
 */
import type { Rule } from "eslint";

import {
    getDependabotMappingStringValue,
    getDependabotRoot,
    getDependabotUpdateEntries,
    getDependabotUpdateLabel,
    getEffectiveDependabotUpdateMapping,
} from "../_internal/dependabot-yaml.js";
import { getMappingPair } from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring effective commit-message prefixes. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getDependabotRoot(context);

                if (root === null) {
                    return;
                }

                for (const update of getDependabotUpdateEntries(root)) {
                    const commitMessageMapping =
                        getEffectiveDependabotUpdateMapping(
                            root,
                            update,
                            "commit-message"
                        );
                    const prefixPair =
                        commitMessageMapping === null
                            ? null
                            : getMappingPair(commitMessageMapping, "prefix");
                    const prefixValue =
                        commitMessageMapping === null
                            ? null
                            : getDependabotMappingStringValue(
                                  commitMessageMapping,
                                  "prefix"
                              );

                    if (prefixValue !== null) {
                        continue;
                    }

                    context.report({
                        data: {
                            updateLabel: getDependabotUpdateLabel(update),
                        },
                        messageId: "missingCommitMessagePrefix",
                        node: (prefixPair?.value ??
                            prefixPair ??
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
                "require Dependabot update entries to define an effective `commit-message.prefix` directly or via a multi-ecosystem group.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R079",
            ruleNumber: 79,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-commit-message-prefix",
        },
        messages: {
            missingCommitMessagePrefix:
                "{{updateLabel}} should define `commit-message.prefix` so Dependabot pull requests follow a predictable title convention.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
