/**
 * @packageDocumentation
 * Require every workflow step to declare a string name.
 */
import type { Rule } from "eslint";

import {
    getMappingPair,
    getMappingValueAsSequence,
    getScalarStringValue,
    getWorkflowJobs,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";
import {
    getIndexAfterLine,
    getLineIndentation,
} from "../_internal/yaml-fixes.js";

/** Maximum suggested step-name length derived from a run command. */
const MAX_SUGGESTED_STEP_NAME_LENGTH = 60;

/** Derive a suggestion label from a step's `uses` or `run` content. */
const getSuggestedStepName = (
    stepMapping: Readonly<ReturnType<typeof unwrapYamlValue>>
): string | undefined => {
    if (stepMapping?.type !== "YAMLMapping") {
        return undefined;
    }

    const usesReference = getScalarStringValue(
        getMappingPair(stepMapping, "uses")?.value
    )?.trim();

    if (usesReference !== undefined && usesReference.length > 0) {
        const atSignIndex = usesReference.lastIndexOf("@");

        return atSignIndex === -1
            ? usesReference
            : usesReference.slice(0, atSignIndex);
    }

    const runScript = getScalarStringValue(
        getMappingPair(stepMapping, "run")?.value
    );

    if (runScript === null) {
        return undefined;
    }

    const firstNonEmptyLine = runScript
        .split(/\r?\n/u)
        .map((line) => line.trim())
        .find((line) => line.length > 0);

    return firstNonEmptyLine === undefined ||
        firstNonEmptyLine.length > MAX_SUGGESTED_STEP_NAME_LENGTH
        ? undefined
        : firstNonEmptyLine;
};

/** Rule implementation for requiring explicit job step names. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
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

                        const suggestedStepName =
                            getSuggestedStepName(stepMapping);

                        const namePair = getMappingPair(stepMapping, "name");

                        if (namePair === null) {
                            const firstStepPair = stepMapping.pairs[0];
                            const firstStepKeyNode = firstStepPair?.key;

                            context.report({
                                data: {
                                    jobId: job.id,
                                },
                                messageId: "missingStepName",
                                node: stepMapping as unknown as Rule.Node,
                                suggest:
                                    suggestedStepName === undefined ||
                                    firstStepKeyNode === null ||
                                    firstStepKeyNode === undefined
                                        ? undefined
                                        : [
                                              {
                                                  data: {
                                                      jobId: job.id,
                                                      suggestedStepName,
                                                  },
                                                  fix: (fixer) => {
                                                      const insertionIndex =
                                                          getIndexAfterLine(
                                                              context.sourceCode
                                                                  .text,
                                                              firstStepKeyNode
                                                                  .range[1]
                                                          );
                                                      const childIndentation = `${getLineIndentation(
                                                          context.sourceCode
                                                              .text,
                                                          firstStepKeyNode
                                                              .range[0]
                                                      )}  `;

                                                      return fixer.insertTextBeforeRange(
                                                          [
                                                              insertionIndex,
                                                              insertionIndex,
                                                          ],
                                                          `${childIndentation}name: ${JSON.stringify(suggestedStepName)}\n`
                                                      );
                                                  },
                                                  messageId:
                                                      "insertStepNameSuggestion",
                                              },
                                          ],
                            });

                            continue;
                        }

                        const nameValue = getScalarStringValue(namePair.value);

                        if (
                            nameValue === null ||
                            nameValue.trim().length === 0
                        ) {
                            const nameValueNode = namePair.value;

                            context.report({
                                data: {
                                    jobId: job.id,
                                },
                                messageId: "invalidStepName",
                                node: (namePair.value ??
                                    namePair) as unknown as Rule.Node,
                                suggest:
                                    suggestedStepName === undefined ||
                                    nameValueNode === null
                                        ? undefined
                                        : [
                                              {
                                                  data: {
                                                      jobId: job.id,
                                                      suggestedStepName,
                                                  },
                                                  fix: (fixer) =>
                                                      fixer.replaceTextRange(
                                                          nameValueNode.range,
                                                          JSON.stringify(
                                                              suggestedStepName
                                                          )
                                                      ),
                                                  messageId:
                                                      "replaceStepNameSuggestion",
                                              },
                                          ],
                            });
                        }
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
                "require every workflow step to declare a non-empty string `name` so job logs remain readable.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R008",
            ruleNumber: 8,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-job-step-name",
        },
        hasSuggestions: true,
        messages: {
            insertStepNameSuggestion:
                "Insert `name: {{suggestedStepName}}` for this step in job '{{jobId}}'.",
            invalidStepName:
                "A step in job '{{jobId}}' must set `name` to a non-empty string.",
            missingStepName:
                "A step in job '{{jobId}}' is missing a human-readable `name`.",
            replaceStepNameSuggestion:
                "Replace the blank step name with `{{suggestedStepName}}` in job '{{jobId}}'.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
