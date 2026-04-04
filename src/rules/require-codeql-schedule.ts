/**
 * @packageDocumentation
 * Require CodeQL workflows to run on a schedule.
 */
import type { Rule } from "eslint";

import { getCodeqlInitSteps } from "../_internal/code-scanning-workflow.ts";
import {
    getWorkflowEventNames,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring scheduled CodeQL runs. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program(node) {
                const root = getWorkflowRoot(context);

                if (root === null || getCodeqlInitSteps(root).length === 0) {
                    return;
                }

                if (getWorkflowEventNames(root).has("schedule")) {
                    return;
                }

                context.report({
                    messageId: "missingScheduleTrigger",
                    node: node as unknown as Rule.Node,
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.codeScanning",
            ],
            description:
                "require CodeQL workflows to include a scheduled trigger for periodic re-analysis.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R101",
            ruleNumber: 101,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-codeql-schedule",
        },
        messages: {
            missingScheduleTrigger:
                "CodeQL workflows should include a `schedule` trigger for periodic re-analysis.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
