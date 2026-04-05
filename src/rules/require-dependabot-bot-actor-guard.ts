/**
 * @packageDocumentation
 * Require Dependabot automation jobs or steps to guard on the Dependabot bot actor.
 */
import type { Rule } from "eslint";

import {
    getDependabotAutomationRunSteps,
    getDependabotFetchMetadataSteps,
    hasDependabotAutomation,
} from "../_internal/dependabot-automation-workflow.ts";
import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getScalarStringValue,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

const hasDependabotBotGuard = (value: null | string | undefined): boolean =>
    typeof value === "string" && value.includes("dependabot[bot]");

/** Rule implementation for Dependabot bot guard requirements. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                if (!isWorkflowFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null || !hasDependabotAutomation(root)) {
                    return;
                }

                const runStepsByJobId = new Map(
                    getDependabotAutomationRunSteps(root).map((step) => [
                        step.job.id,
                        step,
                    ])
                );

                for (const step of getDependabotFetchMetadataSteps(root)) {
                    const jobIfValue = getScalarStringValue(
                        getMappingPair(step.job.mapping, "if")?.value ?? null
                    );

                    if (hasDependabotBotGuard(jobIfValue)) {
                        continue;
                    }

                    const pairedRunStep = runStepsByJobId.get(step.job.id);
                    const runStepIfValue = getScalarStringValue(
                        pairedRunStep
                            ? (getMappingPair(pairedRunStep.stepMapping, "if")
                                  ?.value ?? null)
                            : null
                    );

                    if (
                        pairedRunStep !== undefined &&
                        hasDependabotBotGuard(runStepIfValue)
                    ) {
                        continue;
                    }

                    context.report({
                        data: { jobId: step.job.id },
                        messageId: "missingDependabotBotGuard",
                        node: step.job.idNode as unknown as Rule.Node,
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
            ],
            description:
                "require Dependabot automation jobs to guard execution on `dependabot[bot]`.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R109",
            ruleNumber: 109,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-bot-actor-guard",
        },
        messages: {
            missingDependabotBotGuard:
                "Job '{{jobId}}' automates Dependabot pull requests and should guard execution on `dependabot[bot]`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
