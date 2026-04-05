/**
 * @packageDocumentation
 * Enforce a consistent naming convention for workflow job identifiers.
 */
import type { Rule } from "eslint";

import {
    type GithubActionsNonTitleCasingKind,
    githubActionsNonTitleCasingKinds,
    matchesGithubActionsCasing,
} from "../_internal/casing.js";
import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getWorkflowJobs,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Object-style configuration for `job-id-casing`. */
type JobIdCasingObjectOption = Partial<
    Record<GithubActionsNonTitleCasingKind, boolean>
> & {
    readonly ignores?: readonly string[];
};

/** Rule options for `job-id-casing`. */
type JobIdCasingOptions = [
    (GithubActionsNonTitleCasingKind | JobIdCasingObjectOption)?,
];

/** Default casing enforced for workflow job ids. */
const DEFAULT_JOB_ID_CASING: GithubActionsNonTitleCasingKind = "kebab-case";

/** Normalize job-id-casing options into allowed casings and ignore patterns. */
const normalizeJobIdCasingOptions = (
    option: Readonly<
        GithubActionsNonTitleCasingKind | JobIdCasingObjectOption | undefined
    >
): {
    allowedCasings: readonly GithubActionsNonTitleCasingKind[];
    ignoredJobIds: readonly string[];
} => {
    if (option === undefined || typeof option === "string") {
        return {
            allowedCasings: [option ?? DEFAULT_JOB_ID_CASING],
            ignoredJobIds: [],
        };
    }

    const allowedCasings = githubActionsNonTitleCasingKinds.filter(
        (casingKind) => option[casingKind] === true
    );

    return {
        allowedCasings:
            allowedCasings.length > 0
                ? allowedCasings
                : [DEFAULT_JOB_ID_CASING],
        ignoredJobIds: [...(option.ignores ?? [])],
    };
};

/** Rule implementation for enforcing job-id casing. */
const rule: Rule.RuleModule = {
    create(context) {
        const [option] = context.options as JobIdCasingOptions;
        const { allowedCasings, ignoredJobIds } = normalizeJobIdCasingOptions(
            option ?? undefined
        );

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
                    if (ignoredJobIds.includes(job.id)) {
                        continue;
                    }

                    const matchesAllowedCasing = allowedCasings.some(
                        (casingKind) =>
                            matchesGithubActionsCasing(job.id, casingKind)
                    );

                    if (!matchesAllowedCasing) {
                        context.report({
                            data: {
                                caseTypes: allowedCasings.join(", "),
                                jobId: job.id,
                            },
                            messageId: "jobIdDoesNotMatchCasing",
                            node: job.idNode as unknown as Rule.Node,
                        });
                    }
                }
            },
        };
    },
    meta: {
        defaultOptions: [DEFAULT_JOB_ID_CASING],
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.strict",
            ],
            description:
                "enforce a consistent casing convention for workflow job identifiers.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R010",
            ruleNumber: 10,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/job-id-casing",
        },
        messages: {
            jobIdDoesNotMatchCasing:
                "Job id '{{jobId}}' is not in the configured casing: {{caseTypes}}.",
        },
        schema: [
            {
                anyOf: [
                    {
                        description:
                            "Single allowed casing convention for workflow job ids.",
                        enum: githubActionsNonTitleCasingKinds,
                        type: "string",
                    },
                    {
                        additionalProperties: false,
                        description:
                            "Allowed casing conventions and ignore patterns for workflow job ids.",
                        properties: {
                            camelCase: {
                                description: "Allow camelCase job ids.",
                                type: "boolean",
                            },
                            ignores: {
                                description:
                                    "Literal job ids that should be ignored by this rule.",
                                items: {
                                    type: "string",
                                },
                                type: "array",
                                uniqueItems: true,
                            },
                            "kebab-case": {
                                description: "Allow kebab-case job ids.",
                                type: "boolean",
                            },
                            PascalCase: {
                                description: "Allow PascalCase job ids.",
                                type: "boolean",
                            },
                            SCREAMING_SNAKE_CASE: {
                                description:
                                    "Allow SCREAMING_SNAKE_CASE job ids.",
                                type: "boolean",
                            },
                            snake_case: {
                                description: "Allow snake_case job ids.",
                                type: "boolean",
                            },
                            "Train-Case": {
                                description: "Allow Train-Case job ids.",
                                type: "boolean",
                            },
                        },
                        type: "object",
                    },
                ],
                description:
                    "Configure one or more allowed casing conventions for workflow job ids.",
            },
        ],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
