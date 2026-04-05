/**
 * @packageDocumentation
 * Disallow broad reusable-workflow secret inheritance.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getScalarStringValue,
    getWorkflowJobs,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Determine whether a job references a reusable workflow. */
const isReusableWorkflowJob = (
    jobMapping: Readonly<AST.YAMLMapping>
): boolean => getMappingPair(jobMapping, "uses") !== null;

/** Determine whether a secrets pair uses the broad `inherit` shortcut. */
const isInheritSecretsValue = (
    secretsPair: Readonly<NonNullable<ReturnType<typeof getMappingPair>>>
): boolean => getScalarStringValue(secretsPair.value)?.trim() === "inherit";

/** Rule implementation for disallowing reusable-workflow `secrets: inherit`. */
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

                for (const job of getWorkflowJobs(root)) {
                    if (!isReusableWorkflowJob(job.mapping)) {
                        continue;
                    }

                    const secretsPair = getMappingPair(job.mapping, "secrets");

                    if (
                        secretsPair === null ||
                        !isInheritSecretsValue(secretsPair)
                    ) {
                        continue;
                    }

                    context.report({
                        data: {
                            jobId: job.id,
                        },
                        messageId: "inheritedSecrets",
                        node: secretsPair.value as unknown as Rule.Node,
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
                "github-actions.configs.strict",
            ],
            description:
                "disallow `secrets: inherit` on reusable-workflow jobs so callers pass only the named secrets each workflow actually needs.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R026",
            ruleNumber: 26,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-inherit-secrets",
        },
        messages: {
            inheritedSecrets:
                "Job '{{jobId}}' uses `secrets: inherit`. Pass only the specific named secrets the called workflow requires.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
