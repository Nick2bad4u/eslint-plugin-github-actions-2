/**
 * @packageDocumentation
 * Disallow invalid keys in GitHub Actions workflow mappings.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import {
    getMappingValueAsMapping,
    getMappingValueAsSequence,
    getScalarStringValue,
    getWorkflowJobs,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Valid top-level workflow keys. */
const VALID_TOP_LEVEL_KEYS = new Set<string>([
    "concurrency",
    "defaults",
    "env",
    "jobs",
    "name",
    "on",
    "permissions",
    "run-name",
]);

/** Valid job-level keys under `jobs.<job_id>`. */
const VALID_JOB_KEYS = new Set<string>([
    "concurrency",
    "container",
    "continue-on-error",
    "defaults",
    "env",
    "environment",
    "if",
    "name",
    "needs",
    "outputs",
    "permissions",
    "runs-on",
    "secrets",
    "services",
    "steps",
    "strategy",
    "timeout-minutes",
    "uses",
    "with",
]);

/** Valid strategy keys under `jobs.<job_id>.strategy`. */
const VALID_STRATEGY_KEYS = new Set<string>([
    "fail-fast",
    "matrix",
    "max-parallel",
]);

/** Valid container and service keys. */
const VALID_CONTAINER_OR_SERVICE_KEYS = new Set<string>([
    "credentials",
    "env",
    "image",
    "options",
    "ports",
    "volumes",
]);

/** Valid step keys under `jobs.<job_id>.steps[]`. */
const VALID_STEP_KEYS = new Set<string>([
    "continue-on-error",
    "env",
    "id",
    "if",
    "name",
    "run",
    "shell",
    "timeout-minutes",
    "uses",
    "with",
    "working-directory",
]);

/** Report invalid mapping keys for one workflow section. */
const reportInvalidKeys = (
    context: Readonly<Rule.RuleContext>,
    mapping: Readonly<AST.YAMLMapping>,
    validKeys: ReadonlySet<string>,
    messageId:
        | "invalidContainerKey"
        | "invalidJobKey"
        | "invalidServiceKey"
        | "invalidStepKey"
        | "invalidStrategyKey"
        | "invalidTopLevelKey"
): void => {
    for (const pair of mapping.pairs) {
        const keyValue = getScalarStringValue(pair.key);

        if (keyValue === null || validKeys.has(keyValue)) {
            continue;
        }

        context.report({
            data: {
                key: keyValue,
            },
            messageId,
            node: (pair.key ?? pair) as unknown as Rule.Node,
        });
    }
};

/** Rule implementation for validating workflow mapping keys. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                reportInvalidKeys(
                    context,
                    root,
                    VALID_TOP_LEVEL_KEYS,
                    "invalidTopLevelKey"
                );

                for (const job of getWorkflowJobs(root)) {
                    reportInvalidKeys(
                        context,
                        job.mapping,
                        VALID_JOB_KEYS,
                        "invalidJobKey"
                    );

                    const strategyMapping = getMappingValueAsMapping(
                        job.mapping,
                        "strategy"
                    );

                    if (strategyMapping !== null) {
                        reportInvalidKeys(
                            context,
                            strategyMapping,
                            VALID_STRATEGY_KEYS,
                            "invalidStrategyKey"
                        );
                    }

                    const containerMapping = getMappingValueAsMapping(
                        job.mapping,
                        "container"
                    );

                    if (containerMapping !== null) {
                        reportInvalidKeys(
                            context,
                            containerMapping,
                            VALID_CONTAINER_OR_SERVICE_KEYS,
                            "invalidContainerKey"
                        );
                    }

                    const servicesMapping = getMappingValueAsMapping(
                        job.mapping,
                        "services"
                    );

                    if (servicesMapping !== null) {
                        for (const servicePair of servicesMapping.pairs) {
                            const serviceMapping = unwrapYamlValue(
                                servicePair.value
                            );

                            if (serviceMapping?.type !== "YAMLMapping") {
                                continue;
                            }

                            reportInvalidKeys(
                                context,
                                serviceMapping,
                                VALID_CONTAINER_OR_SERVICE_KEYS,
                                "invalidServiceKey"
                            );
                        }
                    }

                    const stepsSequence = getMappingValueAsSequence(
                        job.mapping,
                        "steps"
                    );

                    if (stepsSequence === null) {
                        continue;
                    }

                    for (const step of stepsSequence.entries) {
                        const stepMapping = unwrapYamlValue(step);

                        if (stepMapping?.type !== "YAMLMapping") {
                            continue;
                        }

                        reportInvalidKeys(
                            context,
                            stepMapping,
                            VALID_STEP_KEYS,
                            "invalidStepKey"
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
                "github-actions.configs.strict",
            ],
            description:
                "disallow unsupported keys in common GitHub Actions workflow mappings.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R019",
            ruleNumber: 19,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-invalid-key",
        },
        messages: {
            invalidContainerKey:
                "`{{key}}` is not a valid key for a job `container` block.",
            invalidJobKey:
                "`{{key}}` is not a valid key for a workflow job definition.",
            invalidServiceKey:
                "`{{key}}` is not a valid key for a job `services` entry.",
            invalidStepKey: "`{{key}}` is not a valid key for a workflow step.",
            invalidStrategyKey:
                "`{{key}}` is not a valid key for a job `strategy` block.",
            invalidTopLevelKey:
                "`{{key}}` is not a valid top-level workflow key.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
