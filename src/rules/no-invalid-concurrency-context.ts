/**
 * @packageDocumentation
 * Disallow unavailable contexts inside workflow and job concurrency expressions.
 */
import type { Rule } from "eslint";

import {
    getGithubExpressionBodies,
    getReferencedContextRoots,
} from "../_internal/github-expressions.js";
import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getScalarStringValue,
    getWorkflowJobs,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Allowed contexts for top-level workflow `concurrency`. */
const allowedWorkflowConcurrencyContexts: ReadonlySet<string> = new Set([
    "github",
    "inputs",
    "vars",
]);

/** Allowed contexts for `jobs.<job_id>.concurrency`. */
const allowedJobConcurrencyContexts: ReadonlySet<string> = new Set([
    "github",
    "inputs",
    "matrix",
    "needs",
    "strategy",
    "vars",
]);

/** Determine whether a scalar contains any GitHub expressions. */
const containsGithubExpression = (value: string): boolean =>
    getGithubExpressionBodies(value).length > 0;

/** Collect disallowed context roots for the provided scalar value. */
const getDisallowedContexts = (
    value: string,
    allowedContexts: ReadonlySet<string>
): readonly string[] =>
    getReferencedContextRoots(value).filter(
        (contextRoot) => !allowedContexts.has(contextRoot)
    );

/** Check a single concurrency scalar for unsupported context usage. */
const reportInvalidContexts = (
    context: Readonly<Rule.RuleContext>,
    options: Readonly<{
        readonly allowedContexts: ReadonlySet<string>;
        readonly field: string;
        readonly jobId: string | undefined;
        readonly messageId:
            | "invalidJobConcurrencyContext"
            | "invalidWorkflowConcurrencyContext";
        readonly node: unknown;
        readonly value: string;
    }>
): void => {
    if (!containsGithubExpression(options.value)) {
        return;
    }

    const disallowedContexts = getDisallowedContexts(
        options.value,
        options.allowedContexts
    );

    if (disallowedContexts.length === 0) {
        return;
    }

    context.report({
        data: {
            contexts: disallowedContexts.join(", "),
            field: options.field,
            jobId: options.jobId,
        },
        messageId: options.messageId,
        node: options.node as Rule.Node,
    });
};

/** Inspect a workflow-level or job-level concurrency declaration. */
const inspectConcurrencyValue = (
    context: Readonly<Rule.RuleContext>,
    options: Readonly<{
        readonly allowedContexts: ReadonlySet<string>;
        readonly concurrencyNode: Parameters<typeof unwrapYamlValue>[0];
        readonly jobId: string | undefined;
        readonly messageId:
            | "invalidJobConcurrencyContext"
            | "invalidWorkflowConcurrencyContext";
    }>
): void => {
    const concurrencyValue = unwrapYamlValue(options.concurrencyNode);

    if (concurrencyValue === null) {
        return;
    }

    if (concurrencyValue.type === "YAMLScalar") {
        const scalarValue = getScalarStringValue(concurrencyValue);

        if (scalarValue === null || scalarValue.trim().length === 0) {
            return;
        }

        reportInvalidContexts(context, {
            allowedContexts: options.allowedContexts,
            field: "concurrency",
            jobId: options.jobId,
            messageId: options.messageId,
            node: concurrencyValue,
            value: scalarValue,
        });

        return;
    }

    if (concurrencyValue.type !== "YAMLMapping") {
        return;
    }

    for (const fieldName of ["group", "cancel-in-progress"] as const) {
        const fieldPair = getMappingPair(concurrencyValue, fieldName);

        if (fieldPair === null) {
            continue;
        }

        const fieldValueNode = unwrapYamlValue(fieldPair.value);
        const fieldValue = getScalarStringValue(fieldValueNode);

        if (fieldValue === null || fieldValue.trim().length === 0) {
            continue;
        }

        reportInvalidContexts(context, {
            allowedContexts: options.allowedContexts,
            field: `concurrency.${fieldName}`,
            jobId: options.jobId,
            messageId: options.messageId,
            node: fieldValueNode ?? fieldPair,
            value: fieldValue,
        });
    }
};

/** Rule implementation for validating concurrency context usage. */
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

                const workflowConcurrencyPair = getMappingPair(
                    root,
                    "concurrency"
                );

                if (workflowConcurrencyPair !== null) {
                    inspectConcurrencyValue(context, {
                        allowedContexts: allowedWorkflowConcurrencyContexts,
                        concurrencyNode: workflowConcurrencyPair.value,
                        jobId: undefined,
                        messageId: "invalidWorkflowConcurrencyContext",
                    });
                }

                for (const job of getWorkflowJobs(root)) {
                    const jobConcurrencyPair = getMappingPair(
                        job.mapping,
                        "concurrency"
                    );

                    if (jobConcurrencyPair === null) {
                        continue;
                    }

                    inspectConcurrencyValue(context, {
                        allowedContexts: allowedJobConcurrencyContexts,
                        concurrencyNode: jobConcurrencyPair.value,
                        jobId: job.id,
                        messageId: "invalidJobConcurrencyContext",
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
                "github-actions.configs.recommended",
                "github-actions.configs.strict",
            ],
            description:
                "disallow unavailable contexts in workflow-level and job-level `concurrency` expressions.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R042",
            ruleNumber: 42,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-invalid-concurrency-context",
        },
        messages: {
            invalidJobConcurrencyContext:
                "Job '{{jobId}}' `{{field}}` references unsupported context access ({{contexts}}). Job-level concurrency may only reference `github`, `needs`, `strategy`, `matrix`, `inputs`, and `vars`.",
            invalidWorkflowConcurrencyContext:
                "Workflow `{{field}}` references unsupported context access ({{contexts}}). Top-level concurrency may only reference `github`, `inputs`, and `vars`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
