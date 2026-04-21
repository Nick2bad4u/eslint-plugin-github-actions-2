/**
 * @packageDocumentation
 * Require `version: 2` in Dependabot configuration files.
 */
import type { Rule } from "eslint";

import { arrayFirst } from "ts-extras";

import {
    getDependabotMappingStringValue,
    getDependabotRoot,
} from "../_internal/dependabot-yaml.js";
import { getMappingPair } from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring `version: 2` in Dependabot config. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program(node) {
                const root = getDependabotRoot(context);

                if (root === null) {
                    return;
                }

                const versionPair = getMappingPair(root, "version");
                const versionValue = getDependabotMappingStringValue(
                    root,
                    "version"
                );

                if (versionValue === "2") {
                    return;
                }

                context.report({
                    fix: (fixer) => {
                        if (versionPair === null) {
                            return fixer.insertTextBeforeRange(
                                [arrayFirst(root.range), arrayFirst(root.range)],
                                "version: 2\n"
                            );
                        }

                        return versionPair.value === null
                            ? fixer.replaceTextRange(
                                  versionPair.range,
                                  "version: 2"
                              )
                            : fixer.replaceTextRange(
                                  versionPair.value.range,
                                  "2"
                              );
                    },
                    messageId:
                        versionPair === null
                            ? "missingDependabotVersion"
                            : "invalidDependabotVersion",
                    node: (versionPair?.value ??
                        versionPair ??
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
                "require Dependabot configuration files to declare `version: 2`.",
            dialects: ["Dependabot configuration"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R070",
            ruleNumber: 70,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-version",
        },
        fixable: "code",
        messages: {
            invalidDependabotVersion:
                "Dependabot configuration must declare `version: 2`.",
            missingDependabotVersion:
                "Dependabot configuration is missing the required top-level `version: 2` key.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
