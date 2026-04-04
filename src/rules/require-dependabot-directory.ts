/**
 * @packageDocumentation
 * Require every Dependabot update entry to define `directory` or `directories`.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import {
    getDependabotRoot,
    getDependabotUpdateEntries,
    getDependabotUpdateLabel,
    getNonEmptyStringSequenceEntries,
} from "../_internal/dependabot-yaml.js";
import {
    getMappingPair,
    getScalarStringValue,
} from "../_internal/workflow-yaml.js";

/** Determine whether a scalar-like directory value is present and non-empty. */
const hasNonEmptyDirectory = (
    value: null | Readonly<AST.YAMLContent | AST.YAMLWithMeta> | undefined
): boolean => {
    const directoryValue = getScalarStringValue(value)?.trim();

    return (
        directoryValue !== undefined &&
        directoryValue !== null &&
        directoryValue.length > 0
    );
};

/** Rule implementation for requiring `directory` or `directories`. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getDependabotRoot(context);

                if (root === null) {
                    return;
                }

                for (const update of getDependabotUpdateEntries(root)) {
                    const directoryPair = getMappingPair(
                        update.mapping,
                        "directory"
                    );
                    const directoriesPair = getMappingPair(
                        update.mapping,
                        "directories"
                    );
                    const hasDirectory = hasNonEmptyDirectory(
                        directoryPair?.value
                    );
                    const directoryEntries = getNonEmptyStringSequenceEntries(
                        directoriesPair?.value
                    );
                    const hasDirectories = directoryEntries.length > 0;

                    if (hasDirectory !== hasDirectories) {
                        continue;
                    }

                    context.report({
                        data: {
                            updateLabel: getDependabotUpdateLabel(update),
                        },
                        messageId:
                            hasDirectory && hasDirectories
                                ? "conflictingDirectorySettings"
                                : "missingDirectorySetting",
                        node: (directoriesPair ??
                            directoryPair ??
                            update.node) as unknown as Rule.Node,
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
                "require every Dependabot `updates` entry to define exactly one of `directory` or `directories`.",
            dialects: ["Dependabot configuration"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R073",
            ruleNumber: 73,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-directory",
        },
        messages: {
            conflictingDirectorySettings:
                "{{updateLabel}} should define either `directory` or `directories`, not both.",
            missingDirectorySetting:
                "{{updateLabel}} must define a non-empty `directory` or `directories` value.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
