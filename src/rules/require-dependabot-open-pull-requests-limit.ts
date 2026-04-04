/**
 * @packageDocumentation
 * Require Dependabot update entries to define open pull request limits.
 */
import type { Rule } from "eslint";

import {
    getDependabotRoot,
    getDependabotUpdateEntries,
    getDependabotUpdateLabel,
} from "../_internal/dependabot-yaml.js";
import {
    getMappingPair,
    getScalarNumberValue,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring open-pull-requests-limit. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getDependabotRoot(context);

                if (root === null) {
                    return;
                }

                for (const update of getDependabotUpdateEntries(root)) {
                    const limitPair = getMappingPair(
                        update.mapping,
                        "open-pull-requests-limit"
                    );
                    const limitValue = getScalarNumberValue(
                        limitPair?.value ?? null
                    );

                    if (limitValue !== null) {
                        continue;
                    }

                    context.report({
                        data: {
                            updateLabel: getDependabotUpdateLabel(update),
                        },
                        messageId: "missingOpenPullRequestsLimit",
                        node: (limitPair?.value ??
                            limitPair ??
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
                "require Dependabot update entries to define `open-pull-requests-limit`.",
            dialects: ["Dependabot configuration"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R087",
            ruleNumber: 87,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-open-pull-requests-limit",
        },
        messages: {
            missingOpenPullRequestsLimit:
                "{{updateLabel}} should define `open-pull-requests-limit` so Dependabot pull request volume is explicitly controlled.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
