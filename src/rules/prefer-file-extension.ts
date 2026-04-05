/**
 * @packageDocumentation
 * Enforce a consistent file extension for workflow files.
 */
import type { Rule } from "eslint";

import { extname } from "node:path";

import { isWorkflowFile } from "../_internal/lint-targets.js";

/** Supported workflow filename extensions. */
const workflowFileExtensions = ["yaml", "yml"] as const;

/** Allowed workflow filename extension. */
type WorkflowFileExtension = (typeof workflowFileExtensions)[number];

/** Object-style options for `prefer-file-extension`. */
type WorkflowFileExtensionOptionObject = {
    readonly caseSensitive?: boolean;
    readonly extension?: WorkflowFileExtension;
};

/** Rule options for `prefer-file-extension`. */
type WorkflowFileExtensionOptions = [
    (WorkflowFileExtension | WorkflowFileExtensionOptionObject)?,
];

/** Default workflow file extension. */
const DEFAULT_WORKFLOW_FILE_EXTENSION: WorkflowFileExtension = "yml";

/** Normalize file extension options into a consistent runtime shape. */
const normalizePreferFileExtensionOptions = (
    option: Readonly<
        undefined | WorkflowFileExtension | WorkflowFileExtensionOptionObject
    >
): {
    caseSensitive: boolean;
    extension: WorkflowFileExtension;
} => {
    if (option === undefined || typeof option === "string") {
        return {
            caseSensitive: true,
            extension: option ?? DEFAULT_WORKFLOW_FILE_EXTENSION,
        };
    }

    return {
        caseSensitive: option.caseSensitive ?? true,
        extension: option.extension ?? DEFAULT_WORKFLOW_FILE_EXTENSION,
    };
};

/** Rule implementation for enforcing workflow file extensions. */
const rule: Rule.RuleModule = {
    create(context) {
        const [option] = context.options as WorkflowFileExtensionOptions;
        const { caseSensitive, extension } =
            normalizePreferFileExtensionOptions(option ?? undefined);

        return {
            Program(node) {
                if (!isWorkflowFile(context.filename)) {
                    return;
                }

                const actualExtensionWithDot = extname(context.filename);

                if (actualExtensionWithDot.length === 0) {
                    return;
                }

                const actualExtension = actualExtensionWithDot.slice(1);

                if (actualExtension === undefined) {
                    return;
                }

                const normalizedActualExtension = caseSensitive
                    ? actualExtension
                    : actualExtension.toLowerCase();
                const normalizedExpectedExtension = caseSensitive
                    ? extension
                    : extension.toLowerCase();

                if (normalizedActualExtension === normalizedExpectedExtension) {
                    return;
                }

                context.report({
                    data: {
                        actual: `.${actualExtension}`,
                        expected: `.${extension}`,
                    },
                    messageId: "unexpectedExtension",
                    node: node as unknown as Rule.Node,
                });
            },
        };
    },
    meta: {
        defaultOptions: [DEFAULT_WORKFLOW_FILE_EXTENSION],
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.recommended",
                "github-actions.configs.strict",
            ],
            description:
                "enforce a consistent file extension for GitHub Actions workflow files.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R020",
            ruleNumber: 20,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/prefer-file-extension",
        },
        messages: {
            unexpectedExtension:
                "Expected workflow files to use the {{expected}} extension, but found {{actual}}.",
        },
        schema: [
            {
                anyOf: [
                    {
                        description: "Expected workflow filename extension.",
                        enum: workflowFileExtensions,
                        type: "string",
                    },
                    {
                        additionalProperties: false,
                        description: "Workflow filename extension options.",
                        properties: {
                            caseSensitive: {
                                description:
                                    "Whether extension matching should preserve case.",
                                type: "boolean",
                            },
                            extension: {
                                description:
                                    "Expected workflow filename extension.",
                                enum: workflowFileExtensions,
                                type: "string",
                            },
                        },
                        type: "object",
                    },
                ],
                description:
                    "Workflow filename extension preference, either as a simple extension string or an option object.",
            },
        ],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
