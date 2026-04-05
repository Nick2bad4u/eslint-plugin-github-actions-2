/**
 * @packageDocumentation
 * Require TruffleHog workflows to scan only verified results by default.
 */
import type { Rule } from "eslint";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import { getTrufflehogActionSteps } from "../_internal/secret-scanning-workflow.ts";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

const verifiedResultsPattern = /--results(?:=|\s+)verified\b/u;

/** Rule implementation for TruffleHog verified-results mode requirements. */
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

                for (const step of getTrufflehogActionSteps(root)) {
                    const withMapping = getMappingValueAsMapping(
                        step.stepMapping,
                        "with"
                    );
                    const extraArgsPair =
                        withMapping === null
                            ? null
                            : getMappingPair(withMapping, "extra_args");
                    const extraArgsValue = getScalarStringValue(
                        extraArgsPair?.value ?? null
                    )?.trim();

                    if (
                        extraArgsValue !== undefined &&
                        verifiedResultsPattern.test(extraArgsValue)
                    ) {
                        continue;
                    }

                    context.report({
                        data: { jobId: step.job.id },
                        messageId: "missingVerifiedResultsMode",
                        node: (extraArgsPair?.value ??
                            extraArgsPair ??
                            withMapping ??
                            step.usesPair) as unknown as Rule.Node,
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
                "github-actions.configs.security",
            ],
            description:
                "require TruffleHog workflows to enable verified-results mode explicitly.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R108",
            ruleNumber: 108,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-trufflehog-verified-results-mode",
        },
        messages: {
            missingVerifiedResultsMode:
                "TruffleHog step in job '{{jobId}}' should set `extra_args` to include `--results=verified`.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
