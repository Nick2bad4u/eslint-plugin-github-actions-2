/**
 * @packageDocumentation
 * Require dependabot/fetch-metadata steps to provide github-token.
 */
import type { Rule } from "eslint";

import { getDependabotFetchMetadataSteps } from "../_internal/dependabot-automation-workflow.ts";
import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for fetch-metadata github-token requirements. */
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

                for (const step of getDependabotFetchMetadataSteps(root)) {
                    const withMapping = getMappingValueAsMapping(
                        step.stepMapping,
                        "with"
                    );
                    const tokenPair =
                        withMapping === null
                            ? null
                            : getMappingPair(withMapping, "github-token");
                    const tokenValue = getScalarStringValue(
                        tokenPair?.value ?? null
                    )?.trim();

                    if (tokenValue !== undefined && tokenValue.length > 0) {
                        continue;
                    }

                    context.report({
                        data: { jobId: step.job.id },
                        messageId: "missingGithubToken",
                        node: (tokenPair?.value ??
                            tokenPair ??
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
                "require `dependabot/fetch-metadata` steps to configure `with.github-token`.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R110",
            ruleNumber: 110,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-fetch-metadata-github-token",
        },
        messages: {
            missingGithubToken:
                "`dependabot/fetch-metadata` step in job '{{jobId}}' should configure `with.github-token`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
