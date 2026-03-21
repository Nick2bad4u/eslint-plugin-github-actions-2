/**
 * @packageDocumentation
 * Disallow references to undeclared job outputs.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import {
    getMappingPair,
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowJobs,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/**
 * `needs.<job_id>.outputs.<output_name>` references inside workflow
 * expressions.
 */
const needsOutputReferencePattern =
    /needs\.(?<neededJobId>[A-Z_a-z][\w-]*)\.outputs\.(?<outputName>[A-Z_a-z][\w-]*)/g;

/**
 * `jobs.<job_id>.outputs.<output_name>` references inside reusable workflow
 * outputs.
 */
const jobsOutputReferencePattern =
    /jobs\.(?<jobId>[A-Z_a-z][\w-]*)\.outputs\.(?<outputName>[A-Z_a-z][\w-]*)/g;

/** Visit every string scalar reachable from a YAML value node. */
const visitStringScalars = (
    node: null | Readonly<AST.YAMLContent | AST.YAMLWithMeta>,
    visitor: (node: Readonly<AST.YAMLScalar>, value: string) => void
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
            visitor(unwrappedNode, value);
        }

        return;
    }

    if (unwrappedNode.type === "YAMLSequence") {
        for (const entry of unwrappedNode.entries) {
            visitStringScalars(entry, visitor);
        }

        return;
    }

    if (unwrappedNode.type !== "YAMLMapping") {
        return;
    }

    for (const pair of unwrappedNode.pairs) {
        visitStringScalars(pair.value ?? null, visitor);
    }
};

/** Collect declared output names from a job definition. */
const getDeclaredJobOutputNames = (
    jobMapping: Readonly<AST.YAMLMapping>
): ReadonlySet<string> => {
    const outputsMapping = getMappingValueAsMapping(jobMapping, "outputs");
    const outputNames = new Set<string>();

    if (outputsMapping === null) {
        return outputNames;
    }

    for (const pair of outputsMapping.pairs) {
        const outputName = getScalarStringValue(pair.key);

        if (outputName !== null) {
            outputNames.add(outputName);
        }
    }

    return outputNames;
};

/** Collect the direct `needs` dependencies configured for a job. */
const getDirectNeedsJobIds = (
    jobMapping: Readonly<AST.YAMLMapping>
): ReadonlySet<string> => {
    const needsPair = getMappingPair(jobMapping, "needs");
    const needsValue = unwrapYamlValue(needsPair?.value ?? null);
    const directNeeds = new Set<string>();

    if (needsValue === null) {
        return directNeeds;
    }

    if (needsValue.type === "YAMLScalar") {
        const jobId = getScalarStringValue(needsValue);

        if (jobId !== null) {
            directNeeds.add(jobId);
        }

        return directNeeds;
    }

    if (needsValue.type !== "YAMLSequence") {
        return directNeeds;
    }

    for (const entry of needsValue.entries) {
        const jobId = getScalarStringValue(entry);

        if (jobId !== null) {
            directNeeds.add(jobId);
        }
    }

    return directNeeds;
};

/** Rule implementation for validating job output references. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                const jobs = getWorkflowJobs(root);
                const declaredOutputsByJobId = new Map(
                    jobs.map((job) => [
                        job.id,
                        getDeclaredJobOutputNames(job.mapping),
                    ])
                );

                const onMapping = getMappingValueAsMapping(root, "on");
                const workflowCallMapping =
                    onMapping === null
                        ? null
                        : getMappingValueAsMapping(onMapping, "workflow_call");
                const workflowCallOutputsMapping =
                    workflowCallMapping === null
                        ? null
                        : getMappingValueAsMapping(
                              workflowCallMapping,
                              "outputs"
                          );

                if (workflowCallOutputsMapping !== null) {
                    for (const pair of workflowCallOutputsMapping.pairs) {
                        const reusableOutputName = getScalarStringValue(
                            pair.key
                        );
                        const reusableOutputMapping = unwrapYamlValue(
                            pair.value
                        );

                        if (
                            reusableOutputName === null ||
                            reusableOutputMapping?.type !== "YAMLMapping"
                        ) {
                            continue;
                        }

                        const valuePair = getMappingPair(
                            reusableOutputMapping,
                            "value"
                        );

                        visitStringScalars(
                            valuePair?.value ?? null,
                            (node, value) => {
                                for (const match of value.matchAll(
                                    jobsOutputReferencePattern
                                )) {
                                    const reference = match[0];
                                    const jobId = match.groups?.["jobId"];
                                    const outputName =
                                        match.groups?.["outputName"];

                                    if (
                                        jobId === undefined ||
                                        outputName === undefined
                                    ) {
                                        continue;
                                    }

                                    const declaredOutputNames =
                                        declaredOutputsByJobId.get(jobId);

                                    if (declaredOutputNames === undefined) {
                                        context.report({
                                            data: {
                                                jobId,
                                                reference,
                                                reusableOutputName,
                                            },
                                            messageId:
                                                "unknownReusableWorkflowJob",
                                            node: node as unknown as Rule.Node,
                                        });

                                        continue;
                                    }

                                    if (declaredOutputNames.has(outputName)) {
                                        continue;
                                    }

                                    context.report({
                                        data: {
                                            jobId,
                                            outputName,
                                            reference,
                                            reusableOutputName,
                                        },
                                        messageId:
                                            "unknownReusableWorkflowJobOutput",
                                        node: node as unknown as Rule.Node,
                                    });
                                }
                            }
                        );
                    }
                }

                for (const job of jobs) {
                    const directNeedsJobIds = getDirectNeedsJobIds(job.mapping);

                    visitStringScalars(job.mapping, (node, value) => {
                        for (const match of value.matchAll(
                            needsOutputReferencePattern
                        )) {
                            const reference = match[0];
                            const neededJobId = match.groups?.["neededJobId"];
                            const outputName = match.groups?.["outputName"];

                            if (
                                neededJobId === undefined ||
                                outputName === undefined
                            ) {
                                continue;
                            }

                            const declaredOutputNames =
                                declaredOutputsByJobId.get(neededJobId);

                            if (declaredOutputNames === undefined) {
                                context.report({
                                    data: {
                                        currentJobId: job.id,
                                        neededJobId,
                                        reference,
                                    },
                                    messageId: "unknownNeedsJob",
                                    node: node as unknown as Rule.Node,
                                });

                                continue;
                            }

                            if (!directNeedsJobIds.has(neededJobId)) {
                                context.report({
                                    data: {
                                        currentJobId: job.id,
                                        neededJobId,
                                        reference,
                                    },
                                    messageId: "missingNeedsDependency",
                                    node: node as unknown as Rule.Node,
                                });

                                continue;
                            }

                            if (declaredOutputNames.has(outputName)) {
                                continue;
                            }

                            context.report({
                                data: {
                                    currentJobId: job.id,
                                    neededJobId,
                                    outputName,
                                    reference,
                                },
                                messageId: "unknownNeedsOutput",
                                node: node as unknown as Rule.Node,
                            });
                        }
                    });
                }
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.recommended",
                "github-actions.configs.strict",
            ],
            description:
                "disallow `needs.*.outputs.*` and reusable-workflow `jobs.*.outputs.*` references that point at undeclared jobs or outputs.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R037",
            ruleNumber: 37,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-unknown-job-output-reference",
        },
        messages: {
            missingNeedsDependency:
                "Job '{{currentJobId}}' references `{{reference}}`, but job '{{neededJobId}}' is not listed in that job's direct `needs` dependencies.",
            unknownNeedsJob:
                "Job '{{currentJobId}}' references `{{reference}}`, but job '{{neededJobId}}' is not declared in this workflow.",
            unknownNeedsOutput:
                "Job '{{currentJobId}}' references `{{reference}}`, but job '{{neededJobId}}' does not declare output '{{outputName}}' under `jobs.{{neededJobId}}.outputs`.",
            unknownReusableWorkflowJob:
                "Reusable workflow output '{{reusableOutputName}}' references `{{reference}}`, but job '{{jobId}}' is not declared in this workflow.",
            unknownReusableWorkflowJobOutput:
                "Reusable workflow output '{{reusableOutputName}}' references `{{reference}}`, but job '{{jobId}}' does not declare output '{{outputName}}' under `jobs.{{jobId}}.outputs`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
