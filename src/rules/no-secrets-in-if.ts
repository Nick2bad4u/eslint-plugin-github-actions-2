/**
 * @packageDocumentation
 * Disallow direct secret references in `if` conditionals.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import {
    getMappingPair,
    getMappingValueAsSequence,
    getScalarStringValue,
    getWorkflowJobs,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Direct secret-access patterns that GitHub discourages in `if` conditionals. */
const directSecretsPatterns = [
    /\bsecrets\.\w+\b/u,
    /\bsecrets\[["'][^"'\]]+["']\]/u,
] as const;

/**
 * Determine whether an `if` expression directly references the `secrets`
 * context.
 */
const hasDirectSecretsReference = (expression: string): boolean =>
    directSecretsPatterns.some((pattern) => pattern.test(expression));

/** Report a direct-secrets conditional reference. */
const reportDirectSecretsConditional = (
    context: Readonly<Rule.RuleContext>,
    ifPair: Readonly<AST.YAMLPair>,
    scope: string
): void => {
    context.report({
        data: {
            scope,
        },
        messageId: "directSecretsInIf",
        node: ifPair.value as unknown as Rule.Node,
    });
};

/** Rule implementation for disallowing direct secret usage in `if` conditionals. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                for (const job of getWorkflowJobs(root)) {
                    const jobIfPair = getMappingPair(job.mapping, "if");
                    const jobIfExpression = getScalarStringValue(
                        jobIfPair?.value ?? null
                    );

                    if (
                        jobIfPair !== null &&
                        jobIfExpression !== null &&
                        hasDirectSecretsReference(jobIfExpression)
                    ) {
                        reportDirectSecretsConditional(
                            context,
                            jobIfPair,
                            `job '${job.id}'`
                        );
                    }

                    const stepsSequence = getMappingValueAsSequence(
                        job.mapping,
                        "steps"
                    );

                    if (stepsSequence === null) {
                        continue;
                    }

                    for (const entry of stepsSequence.entries) {
                        const stepMapping = unwrapYamlValue(entry);

                        if (stepMapping?.type !== "YAMLMapping") {
                            continue;
                        }

                        const stepIfPair = getMappingPair(stepMapping, "if");
                        const stepIfExpression = getScalarStringValue(
                            stepIfPair?.value ?? null
                        );

                        if (
                            stepIfPair === null ||
                            stepIfExpression === null ||
                            !hasDirectSecretsReference(stepIfExpression)
                        ) {
                            continue;
                        }

                        reportDirectSecretsConditional(
                            context,
                            stepIfPair,
                            `a step in job '${job.id}'`
                        );
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
                "github-actions.configs.security",
                "github-actions.configs.strict",
            ],
            description:
                "disallow direct `secrets.*` references in job and step `if` conditionals; move secret values into `env` first and condition on that instead.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R027",
            ruleNumber: 27,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-secrets-in-if",
        },
        messages: {
            directSecretsInIf:
                "Do not reference `secrets` directly in {{scope}} `if` conditionals. Assign the secret to `env` first, then check the environment variable.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
