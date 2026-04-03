/**
 * @packageDocumentation
 * Require Dependabot commit messages to include dependency scope information.
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

/** Rule implementation for commit-message.include requirements. */
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
                    const includePair =
                        commitMessageMapping === null
                            ? null
                            : getMappingPair(commitMessageMapping, "include");
                    const includeValue =
                        commitMessageMapping === null
                            ? null
                            : getDependabotMappingStringValue(
                                  commitMessageMapping,
                                  "include"
                              );

                    if (includeValue === "scope") {
                        continue;
                    }

                    context.report({
                        data: {
                            updateLabel: getDependabotUpdateLabel(update),
                        },
                        messageId: "missingCommitMessageIncludeScope",
                        node: (includePair?.value ??
                            includePair ??
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
                'require Dependabot commit messages to set `commit-message.include: "scope"`.',
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R089",
            ruleNumber: 89,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-commit-message-include-scope",
        },
        messages: {
            missingCommitMessageIncludeScope:
                '{{updateLabel}} should set `commit-message.include: "scope"` so Dependabot pull request titles indicate dependency scope clearly.',
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
