/**
 * @packageDocumentation
 * Disallow splitting JavaScript and TypeScript into separate CodeQL matrix entries.
 */
import type { Rule } from "eslint";

import {
    getCodeqlInitSteps,
    getCodeqlLanguageValues,
} from "../_internal/code-scanning-workflow.ts";
import { getWorkflowRoot } from "../_internal/workflow-yaml.js";

/** Rule implementation for disallowing split JS/TS CodeQL language matrices. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                for (const step of getCodeqlInitSteps(root)) {
                    const languageValues = new Set(
                        getCodeqlLanguageValues(step)
                    );

                    if (
                        languageValues.has("javascript") &&
                        languageValues.has("typescript")
                    ) {
                        context.report({
                            messageId: "splitJavaScriptTypeScriptMatrix",
                            node: (step.usesPair.value ??
                                step.usesPair) as unknown as Rule.Node,
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
                "github-actions.configs.codeScanning",
            ],
            description:
                "disallow CodeQL language matrices that split JavaScript and TypeScript instead of using `javascript-typescript`.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R096",
            ruleNumber: 96,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-codeql-javascript-typescript-split-language-matrix",
        },
        messages: {
            splitJavaScriptTypeScriptMatrix:
                "CodeQL should use a single `javascript-typescript` language entry instead of splitting `javascript` and `typescript` into separate matrix values.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
