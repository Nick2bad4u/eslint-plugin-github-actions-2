/**
 * @packageDocumentation
 * Disallow workflow-wide environment variables under the top-level `env` key.
 */
import type { Rule } from "eslint";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import { getMappingPair, getWorkflowRoot } from "../_internal/workflow-yaml.js";

/** Rule implementation for disallowing top-level workflow env. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                if (!isWorkflowFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                const envPair = getMappingPair(root, "env");

                if (envPair !== null) {
                    context.report({
                        messageId: "topLevelEnv",
                        node: envPair.key as unknown as Rule.Node,
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
                "github-actions.configs.strict",
            ],
            description:
                "disallow top-level workflow `env` when you want environment variables scoped closer to the jobs and steps that use them.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R013",
            ruleNumber: 13,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-top-level-env",
        },
        messages: {
            topLevelEnv:
                "Avoid top-level workflow `env`; prefer job-level or step-level `env` declarations instead.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
