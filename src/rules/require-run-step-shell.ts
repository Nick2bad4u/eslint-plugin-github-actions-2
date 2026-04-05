/**
 * @packageDocumentation
 * Require `run` steps to declare an explicit shell directly or through defaults.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getMappingValueAsSequence,
    getScalarStringValue,
    getWorkflowJobs,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Runtime status for a discovered shell declaration. */
type ShellDeclarationState = "invalid" | "missing" | "valid";

/** Inspect a shell pair and determine whether it is usable. */
const getShellDeclarationState = (
    shellPair: null | Readonly<AST.YAMLPair>
): ShellDeclarationState => {
    if (shellPair === null) {
        return "missing";
    }

    const shellValue = getScalarStringValue(shellPair.value);

    return shellValue !== null && shellValue.trim().length > 0
        ? "valid"
        : "invalid";
};

/** Resolve `defaults.run.shell` from a mapping when present. */
const getRunDefaultsShellPair = (
    mapping: Readonly<AST.YAMLMapping>
): AST.YAMLPair | null => {
    const defaultsMapping = getMappingValueAsMapping(mapping, "defaults");

    if (defaultsMapping === null) {
        return null;
    }

    const runDefaultsMapping = getMappingValueAsMapping(defaultsMapping, "run");

    return runDefaultsMapping === null
        ? null
        : getMappingPair(runDefaultsMapping, "shell");
};

/** Rule implementation for requiring explicit shells on run steps. */
const rule: Rule.RuleModule = {
    create(context) {
        const reportInvalidShell = (
            shellPair: Readonly<AST.YAMLPair>,
            scope: string
        ): void => {
            context.report({
                data: {
                    scope,
                },
                messageId: "invalidShell",
                node: (shellPair.value ?? shellPair) as unknown as Rule.Node,
            });
        };

        return {
            Program() {
                if (!isWorkflowFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                const workflowShellPair = getRunDefaultsShellPair(root);
                const workflowShellState =
                    getShellDeclarationState(workflowShellPair);

                if (
                    workflowShellPair !== null &&
                    workflowShellState === "invalid"
                ) {
                    reportInvalidShell(
                        workflowShellPair,
                        "workflow `defaults.run.shell`"
                    );
                }

                for (const job of getWorkflowJobs(root)) {
                    const jobShellPair = getRunDefaultsShellPair(job.mapping);
                    const jobShellState =
                        getShellDeclarationState(jobShellPair);

                    if (jobShellPair !== null && jobShellState === "invalid") {
                        reportInvalidShell(
                            jobShellPair,
                            `job '${job.id}' defaults.run.shell`
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

                        const runPair = getMappingPair(stepMapping, "run");

                        if (runPair === null) {
                            continue;
                        }

                        const stepShellPair = getMappingPair(
                            stepMapping,
                            "shell"
                        );
                        const stepShellState =
                            getShellDeclarationState(stepShellPair);

                        if (stepShellPair !== null) {
                            if (stepShellState === "valid") {
                                continue;
                            }

                            reportInvalidShell(
                                stepShellPair,
                                `a run step in job '${job.id}'`
                            );

                            continue;
                        }

                        if (
                            jobShellState !== "missing" ||
                            workflowShellState !== "missing"
                        ) {
                            continue;
                        }

                        context.report({
                            data: {
                                jobId: job.id,
                            },
                            messageId: "missingShell",
                            node: (runPair.value ??
                                stepMapping) as unknown as Rule.Node,
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
                "github-actions.configs.strict",
            ],
            description:
                "require `run` steps to use an explicit shell directly or through `defaults.run.shell` so execution behavior stays predictable across runners.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R021",
            ruleNumber: 21,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-run-step-shell",
        },
        messages: {
            invalidShell:
                "{{scope}} must set `shell` to a non-empty string when declared.",
            missingShell:
                "A `run` step in job '{{jobId}}' should declare `shell` explicitly or inherit it from `defaults.run.shell`.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
