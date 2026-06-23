/**
 * @packageDocumentation
 * Require CodeQL workflows to run on a schedule.
 */
import type { Rule } from "eslint";

import { isEmpty, setHas } from "ts-extras";

import { getCodeqlInitSteps } from "../_internal/code-scanning-workflow.js";
import { isWorkflowFile } from "../_internal/lint-targets.js";
import { reportYamlNode } from "../_internal/report.js";
import {
    getWorkflowEventNames,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring scheduled CodeQL runs. */
const rule: Rule.RuleModule = {
    create: (context) => ({
        Program(node) {
            if (!isWorkflowFile(context.filename)) {
                return;
            }

            const root = getWorkflowRoot(context);

            if (root === null || isEmpty(getCodeqlInitSteps(root))) {
                return;
            }

            if (setHas(getWorkflowEventNames(root), "schedule")) {
                return;
            }

            reportYamlNode(context, {
                messageId: "missingScheduleTrigger",
                node: node,
            });
        },
    }),
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
