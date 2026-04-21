/**
 * @packageDocumentation
 * Require actions/dependency-review-action steps to configure fail-on-severity.
 */
import type { Rule } from "eslint";

import { isDefined } from "ts-extras";

import { getDependencyReviewActionSteps } from "../_internal/dependency-review-workflow.ts";
import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for dependency-review fail-on-severity requirements. */
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

                for (const step of getDependencyReviewActionSteps(root)) {
                    const withMapping = getMappingValueAsMapping(
                        step.stepMapping,
                        "with"
                    );
                    const failOnSeverityPair =
                        withMapping === null
                            ? null
                            : getMappingPair(withMapping, "fail-on-severity");
                    const failOnSeverityValue = getScalarStringValue(
                        failOnSeverityPair?.value ?? null
                    )?.trim();

                    if (
                        isDefined(failOnSeverityValue) &&
                        failOnSeverityValue !== null &&
                        failOnSeverityValue.length > 0
                    ) {
                        continue;
                    }

                    context.report({
                        data: {
                            jobId: step.job.id,
                        },
                        messageId: "missingFailOnSeverity",
                        node: (failOnSeverityPair?.value ??
                            failOnSeverityPair ??
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
                "github-actions.configs.codeScanning",
                "github-actions.configs.security",
            ],
            description:
                "require `actions/dependency-review-action` steps to set `with.fail-on-severity`.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R093",
            ruleNumber: 93,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependency-review-fail-on-severity",
        },
        messages: {
            missingFailOnSeverity:
                "Dependency review action steps in job '{{jobId}}' should set `with.fail-on-severity` so vulnerability blocking policy is explicit.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
