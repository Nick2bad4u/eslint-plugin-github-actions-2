/**
 * @packageDocumentation
 * Require workflows using actions/dependency-review-action to set permissions.contents to read.
 */
import type { Rule } from "eslint";

import { hasDependencyReviewAction } from "../_internal/dependency-review-workflow.ts";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for dependency-review contents permission requirements. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null || !hasDependencyReviewAction(root)) {
                    return;
                }

                const permissionsMapping = getMappingValueAsMapping(
                    root,
                    "permissions"
                );
                const contentsPair =
                    permissionsMapping === null
                        ? null
                        : getMappingPair(permissionsMapping, "contents");
                const contentsValue = getScalarStringValue(
                    contentsPair?.value ?? null
                )?.trim();

                if (contentsValue === "read") {
                    return;
                }

                context.report({
                    messageId: "missingContentsReadPermission",
                    node: (contentsPair?.value ??
                        contentsPair ??
                        permissionsMapping ??
                        root) as unknown as Rule.Node,
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.codeScanning",
                "github-actions.configs.security",
            ],
            description:
                "require workflows using `actions/dependency-review-action` to set top-level `permissions.contents: read`.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R092",
            ruleNumber: 92,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependency-review-permissions-contents-read",
        },
        messages: {
            missingContentsReadPermission:
                "Workflows using `actions/dependency-review-action` should set top-level `permissions.contents: read`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
