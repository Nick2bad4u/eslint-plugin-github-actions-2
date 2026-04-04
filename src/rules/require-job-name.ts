/**
 * @packageDocumentation
 * Require every GitHub Actions job to declare a string name.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import {
    getMappingPair,
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring explicit job names. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                const jobsMapping = getMappingValueAsMapping(root, "jobs");

                if (jobsMapping === null) {
                    return;
                }

                for (const pair of jobsMapping.pairs) {
                    const jobId = getScalarStringValue(pair.key) ?? "<unknown>";
                    const jobValue = unwrapYamlValue(pair.value);

                    if (jobValue?.type !== "YAMLMapping") {
                        context.report({
                            data: { jobId },
                            messageId: "missingJobName",
                            node: (pair.value ?? pair) as unknown as Rule.Node,
                        });

                        continue;
                    }

                    const namePair = getMappingPair(jobValue, "name");

                    if (namePair === null) {
                        context.report({
                            data: { jobId },
                            messageId: "missingJobName",
                            node: pair.key as AST.YAMLNode as unknown as Rule.Node,
                        });

                        continue;
                    }

                    const nameValue = getScalarStringValue(namePair.value);

                    if (nameValue === null || nameValue.trim().length === 0) {
                        context.report({
                            data: { jobId },
                            messageId: "invalidJobName",
                            node: (namePair.value ??
                                namePair) as unknown as Rule.Node,
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
        messages: {
            invalidJobName:
                "Job '{{jobId}}' must set `name` to a non-empty string.",
            missingJobName:
                "Job '{{jobId}}' is missing a human-readable `name`.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
