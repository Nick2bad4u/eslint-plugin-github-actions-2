/**
 * @packageDocumentation
 * Disallow invalid reusable workflow output values.
 */
import type { Rule } from "eslint";

import {
    getGithubExpressionBodies,
    getReferencedContextRoots,
} from "../_internal/github-expressions.js";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Match reusable workflow output mappings to job outputs. */
const jobsOutputReferencePattern =
    /jobs\.[A-Z_a-z][\w-]*\.outputs\.[A-Z_a-z][\w-]*/;

/** Allowed expression contexts for `on.workflow_call.outputs.*.value`. */
const allowedWorkflowCallOutputContexts: ReadonlySet<string> = new Set([
    "github",
    "inputs",
    "jobs",
    "vars",
]);

/** Determine whether a scalar value reads at least one declared job output. */
const hasJobsOutputReference = (value: string): boolean =>
    getGithubExpressionBodies(value).some((expression) =>
        jobsOutputReferencePattern.test(expression)
    );

/** Rule implementation for validating reusable workflow output values. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                const onMapping = getMappingValueAsMapping(root, "on");

                if (onMapping === null) {
                    return;
                }

                const workflowCallMapping = unwrapYamlValue(
                    getMappingPair(onMapping, "workflow_call")?.value ?? null
                );

                if (workflowCallMapping?.type !== "YAMLMapping") {
                    return;
                }

                const outputsMapping = getMappingValueAsMapping(
                    workflowCallMapping,
                    "outputs"
                );

                if (outputsMapping === null) {
                    return;
                }

                for (const pair of outputsMapping.pairs) {
                    const outputId = getScalarStringValue(pair.key);
                    const outputMapping = unwrapYamlValue(pair.value);

                    if (
                        outputId === null ||
                        outputMapping?.type !== "YAMLMapping"
                    ) {
                        continue;
                    }

                    const valuePair = getMappingPair(outputMapping, "value");
                    const value = getScalarStringValue(
                        valuePair?.value ?? null
                    );

                    if (
                        valuePair === null ||
                        value === null ||
                        value.trim().length === 0
                    ) {
                        continue;
                    }

                    const disallowedContexts = getReferencedContextRoots(
                        value
                    ).filter(
                        (contextRoot) =>
                            !allowedWorkflowCallOutputContexts.has(contextRoot)
                    );

                    if (disallowedContexts.length > 0) {
                        context.report({
                            data: {
                                contexts: disallowedContexts.join(", "),
                                outputId,
                            },
                            messageId: "invalidContext",
                            node: (valuePair.value ??
                                valuePair) as unknown as Rule.Node,
                        });

                        continue;
                    }

                    if (!hasJobsOutputReference(value)) {
                        context.report({
                            data: {
                                outputId,
                            },
                            messageId: "missingJobOutputReference",
                            node: (valuePair.value ??
                                valuePair) as unknown as Rule.Node,
                        });
                    }
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.recommended",
                "github-actions.configs.strict",
            ],
            description:
                "disallow `workflow_call` output values that use unavailable contexts or fail to map from `jobs.<job_id>.outputs.<output_name>`.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R040",
            ruleNumber: 40,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-invalid-workflow-call-output-value",
        },
        messages: {
            invalidContext:
                "`workflow_call` output '{{outputId}}' uses unsupported context access in `value` ({{contexts}}). Reusable workflow output values may only reference `github`, `jobs`, `vars`, and `inputs`.",
            missingJobOutputReference:
                "`workflow_call` output '{{outputId}}' must map `value` from a job output such as `jobs.build.outputs.artifact`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
