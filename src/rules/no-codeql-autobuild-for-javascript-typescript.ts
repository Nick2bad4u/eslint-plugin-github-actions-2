/**
 * @packageDocumentation
 * Disallow CodeQL autobuild when a workflow only scans JavaScript/TypeScript.
 */
import type { Rule } from "eslint";

import { isEmpty } from "ts-extras";

import {
    codeqlLanguagesAreOnlyJavaScriptTypeScript,
    getCodeqlAutobuildSteps,
    getCodeqlInitSteps,
    getCodeqlLanguageValues,
} from "../_internal/code-scanning-workflow.ts";
import { isWorkflowFile } from "../_internal/lint-targets.js";
import { getWorkflowRoot } from "../_internal/workflow-yaml.js";

/** Rule implementation for disallowing CodeQL autobuild on JS/TS-only workflows. */
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

                for (const autobuildStep of getCodeqlAutobuildSteps(root)) {
                    const initSteps = getCodeqlInitSteps(root).filter(
                        (step) => step.job.id === autobuildStep.job.id
                    );

                    if (isEmpty(initSteps)) {
                        continue;
                    }

                    const languageValues = initSteps.flatMap((step) =>
                        getCodeqlLanguageValues(step)
                    );

                    if (
                        !codeqlLanguagesAreOnlyJavaScriptTypeScript(
                            languageValues
                        )
                    ) {
                        continue;
                    }

                    context.report({
                        messageId: "unnecessaryCodeqlAutobuild",
                        node: (autobuildStep.usesPair.value ??
                            autobuildStep.usesPair) as unknown as Rule.Node,
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
                "github-actions.configs.codeScanning",
            ],
            description:
                "disallow `github/codeql-action/autobuild` when CodeQL is only scanning JavaScript/TypeScript.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R097",
            ruleNumber: 97,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-codeql-autobuild-for-javascript-typescript",
        },
        messages: {
            unnecessaryCodeqlAutobuild:
                "CodeQL autobuild is unnecessary for JavaScript/TypeScript-only analysis and should be removed.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
