/**
 * @packageDocumentation
 * Require GitHub Actions Dependabot updates to use `directory: /`.
 */
import type { Rule } from "eslint";

import {
    getDependabotRoot,
    getDependabotUpdateEntries,
    getDependabotUpdateLabel,
} from "../_internal/dependabot-yaml.js";
import {
    getMappingPair,
    getScalarStringValue,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for GitHub Actions directory-root enforcement. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getDependabotRoot(context);

                if (root === null) {
                    return;
                }

                for (const update of getDependabotUpdateEntries(root)) {
                    if (update.packageEcosystem?.trim() !== "github-actions") {
                        continue;
                    }

                    const directoryPair = getMappingPair(
                        update.mapping,
                        "directory"
                    );
                    const directoriesPair = getMappingPair(
                        update.mapping,
                        "directories"
                    );
                    const directoryValue = getScalarStringValue(
                        directoryPair?.value
                    )?.trim();

                    if (directoryValue === "/" && directoriesPair === null) {
                        continue;
                    }

                    context.report({
                        data: {
                            updateLabel: getDependabotUpdateLabel(update),
                        },
                        messageId: "githubActionsDirectoryMustBeRoot",
                        node: (directoriesPair ??
                            directoryPair ??
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
                'require Dependabot `github-actions` update entries to use `directory: "/"`.',
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R084",
            ruleNumber: 84,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-github-actions-directory-root",
        },
        messages: {
            githubActionsDirectoryMustBeRoot:
                '{{updateLabel}} uses `package-ecosystem: github-actions` and should use `directory: "/"` so Dependabot scans the standard workflow and root action metadata locations.',
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
