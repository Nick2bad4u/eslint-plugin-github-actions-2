/**
 * @packageDocumentation
 * Disallow references to undefined Dependabot multi-ecosystem groups.
 */
import type { Rule } from "eslint";

import {
    getDependabotReferencedGroup,
    getDependabotRoot,
    getDependabotUpdateEntries,
    getDependabotUpdateLabel,
} from "../_internal/dependabot-yaml.js";
import { getMappingPair } from "../_internal/workflow-yaml.js";

/** Rule implementation for unknown multi-ecosystem-group references. */
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

                    if (getDependabotReferencedGroup(root, update) !== null) {
                        continue;
                    }

                    const groupPair = getMappingPair(
                        update.mapping,
                        "multi-ecosystem-group"
                    );

                    context.report({
                        data: {
                            groupName: update.multiEcosystemGroup,
                            updateLabel: getDependabotUpdateLabel(update),
                        },
                        messageId: "unknownMultiEcosystemGroup",
                        node: (groupPair?.value ??
                            groupPair ??
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
                "disallow Dependabot `multi-ecosystem-group` references that do not match a declared top-level group.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R081",
            ruleNumber: 81,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-unknown-dependabot-multi-ecosystem-group",
        },
        messages: {
            unknownMultiEcosystemGroup:
                "{{updateLabel}} references unknown `multi-ecosystem-group` '{{groupName}}'. Declare it under top-level `multi-ecosystem-groups` or remove the reference.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
