/**
 * @packageDocumentation
 * Require CodeQL workflows to run on pull_request.
 */
import type { Rule } from "eslint";

import { isEmpty, setHas } from "ts-extras";

import { getCodeqlInitSteps } from "../_internal/code-scanning-workflow.ts";
import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getWorkflowEventNames,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring pull_request triggers on CodeQL workflows. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program(node) {
                if (!isWorkflowFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null || isEmpty(getCodeqlInitSteps(root))) {
                    return;
                }

                if (setHas(getWorkflowEventNames(root), "pull_request")) {
                    return;
                }

                context.report({
                    messageId: "missingPullRequestTrigger",
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
                "require CodeQL workflows to listen for `pull_request`.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R100",
            ruleNumber: 100,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-codeql-pull-request-trigger",
        },
        messages: {
            missingPullRequestTrigger:
                "CodeQL workflows should listen for `pull_request` so code scanning runs on incoming pull requests.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
