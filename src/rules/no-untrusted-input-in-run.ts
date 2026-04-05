/**
 * @packageDocumentation
 * Disallow directly interpolating untrusted event inputs inside `run` steps.
 */
import type { Rule } from "eslint";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getMappingValueAsSequence,
    getScalarStringValue,
    getWorkflowJobs,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/**
 * Untrusted workflow-expression sources that should not be embedded directly in
 * `run`.
 */
const untrustedRunExpressionSources = [
    {
        fragments: [
            "github.event.pull_request.body",
            "github.event.pull_request.title",
        ],
        source: "pull request title/body",
    },
    {
        fragments: ["github.event.issue.body", "github.event.issue.title"],
        source: "issue title/body",
    },
    {
        fragments: ["github.event.comment.body"],
        source: "comment body",
    },
    {
        fragments: ["github.event.review.body"],
        source: "review body",
    },
    {
        fragments: [
            "github.event.discussion.body",
            "github.event.discussion.title",
        ],
        source: "discussion title/body",
    },
    {
        fragments: ["github.event.discussion_comment.body"],
        source: "discussion comment body",
    },
    {
        fragments: ["github.event.client_payload."],
        source: "repository_dispatch client payload",
    },
] as const;

/** Resolve the first matching untrusted expression source inside a run script. */
const getUnsafeRunSource = (runScript: string): null | string => {
    for (const source of untrustedRunExpressionSources) {
        if (source.fragments.some((fragment) => runScript.includes(fragment))) {
            return source.source;
        }
    }

    return null;
};

/** Rule implementation for disallowing unsafe direct interpolation in `run`. */
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
                        const runScript = getScalarStringValue(
                            runPair?.value ?? null
                        );

                        if (runPair === null || runScript === null) {
                            continue;
                        }

                        const unsafeSource = getUnsafeRunSource(runScript);

                        if (unsafeSource === null) {
                            continue;
                        }

                        context.report({
                            data: {
                                jobId: job.id,
                                source: unsafeSource,
                            },
                            messageId: "unsafeRunInterpolation",
                            node: (runPair.value ??
                                runPair) as unknown as Rule.Node,
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
                "github-actions.configs.security",
                "github-actions.configs.strict",
            ],
            description:
                "disallow directly embedding untrusted event payload values inside `run` scripts; move them through `env` first or pass them to an action input.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R029",
            ruleNumber: 29,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-untrusted-input-in-run",
        },
        messages: {
            unsafeRunInterpolation:
                "Job '{{jobId}}' interpolates untrusted {{source}} directly inside `run`. Assign the value to `env` first or pass it to an action input.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
