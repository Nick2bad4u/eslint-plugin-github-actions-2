/**
 * @packageDocumentation
 * Require every Dependabot update entry to define a non-empty `package-ecosystem`.
 */
import type { Rule } from "eslint";

import {
    getDependabotRoot,
    getDependabotUpdateLabel,
} from "../_internal/dependabot-yaml.js";
import {
    getMappingPair,
    getMappingValueAsSequence,
    getScalarStringValue,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring `package-ecosystem` in each update entry. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getDependabotRoot(context);

                if (root === null) {
                    return;
                }

                const updatesSequence = getMappingValueAsSequence(
                    root,
                    "updates"
                );

                if (updatesSequence === null) {
                    return;
                }

                for (const [
                    index,
                    entry,
                ] of updatesSequence.entries.entries()) {
                    const updateMapping = unwrapYamlValue(entry);

                    if (entry === null || entry === undefined) {
                        continue;
                    }

                    if (updateMapping?.type !== "YAMLMapping") {
                        context.report({
                            messageId: "invalidDependabotUpdateEntry",
                            node: entry as unknown as Rule.Node,
                        });

                        continue;
                    }

                    const ecosystemPair = getMappingPair(
                        updateMapping,
                        "package-ecosystem"
                    );
                    const ecosystemValue = getScalarStringValue(
                        ecosystemPair?.value
                    )?.trim();

                    if (
                        ecosystemValue !== undefined &&
                        ecosystemValue !== null &&
                        ecosystemValue.length > 0
                    ) {
                        continue;
                    }

                    context.report({
                        data: {
                            updateLabel: getDependabotUpdateLabel({
                                index: index + 1,
                                mapping: updateMapping,
                                multiEcosystemGroup: null,
                                node: entry,
                                packageEcosystem: null,
                            }),
                        },
                        messageId: "missingPackageEcosystem",
                        node: (ecosystemPair?.value ??
                            ecosystemPair ??
                            entry) as unknown as Rule.Node,
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
                "require every Dependabot `updates` entry to define a non-empty `package-ecosystem`.",
            dialects: ["Dependabot configuration"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R072",
            ruleNumber: 72,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-package-ecosystem",
        },
        messages: {
            invalidDependabotUpdateEntry:
                "Each `updates` entry must be a mapping so Dependabot options such as `package-ecosystem` can be defined.",
            missingPackageEcosystem:
                "{{updateLabel}} is missing a non-empty `package-ecosystem` value.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
