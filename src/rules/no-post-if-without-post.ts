/**
 * @packageDocumentation
 * Disallow `runs.post-if` when `runs.post` is not declared.
 */
import type { Rule } from "eslint";

import { isActionMetadataFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for invalid `runs.post-if` usage. */
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

                const postIfPair = getMappingPair(runsMapping, "post-if");

                if (
                    postIfPair === null ||
                    getMappingPair(runsMapping, "post")
                ) {
                    return;
                }

                context.report({
                    messageId: "postIfWithoutPost",
                    node: (postIfPair.value ??
                        postIfPair) as unknown as Rule.Node,
                });
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.actionMetadata",
                "github-actions.configs.all",
            ],
            description:
                "disallow `runs.post-if` when `runs.post` is not configured in action metadata.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R046",
            ruleNumber: 46,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-post-if-without-post",
        },
        messages: {
            postIfWithoutPost:
                "`runs.post-if` is set, but `runs.post` is missing. Remove `post-if` or add `post`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
