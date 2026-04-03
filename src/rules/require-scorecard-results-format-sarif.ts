/**
 * @packageDocumentation
 * Require Scorecard workflows to emit SARIF results.
 */
import type { Rule } from "eslint";

import { getScorecardSteps } from "../_internal/code-scanning-workflow.ts";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring Scorecard SARIF output. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                for (const step of getScorecardSteps(root)) {
                    const withMapping = getMappingValueAsMapping(
                        step.stepMapping,
                        "with"
                    );
                    const formatPair =
                        withMapping === null
                            ? null
                            : getMappingPair(withMapping, "results_format");
                    const formatValue = getScalarStringValue(
                        formatPair?.value ?? null
                    )?.trim();

                    if (formatValue === "sarif") {
                        continue;
                    }

                    context.report({
                        data: { jobId: step.job.id },
                        messageId: "missingSarifResultsFormat",
                        node: (formatPair?.value ??
                            formatPair ??
                            withMapping ??
                            step.usesPair) as unknown as Rule.Node,
                    });
                }
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
                "require `ossf/scorecard-action` steps to set `results_format: sarif`.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R103",
            ruleNumber: 103,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-scorecard-results-format-sarif",
        },
        messages: {
            missingSarifResultsFormat:
                "Scorecard step in job '{{jobId}}' should set `results_format: sarif`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
