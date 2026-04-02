/**
 * @packageDocumentation
 * Require grouped Dependabot update entries to declare `patterns`.
 */
import type { Rule } from "eslint";

import {
    getDependabotRoot,
    getDependabotUpdateEntries,
    getDependabotUpdateLabel,
    getNonEmptyStringSequenceEntries,
} from "../_internal/dependabot-yaml.js";
import { getMappingPair } from "../_internal/workflow-yaml.js";

/** Rule implementation for grouped-update pattern requirements. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getDependabotRoot(context);

                if (root === null) {
                    return;
                }

                for (const update of getDependabotUpdateEntries(root)) {
                    if (update.multiEcosystemGroup === null) {
                        continue;
                    }

                    const patternsPair = getMappingPair(
                        update.mapping,
                        "patterns"
                    );
                    const patternEntries = getNonEmptyStringSequenceEntries(
                        patternsPair?.value
                    );

                    if (patternEntries.length > 0) {
                        continue;
                    }

                    context.report({
                        data: {
                            updateLabel: getDependabotUpdateLabel(update),
                        },
                        messageId: "missingPatternsForGroupedUpdate",
                        node: (patternsPair?.value ??
                            patternsPair ??
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
                "require Dependabot update entries that use `multi-ecosystem-group` to define non-empty `patterns`.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R082",
            ruleNumber: 82,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-patterns-for-multi-ecosystem-group",
        },
        messages: {
            missingPatternsForGroupedUpdate:
                "{{updateLabel}} uses `multi-ecosystem-group` and should define non-empty `patterns` so Dependabot knows which dependencies to group.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
