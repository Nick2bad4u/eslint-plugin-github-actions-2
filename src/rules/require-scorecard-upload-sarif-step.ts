/**
 * @packageDocumentation
 * Require Scorecard workflows producing SARIF to upload it with upload-sarif.
 */
import type { Rule } from "eslint";

import {
    getSarifUploadSteps,
    getScorecardSteps,
} from "../_internal/code-scanning-workflow.ts";
import { getWorkflowRoot } from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring SARIF upload in Scorecard workflows. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program(node) {
                const root = getWorkflowRoot(context);

                if (root === null || getScorecardSteps(root).length === 0) {
                    return;
                }

                if (getSarifUploadSteps(root).length > 0) {
                    return;
                }

                context.report({
                    messageId: "missingSarifUpload",
                    node: node as unknown as Rule.Node,
                });
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.codeScanning",
            ],
            description:
                "require workflows using `ossf/scorecard-action` to upload SARIF results to GitHub code scanning.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R104",
            ruleNumber: 104,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-scorecard-upload-sarif-step",
        },
        messages: {
            missingSarifUpload:
                "Scorecard workflows producing SARIF should upload the result with `github/codeql-action/upload-sarif`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
