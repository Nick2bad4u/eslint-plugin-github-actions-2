/**
 * @packageDocumentation
 * Require Dependabot update entries to define open pull request limits.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { setHas } from "ts-extras";

import {
    type DependabotUpdateEntry,
    getDependabotReferencedGroup,
    getDependabotRoot,
    getDependabotUpdateEntries,
    getDependabotUpdateLabel,
} from "../_internal/dependabot-yaml.js";
import {
    getMappingPair,
    getScalarNumberValue,
} from "../_internal/workflow-yaml.js";

/**
 * Process a single Dependabot update entry and report any
 * open-pull-requests-limit violations.
 */
const checkUpdateEntry = (
    context: Readonly<Rule.RuleContext>,
    root: Readonly<AST.YAMLMapping>,
    update: Readonly<DependabotUpdateEntry>,
    reportedGroupNames: Set<string>
): void => {
    const limitPair = getMappingPair(
        update.mapping,
        "open-pull-requests-limit"
    );

    if (update.multiEcosystemGroup !== null) {
        if (limitPair !== null) {
            context.report({
                data: {
                    updateLabel: getDependabotUpdateLabel(update),
                },
                messageId: "unsupportedOpenPullRequestsLimitOnGroupedUpdate",
                node: limitPair.key as unknown as Rule.Node,
            });
        }

        const groupMapping = getDependabotReferencedGroup(root, update);
        const groupLimitPair =
            groupMapping === null
                ? null
                : getMappingPair(groupMapping, "open-pull-requests-limit");

        if (
            groupLimitPair !== null &&
            !setHas(reportedGroupNames, update.multiEcosystemGroup)
        ) {
            reportedGroupNames.add(update.multiEcosystemGroup);

            context.report({
                data: {
                    groupName: update.multiEcosystemGroup,
                },
                messageId: "unsupportedOpenPullRequestsLimitOnGroup",
                node: groupLimitPair.key as unknown as Rule.Node,
            });
        }

        return;
    }

    const limitValue = getScalarNumberValue(limitPair?.value ?? null);

    if (limitValue === null) {
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
};

/** Rule implementation for requiring open-pull-requests-limit. */
const rule: Rule.RuleModule = {
    create(context) {
        const reportedGroupNames = new Set<string>();

        return {
            Program() {
                const root = getDependabotRoot(context);

                if (root === null) {
                    return;
                }

                for (const update of getDependabotUpdateEntries(root)) {
                    checkUpdateEntry(context, root, update, reportedGroupNames);
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
                "require standalone Dependabot update entries to define `open-pull-requests-limit`.",
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
            unsupportedOpenPullRequestsLimitOnGroup:
                "Multi-ecosystem group '{{groupName}}' should not define `open-pull-requests-limit`. Grouped updates already consolidate into a single Dependabot pull request.",
            unsupportedOpenPullRequestsLimitOnGroupedUpdate:
                "{{updateLabel}} uses `multi-ecosystem-group` and should not define `open-pull-requests-limit`. Grouped updates already consolidate into a single Dependabot pull request.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
