/**
 * @packageDocumentation
 * Require `version: 2` in Dependabot configuration files.
 */
import type { Rule } from "eslint";

import { getDependabotRoot } from "../_internal/dependabot-yaml.js";
import {
    getMappingPair,
    getScalarStringValue,
} from "../_internal/workflow-yaml.js";

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
                const versionValue = getScalarStringValue(
                    versionPair?.value
                )?.trim();

                if (versionValue === "2") {
                    return;
                }

                context.report({
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
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.dependabot",
            ],
            description:
                "require Dependabot configuration files to declare `version: 2`.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R070",
            ruleNumber: 70,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-version",
        },
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
