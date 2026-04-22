/**
 * @packageDocumentation
 * Require every GitHub Actions job to declare a string name.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { arrayFirst } from "ts-extras";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";
import {
    getIndexAfterLine,
    getLineIndentation,
} from "../_internal/yaml-fixes.js";

/** Build the insert-name suggest fix for a missing job name. */
const buildInsertJobNameSuggest = (
    context: Readonly<Rule.RuleContext>,
    jobId: string,
    jobKeyNode: Readonly<AST.YAMLNode>
): Rule.SuggestionReportDescriptor[] => [
    {
        data: { jobId },
        fix: (fixer) => {
            const insertionIndex = getIndexAfterLine(
                context.sourceCode.text,
                jobKeyNode.range[1]
            );
            const childIndentation = `${getLineIndentation(
                context.sourceCode.text,
                arrayFirst(jobKeyNode.range)
            )}  `;

            return fixer.insertTextBeforeRange(
                [insertionIndex, insertionIndex],
                `${childIndentation}name: ${JSON.stringify(jobId)}\n`
            );
        },
        messageId: "insertJobNameSuggestion",
    },
];

/** Check a single job mapping pair for a valid name and report any violations. */
const checkJobPair = (
    context: Readonly<Rule.RuleContext>,
    pair: Readonly<AST.YAMLPair>
): void => {
    const jobKeyNode = pair.key;
    const jobId = getScalarStringValue(pair.key) ?? "<unknown>";
    const jobValue = unwrapYamlValue(pair.value);

    if (jobValue?.type !== "YAMLMapping") {
        context.report({
            data: { jobId },
            messageId: "missingJobName",
            node: (pair.value ?? pair) as unknown as Rule.Node,
        });

        return;
    }

    const namePair = getMappingPair(jobValue, "name");

    if (namePair === null) {
        context.report({
            data: { jobId },
            messageId: "missingJobName",
            node: pair.key as AST.YAMLNode as unknown as Rule.Node,
            suggest:
                jobId === "<unknown>" || jobKeyNode === null
                    ? undefined
                    : buildInsertJobNameSuggest(context, jobId, jobKeyNode),
        });

        return;
    }

    const nameValue = getScalarStringValue(namePair.value);
    const nameValueNode = namePair.value;

    if (nameValue === null || nameValue.trim().length === 0) {
        context.report({
            data: { jobId },
            messageId: "invalidJobName",
            node: (namePair.value ?? namePair) as unknown as Rule.Node,
            suggest:
                jobId === "<unknown>" || nameValueNode === null
                    ? undefined
                    : [
                          {
                              data: { jobId },
                              fix: (fixer) =>
                                  fixer.replaceTextRange(
                                      nameValueNode.range,
                                      JSON.stringify(jobId)
                                  ),
                              messageId: "replaceJobNameSuggestion",
                          },
                      ],
        });
    }
};

/** Rule implementation for requiring explicit job names. */
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

                const jobsMapping = getMappingValueAsMapping(root, "jobs");

                if (jobsMapping === null) {
                    return;
                }

                for (const pair of jobsMapping.pairs) {
                    checkJobPair(context, pair);
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
                "require every workflow job to declare a non-empty string `name` for readable run summaries.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R007",
            ruleNumber: 7,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-job-name",
        },
        hasSuggestions: true,
        messages: {
            insertJobNameSuggestion: "Insert `name: {{jobId}}` for this job.",
            invalidJobName:
                "Job '{{jobId}}' must set `name` to a non-empty string.",
            missingJobName:
                "Job '{{jobId}}' is missing a human-readable `name`.",
            replaceJobNameSuggestion:
                "Replace the blank job name with `{{jobId}}`.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
