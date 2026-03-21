/**
 * @packageDocumentation
 * Prefer the `inputs` context over `github.event.inputs` in manual workflows.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import {
    getScalarStringValue,
    getWorkflowEventNames,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Legacy workflow_dispatch inputs context prefix. */
const githubEventInputsPrefix = "github.event.inputs.";

/** Preferred workflow_dispatch inputs context prefix. */
const inputsContextPrefix = "inputs.";

/** Check whether a scalar string references the legacy inputs context. */
const hasGithubEventInputsReference = (value: string): boolean =>
    value.includes(githubEventInputsPrefix);

/** Replace legacy workflow_dispatch inputs references with the preferred form. */
const replaceGithubEventInputsReferences = (value: string): string =>
    value.replaceAll(githubEventInputsPrefix, inputsContextPrefix);

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

/** Rule implementation for preferring the `inputs` context. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                const eventNames = getWorkflowEventNames(root);

                if (!eventNames.has("workflow_dispatch")) {
                    return;
                }

                visitStringScalars(root, (node, value) => {
                    if (!hasGithubEventInputsReference(value)) {
                        return;
                    }

                    context.report({
                        fix: (fixer) => {
                            const originalText = context.sourceCode.text.slice(
                                node.range[0],
                                node.range[1]
                            );
                            const fixedText =
                                replaceGithubEventInputsReferences(
                                    originalText
                                );

                            return originalText === fixedText
                                ? null
                                : fixer.replaceTextRange(node.range, fixedText);
                        },
                        messageId: "preferInputsContext",
                        node: node as unknown as Rule.Node,
                    });
                });
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
                "enforce the `inputs` context instead of `github.event.inputs` in `workflow_dispatch` workflows so boolean inputs preserve their native type semantics.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R033",
            ruleNumber: 33,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/prefer-inputs-context",
        },
        fixable: "code",
        messages: {
            preferInputsContext:
                "Prefer `inputs.*` over `github.event.inputs.*` in `workflow_dispatch` workflows because the `inputs` context preserves booleans and is the documented shorthand.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
