/**
 * @packageDocumentation
 * Require a non-empty top-level `updates` sequence in Dependabot configuration files.
 */
import type { Rule } from "eslint";

import { getDependabotRoot } from "../_internal/dependabot-yaml.js";
import {
    getMappingPair,
    getMappingValueAsSequence,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring a non-empty `updates` sequence. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program(node) {
                const root = getDependabotRoot(context);

                if (root === null) {
                    return;
                }

                const updatesPair = getMappingPair(root, "updates");
                const updatesSequence = getMappingValueAsSequence(
                    root,
                    "updates"
                );

                if (
                    updatesSequence !== null &&
                    updatesSequence.entries.length > 0
                ) {
                    return;
                }

                context.report({
                    messageId:
                        updatesPair === null
                            ? "missingDependabotUpdates"
                            : "emptyDependabotUpdates",
                    node: (updatesPair?.value ??
                        updatesPair ??
                        node) as unknown as Rule.Node,
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
                "require Dependabot configuration files to define a non-empty top-level `updates` sequence.",
            dialects: ["Dependabot configuration"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R071",
            ruleNumber: 71,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-updates",
        },
        messages: {
            emptyDependabotUpdates:
                "Dependabot configuration must define at least one entry under the top-level `updates` sequence.",
            missingDependabotUpdates:
                "Dependabot configuration is missing the required top-level `updates` sequence.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
