/**
 * @packageDocumentation
 * Require bounded job timeouts for GitHub Actions jobs.
 */
import type { Rule } from "eslint";
import type { UnknownArray } from "type-fest";

import { arrayFirst, isDefined, isInteger, safeCastTo } from "ts-extras";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import { reportYamlNode } from "../_internal/report.js";
import {
    getMappingPair,
    getScalarNumberValue,
    getWorkflowJobs,
    getWorkflowRoot,
    isGithubExpressionScalar,
    isReusableWorkflowJob,
} from "../_internal/workflow-yaml.js";

interface RequireJobTimeoutMinutesOption {
    readonly maxMinutes?: number;
}

/** Determine whether an unknown value is a valid rule option object. */
const isRequireJobTimeoutMinutesOption = (
    value: unknown
): value is RequireJobTimeoutMinutesOption => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const maxMinutes: unknown = Reflect.get(value, "maxMinutes");

    return !isDefined(maxMinutes) || typeof maxMinutes === "number";
};

/** Default upper bound used when validating workflow job timeouts. */
const DEFAULT_MAX_MINUTES = 60;

/** Rule implementation for requiring bounded timeout-minutes on workflow jobs. */
const rule: Rule.RuleModule = {
    create(context) {
        const rawOption = arrayFirst(
            safeCastTo<Readonly<UnknownArray>>(context.options)
        );
        const options = isRequireJobTimeoutMinutesOption(rawOption)
            ? rawOption
            : undefined;
        const maxMinutes = options?.maxMinutes ?? DEFAULT_MAX_MINUTES;

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
                    if (isReusableWorkflowJob(job.mapping)) {
                        continue;
                    }

                    const timeoutPair = getMappingPair(
                        job.mapping,
                        "timeout-minutes"
                    );

                    if (timeoutPair === null) {
                        reportYamlNode(context, {
                            data: {
                                jobId: job.id,
                            },
                            messageId: "missingTimeout",
                            node: job.idNode,
                        });

                        continue;
                    }

                    if (isGithubExpressionScalar(timeoutPair.value)) {
                        continue;
                    }

                    const timeoutMinutes = getScalarNumberValue(
                        timeoutPair.value
                    );

                    if (
                        timeoutMinutes === null ||
                        !isInteger(timeoutMinutes) ||
                        timeoutMinutes <= 0
                    ) {
                        reportYamlNode(context, {
                            data: {
                                jobId: job.id,
                            },
                            messageId: "invalidTimeout",
                            node: timeoutPair.value ?? timeoutPair,
                        });

                        continue;
                    }

                    if (timeoutMinutes > maxMinutes) {
                        reportYamlNode(context, {
                            data: {
                                actualMinutes: String(timeoutMinutes),
                                jobId: job.id,
                                maxMinutes: String(maxMinutes),
                            },
                            messageId: "timeoutTooLarge",
                            node: timeoutPair.value ?? timeoutPair,
                        });
                    }
                }
            },
        };
    },
    meta: {
        defaultOptions: [{}],
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.recommended",
                "github-actions.configs.strict",
            ],
            description:
                "require every non-reusable workflow job to define a bounded `timeout-minutes` value.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R002",
            ruleNumber: 2,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-job-timeout-minutes",
        },
        messages: {
            invalidTimeout:
                "Job '{{jobId}}' has an invalid `timeout-minutes` value. Use a positive integer or a GitHub expression.",
            missingTimeout:
                "Job '{{jobId}}' is missing `timeout-minutes`. Add an explicit timeout to prevent hung runners from waiting indefinitely.",
            timeoutTooLarge:
                "Job '{{jobId}}' sets `timeout-minutes` to {{actualMinutes}}, which exceeds the configured maximum of {{maxMinutes}}.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Optional configuration for the maximum allowed job timeout in minutes.",
                properties: {
                    maxMinutes: {
                        description:
                            "Maximum allowed timeout-minutes value for a non-reusable workflow job.",
                        minimum: 1,
                        type: "integer",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
