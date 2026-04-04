/**
 * @packageDocumentation
 * Disallow `runs.pre-if` when `runs.pre` is not declared.
 */
import type { Rule } from "eslint";

import { isActionMetadataFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";
import { getEnclosingLineRemovalRange } from "../_internal/yaml-fixes.js";

/** Rule implementation for invalid `runs.pre-if` usage. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                if (!isActionMetadataFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);
                const runsMapping =
                    root === null
                        ? null
                        : getMappingValueAsMapping(root, "runs");

                if (runsMapping === null) {
                    return;
                }

                const preIfPair = getMappingPair(runsMapping, "pre-if");

                if (preIfPair === null || getMappingPair(runsMapping, "pre")) {
                    return;
                }

                context.report({
                    fix: (fixer) =>
                        fixer.removeRange(
                            getEnclosingLineRemovalRange(
                                context.sourceCode.text,
                                preIfPair.range
                            )
                        ),
                    messageId: "preIfWithoutPre",
                    node: (preIfPair.value ??
                        preIfPair) as unknown as Rule.Node,
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.actionMetadata",
                "github-actions.configs.all",
            ],
            description:
                "disallow `runs.pre-if` when `runs.pre` is not configured in action metadata.",
            dialects: ["GitHub Action metadata"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R045",
            ruleNumber: 45,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-pre-if-without-pre",
        },
        fixable: "code",
        messages: {
            preIfWithoutPre:
                "`runs.pre-if` is set, but `runs.pre` is missing. Remove `pre-if` or add `pre`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
