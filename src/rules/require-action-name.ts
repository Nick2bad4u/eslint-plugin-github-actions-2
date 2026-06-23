/**
 * @packageDocumentation
 * Require every workflow file to declare a human-readable top-level name.
 */
import type { Rule } from "eslint";

import { isWorkflowFile } from "../_internal/lint-targets.js";
import { reportYamlNode } from "../_internal/report.js";
import {
    getMappingPair,
    getScalarStringValue,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring a string workflow name. */
const rule: Rule.RuleModule = {
    create: (context) => ({
        Program(node) {
            if (!isWorkflowFile(context.filename)) {
                return;
            }

            const root = getWorkflowRoot(context);

            if (root === null) {
                reportYamlNode(context, {
                    messageId: "missingName",
                    node: node,
                });

                return;
            }

            const namePair = getMappingPair(root, "name");

            if (namePair === null) {
                reportYamlNode(context, {
                    messageId: "missingName",
                    node: root,
                });

                return;
            }

            const nameValue = getScalarStringValue(namePair.value);

            if (nameValue === null || nameValue.trim().length === 0) {
                reportYamlNode(context, {
                    messageId: "invalidName",
                    node: namePair.value ?? namePair,
                });
            }
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.recommended",
                "github-actions.configs.strict",
            ],
            description:
                "require a non-empty string workflow `name` so workflow runs stay readable in the GitHub Actions UI.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R005",
            ruleNumber: 5,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-action-name",
        },
        messages: {
            invalidName: "Workflow `name` must be a non-empty string.",
            missingName:
                "Add a top-level workflow `name` so runs are identifiable in the GitHub Actions UI.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
