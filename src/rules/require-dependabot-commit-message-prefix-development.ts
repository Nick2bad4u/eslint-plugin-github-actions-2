/**
 * @packageDocumentation
 * Require npm-like Dependabot update entries to define commit-message.prefix-development.
 */
import type { Rule } from "eslint";

import { isDefined, setHas } from "ts-extras";

import {
    getDependabotMappingStringValue,
    getDependabotRoot,
    getDependabotUpdateEntries,
    getDependabotUpdateLabel,
    getEffectiveDependabotUpdateMapping,
} from "../_internal/dependabot-yaml.js";
import { reportYamlNode } from "../_internal/report.js";
import { getMappingPair } from "../_internal/workflow-yaml.js";

const ecosystemsSupportingPrefixDevelopment = new Set([
    "bundler",
    "composer",
    "maven",
    "mix",
    "npm",
    "pip",
    "uv",
]);

/** Rule implementation for commit-message.prefix-development requirements. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getDependabotRoot(context);

                if (root === null) {
                    return;
                }

                for (const update of getDependabotUpdateEntries(root)) {
                    const packageEcosystem = update.packageEcosystem?.trim();

                    if (
                        !isDefined(packageEcosystem) ||
                        !setHas(
                            ecosystemsSupportingPrefixDevelopment,
                            packageEcosystem
                        )
                    ) {
                        continue;
                    }

                    const commitMessageMapping =
                        getEffectiveDependabotUpdateMapping(
                            root,
                            update,
                            "commit-message"
                        );
                    const prefixDevelopmentPair =
                        commitMessageMapping === null
                            ? null
                            : getMappingPair(
                                  commitMessageMapping,
                                  "prefix-development"
                              );
                    const prefixDevelopmentValue =
                        commitMessageMapping === null
                            ? null
                            : getDependabotMappingStringValue(
                                  commitMessageMapping,
                                  "prefix-development"
                              );

                    if (prefixDevelopmentValue !== null) {
                        continue;
                    }

                    reportYamlNode(context, {
                        data: {
                            updateLabel: getDependabotUpdateLabel(update),
                        },
                        messageId: "missingPrefixDevelopment",
                        node:
                            prefixDevelopmentPair?.value ??
                            prefixDevelopmentPair ??
                            update.node,
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
                "require npm-like Dependabot update entries to define `commit-message.prefix-development`.",
            dialects: ["Dependabot configuration"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R090",
            ruleNumber: 90,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-commit-message-prefix-development",
        },
        messages: {
            missingPrefixDevelopment:
                "{{updateLabel}} should define `commit-message.prefix-development` so development dependency updates have a distinct title convention.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
