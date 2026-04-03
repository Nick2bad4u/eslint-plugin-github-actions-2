/**
 * @packageDocumentation
 * Disallow guaranteed overlapping Dependabot directory selectors for the same ecosystem and target branch.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import {
    type DependabotUpdateEntry,
    getDependabotDirectorySelectorEntries,
    getDependabotRoot,
    getDependabotUpdateEntries,
    getDependabotUpdateLabel,
    getEffectiveDependabotTargetBranch,
} from "../_internal/dependabot-yaml.js";

type SeenSelectorEntry = {
    readonly directoryNode: AST.YAMLNode;
    readonly directorySelector: string;
    readonly packageEcosystem: string;
    readonly targetBranch: string;
    readonly update: DependabotUpdateEntry;
};

/** Normalize a directory selector string for stable overlap comparison. */
const normalizeDirectorySelector = (selector: string): string => {
    const trimmedSelector = selector.trim().replaceAll("\\", "/");

    if (trimmedSelector === "/") {
        return trimmedSelector;
    }

    return trimmedSelector.endsWith("/")
        ? trimmedSelector.slice(0, -1)
        : trimmedSelector;
};

/** Determine whether a selector contains glob syntax. */
const hasGlobSyntax = (selector: string): boolean =>
    /[*?[\]{}]/u.test(selector);

/** Escape regex-significant characters except glob tokens handled separately. */
const escapeRegexLiteral = (value: string): string =>
    value.replaceAll(/[$()+.?[\\\]^{|}]/gu, String.raw`\$&`);

/**
 * Convert a conservative subset of glob syntax into a regex for exact-path
 * overlap checks.
 */
const globSelectorToRegExp = (selector: string): RegExp => {
    let pattern = "^";

    let index = 0;

    while (index < selector.length) {
        const character = selector[index];

        if (character === undefined) {
            index += 1;
            continue;
        }

        const nextCharacter = selector[index + 1];

        if (character === "*" && nextCharacter === "*") {
            pattern += ".*";
            index += 1;
            index += 1;
            continue;
        }

        if (character === "*") {
            pattern += "[^/]*";
            index += 1;
            continue;
        }

        if (character === "?") {
            pattern += "[^/]";
            index += 1;
            continue;
        }

        if (character === "[") {
            const closingBracketIndex = selector.indexOf("]", index + 1);

            if (closingBracketIndex > index + 1) {
                pattern += selector.slice(index, closingBracketIndex + 1);
                index = closingBracketIndex;
                index += 1;
                continue;
            }
        }

        pattern += escapeRegexLiteral(character);
        index += 1;
    }

    pattern += "$";

    // eslint-disable-next-line security/detect-non-literal-regexp -- the pattern is derived from normalized repository-local Dependabot directory selectors, not user input from runtime requests
    return new RegExp(pattern, "u");
};

/** Determine whether two selectors are guaranteed to overlap. */
const selectorsDefinitelyOverlap = (
    leftSelector: string,
    rightSelector: string
): boolean => {
    if (leftSelector === rightSelector) {
        return true;
    }

    const leftHasGlob = hasGlobSyntax(leftSelector);
    const rightHasGlob = hasGlobSyntax(rightSelector);

    if (leftHasGlob && !rightHasGlob) {
        return globSelectorToRegExp(leftSelector).test(rightSelector);
    }

    if (!leftHasGlob && rightHasGlob) {
        return globSelectorToRegExp(rightSelector).test(leftSelector);
    }

    return false;
};

/** Rule implementation for overlapping Dependabot directory selectors. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getDependabotRoot(context);

                if (root === null) {
                    return;
                }

                const seenSelectors: SeenSelectorEntry[] = [];

                for (const update of getDependabotUpdateEntries(root)) {
                    const packageEcosystem = update.packageEcosystem?.trim();

                    if (
                        packageEcosystem === undefined ||
                        packageEcosystem === null ||
                        packageEcosystem.length === 0
                    ) {
                        continue;
                    }

                    const targetBranch = getEffectiveDependabotTargetBranch(
                        root,
                        update
                    );

                    for (const selectorEntry of getDependabotDirectorySelectorEntries(
                        update
                    )) {
                        const directorySelector = normalizeDirectorySelector(
                            selectorEntry.value
                        );

                        const overlappingSelector = seenSelectors.find(
                            (seenSelector) =>
                                seenSelector.packageEcosystem ===
                                    packageEcosystem &&
                                seenSelector.targetBranch === targetBranch &&
                                selectorsDefinitelyOverlap(
                                    seenSelector.directorySelector,
                                    directorySelector
                                )
                        );

                        if (overlappingSelector !== undefined) {
                            context.report({
                                data: {
                                    directorySelector,
                                    otherDirectorySelector:
                                        overlappingSelector.directorySelector,
                                    otherUpdateLabel: getDependabotUpdateLabel(
                                        overlappingSelector.update
                                    ),
                                    targetBranch,
                                    updateLabel:
                                        getDependabotUpdateLabel(update),
                                },
                                messageId: "overlappingDependabotDirectories",
                                node: selectorEntry.node as unknown as Rule.Node,
                            });

                            continue;
                        }

                        seenSelectors.push({
                            directoryNode: selectorEntry.node,
                            directorySelector,
                            packageEcosystem,
                            targetBranch,
                            update,
                        });
                    }
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
                "disallow guaranteed overlapping Dependabot directory selectors for the same package ecosystem and target branch.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R095",
            ruleNumber: 95,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-overlapping-dependabot-directories",
        },
        messages: {
            overlappingDependabotDirectories:
                "{{updateLabel}} directory selector '{{directorySelector}}' overlaps with {{otherUpdateLabel}} selector '{{otherDirectorySelector}}' for package ecosystem updates targeting '{{targetBranch}}'.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
