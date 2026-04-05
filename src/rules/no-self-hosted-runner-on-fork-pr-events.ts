/**
 * @packageDocumentation
 * Disallow self-hosted runners on fork-capable pull request events.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getScalarStringValue,
    getWorkflowEventNames,
    getWorkflowJobs,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Pull-request-adjacent events that can be invoked from forked PR activity. */
const forkPullRequestEventNames = [
    "issue_comment",
    "pull_request",
    "pull_request_review",
    "pull_request_review_comment",
    "pull_request_target",
] as const;

/** Fast lookup set for fork-capable pull request events. */
const forkPullRequestEventNameSet: ReadonlySet<string> = new Set(
    forkPullRequestEventNames
);

/** Determine whether a scalar string denotes the self-hosted runner label. */
const isSelfHostedRunnerLabel = (value: string): boolean =>
    value.trim().toLowerCase() === "self-hosted";

/** Determine whether a runs-on node selects a self-hosted runner. */
const hasSelfHostedRunner = (
    node: null | Readonly<AST.YAMLContent | AST.YAMLWithMeta>
): boolean => {
    const unwrappedNode = unwrapYamlValue(
        node as AST.YAMLContent | AST.YAMLWithMeta | null
    );

    if (unwrappedNode === null) {
        return false;
    }

    if (unwrappedNode.type === "YAMLScalar") {
        const value = getScalarStringValue(unwrappedNode);

        return value !== null && isSelfHostedRunnerLabel(value);
    }

    if (unwrappedNode.type === "YAMLSequence") {
        return unwrappedNode.entries.some((entry) => {
            const value = getScalarStringValue(entry);

            return value !== null && isSelfHostedRunnerLabel(value);
        });
    }

    if (unwrappedNode.type !== "YAMLMapping") {
        return false;
    }

    return hasSelfHostedRunner(
        getMappingPair(unwrappedNode, "labels")?.value ?? null
    );
};

/** Rule implementation for blocking self-hosted runners on fork PR events. */
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

                const triggeringForkPullRequestEvents = [
                    ...getWorkflowEventNames(root),
                ]
                    .filter((eventName) =>
                        forkPullRequestEventNameSet.has(eventName)
                    )
                    .toSorted((left, right) => left.localeCompare(right));

                if (triggeringForkPullRequestEvents.length === 0) {
                    return;
                }

                for (const job of getWorkflowJobs(root)) {
                    const runsOnPair = getMappingPair(job.mapping, "runs-on");

                    if (
                        runsOnPair === null ||
                        !hasSelfHostedRunner(runsOnPair.value ?? null)
                    ) {
                        continue;
                    }

                    context.report({
                        data: {
                            events: triggeringForkPullRequestEvents.join(", "),
                            jobId: job.id,
                        },
                        messageId: "selfHostedRunnerOnForkPullRequestEvent",
                        node: (runsOnPair.value ??
                            runsOnPair) as unknown as Rule.Node,
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
                "disallow self-hosted runners in workflows triggered by fork-capable pull-request events that can execute untrusted contributor activity.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R036",
            ruleNumber: 36,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-self-hosted-runner-on-fork-pr-events",
        },
        messages: {
            selfHostedRunnerOnForkPullRequestEvent:
                "Job '{{jobId}}' uses a self-hosted runner in a workflow triggered by {{events}}, which can be invoked from forked or Dependabot pull requests. Prefer GitHub-hosted runners, or isolate the workload behind hardened ephemeral self-hosted infrastructure.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
