/**
 * @packageDocumentation
 * Disallow references to undefined or not-yet-available steps.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getMappingValueAsSequence,
    getScalarStringValue,
    getWorkflowJobs,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Step context references using property dereference syntax. */
const stepReferencePattern =
    /steps\.(?<stepId>[A-Z_a-z][\w-]*)\.(?:outputs\.[A-Z_a-z][\w-]*|conclusion|outcome)/g;

/**
 * Visit every string scalar in a job, tracking the current step index when
 * applicable.
 */
const visitJobStringScalars = (
    node: null | Readonly<AST.YAMLContent | AST.YAMLWithMeta>,
    visitor: (
        node: Readonly<AST.YAMLScalar>,
        value: string,
        currentStepIndex: null | number
    ) => void,
    currentStepIndex: null | number = null
): void => {
    const unwrappedNode = unwrapYamlValue(
        node as AST.YAMLContent | AST.YAMLWithMeta | null
    );

    if (unwrappedNode === null) {
        return;
    }

    if (unwrappedNode.type === "YAMLScalar") {
        const value = getScalarStringValue(unwrappedNode);

        if (value !== null) {
            visitor(unwrappedNode, value, currentStepIndex);
        }

        return;
    }

    if (unwrappedNode.type === "YAMLSequence") {
        for (const entry of unwrappedNode.entries) {
            visitJobStringScalars(entry, visitor, currentStepIndex);
        }

        return;
    }

    if (unwrappedNode.type !== "YAMLMapping") {
        return;
    }

    const stepsSequence = getMappingValueAsSequence(unwrappedNode, "steps");

    if (stepsSequence !== null) {
        for (const [stepIndex, entry] of stepsSequence.entries.entries()) {
            visitJobStringScalars(entry, visitor, stepIndex);
        }
    }

    for (const pair of unwrappedNode.pairs) {
        if (getScalarStringValue(pair.key) === "steps") {
            continue;
        }

        visitJobStringScalars(pair.value ?? null, visitor, currentStepIndex);
    }
};

/** Collect the first declared index for each step id in a job. */
const getStepIndexById = (
    jobMapping: Readonly<AST.YAMLMapping>
): ReadonlyMap<string, number> => {
    const stepsSequence = getMappingValueAsSequence(jobMapping, "steps");
    const stepIndexById = new Map<string, number>();

    if (stepsSequence === null) {
        return stepIndexById;
    }

    for (const [stepIndex, entry] of stepsSequence.entries.entries()) {
        const stepMapping = unwrapYamlValue(entry);

        if (stepMapping?.type !== "YAMLMapping") {
            continue;
        }

        const stepId = getScalarStringValue(
            getMappingPair(stepMapping, "id")?.value ?? null
        );

        if (stepId !== null && !stepIndexById.has(stepId)) {
            stepIndexById.set(stepId, stepIndex);
        }
    }

    return stepIndexById;
};

/** Rule implementation for validating step context references. */
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
                    const stepIndexById = getStepIndexById(job.mapping);

                    visitJobStringScalars(
                        job.mapping,
                        (node, value, currentStepIndex) => {
                            for (const match of value.matchAll(
                                stepReferencePattern
                            )) {
                                const reference = match[0];
                                const stepId = match.groups?.["stepId"];

                                if (stepId === undefined) {
                                    continue;
                                }

                                const referencedStepIndex =
                                    stepIndexById.get(stepId);

                                if (referencedStepIndex === undefined) {
                                    context.report({
                                        data: {
                                            jobId: job.id,
                                            reference,
                                            stepId,
                                        },
                                        messageId: "unknownStepReference",
                                        node: node as unknown as Rule.Node,
                                    });

                                    continue;
                                }

                                if (
                                    currentStepIndex === null ||
                                    referencedStepIndex < currentStepIndex
                                ) {
                                    continue;
                                }

                                context.report({
                                    data: {
                                        jobId: job.id,
                                        reference,
                                        stepId,
                                    },
                                    messageId:
                                        "stepReferenceBeforeAvailability",
                                    node: node as unknown as Rule.Node,
                                });
                            }
                        }
                    );
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
                "disallow `steps.<id>.*` references that target a missing step id or a step that has not run yet.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R038",
            ruleNumber: 38,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-unknown-step-reference",
        },
        messages: {
            stepReferenceBeforeAvailability:
                "Job '{{jobId}}' references `{{reference}}` before step '{{stepId}}' has run. The `steps` context only contains prior steps in the same job.",
            unknownStepReference:
                "Job '{{jobId}}' references `{{reference}}`, but no step with `id: {{stepId}}` exists in that job.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
