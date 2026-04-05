/**
 * @packageDocumentation
 * Require secret scanning workflows to run on a schedule.
 */
import type { Rule } from "eslint";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import { hasSecretScanningAction } from "../_internal/secret-scanning-workflow.ts";
import {
    getWorkflowEventNames,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring scheduled secret scanning runs. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program(node) {
                if (!isWorkflowFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null || !hasSecretScanningAction(root)) {
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
                "github-actions.configs.security",
            ],
            description:
                "require secret scanning workflows to include a scheduled trigger.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R106",
            ruleNumber: 106,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-secret-scan-schedule",
        },
        messages: {
            missingScheduleTrigger:
                "Secret scanning workflows should include a `schedule` trigger for periodic scanning.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
