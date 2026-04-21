/**
 * @packageDocumentation
 * Enforce a consistent naming convention for workflow names.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { arrayIncludes, arrayJoin, isDefined, safeCastTo } from "ts-extras";

import {
    convertToGithubActionsCasing,
    type GithubActionsCasingKind,
    githubActionsCasingKinds,
    matchesGithubActionsCasing,
} from "../_internal/casing.js";
import { isWorkflowFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getScalarStringValue,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Object-style configuration for `action-name-casing`. */
type ActionNameCasingObjectOption = Partial<
    Record<GithubActionsCasingKind, boolean>
> & {
    readonly ignores?: readonly string[];
};

/** Rule options for `action-name-casing`. */
type ActionNameCasingOptions = [
    (ActionNameCasingObjectOption | GithubActionsCasingKind)?,
];

/** Default casing enforced for workflow names. */
const DEFAULT_ACTION_NAME_CASING: GithubActionsCasingKind = "Title Case";

/**
 * Normalize action-name-casing options into allowed casings and ignore
 * patterns.
 */
const normalizeActionNameCasingOptions = (
    option: Readonly<
        ActionNameCasingObjectOption | GithubActionsCasingKind | undefined
    >
): {
    allowedCasings: readonly GithubActionsCasingKind[];
    ignoredNames: readonly string[];
} => {
    if (!isDefined(option) || typeof option === "string") {
        return {
            allowedCasings: [option ?? DEFAULT_ACTION_NAME_CASING],
            ignoredNames: [],
        };
    }

    const allowedCasings = githubActionsCasingKinds.filter(
        (casingKind) => option[casingKind] === true
    );

    return {
        allowedCasings:
            allowedCasings.length > 0
                ? allowedCasings
                : [DEFAULT_ACTION_NAME_CASING],
        ignoredNames: [...(option.ignores ?? [])],
    };
};

/** Rule implementation for enforcing workflow-name casing. */
const rule: Rule.RuleModule = {
    create(context) {
        const [option] = context.options as ActionNameCasingOptions;
        const { allowedCasings, ignoredNames } =
            normalizeActionNameCasingOptions(option ?? undefined);

        return {
            Program() {
                if (!isWorkflowFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                const namePair = getMappingPair(root, "name");
                const nameNode = unwrapYamlValue(namePair?.value ?? null);
                const nameValue = getScalarStringValue(nameNode);

                if (
                    namePair === null ||
                    nameNode?.type !== "YAMLScalar" ||
                    nameValue === null ||
                    nameValue.trim().length === 0 ||
                    arrayIncludes(ignoredNames, nameValue)
                ) {
                    return;
                }

                const matchesAllowedCasing = allowedCasings.some((casingKind) =>
                    matchesGithubActionsCasing(nameValue, casingKind)
                );

                if (!matchesAllowedCasing) {
                    const [firstAllowedCasing] = allowedCasings;

                    context.report({
                        data: {
                            caseTypes: arrayJoin(allowedCasings, ", "),
                            name: nameValue,
                        },
                        fix:
                            isDefined(firstAllowedCasing) &&
                            allowedCasings.length === 1
                                ? (fixer) =>
                                      fixer.replaceTextRange(
                                          nameNode.range,
                                          convertToGithubActionsCasing(
                                              nameValue,
                                              firstAllowedCasing
                                          )
                                      )
                                : undefined,
                        messageId: "nameDoesNotMatchCasing",
                        node: safeCastTo<AST.YAMLNode>(
                            nameNode
                        ) as unknown as Rule.Node,
                    });
                }
            },
        };
    },
    meta: {
        defaultOptions: [DEFAULT_ACTION_NAME_CASING],
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.strict",
            ],
            description:
                "enforce a consistent casing convention for workflow `name` values.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R009",
            ruleNumber: 9,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/action-name-casing",
        },
        fixable: "code",
        messages: {
            nameDoesNotMatchCasing:
                "Workflow name '{{name}}' is not in the configured casing: {{caseTypes}}.",
        },
        schema: [
            {
                anyOf: [
                    {
                        description:
                            "Single allowed casing convention for the workflow `name` value.",
                        enum: githubActionsCasingKinds,
                        type: "string",
                    },
                    {
                        additionalProperties: false,
                        description:
                            "Allowed casing conventions and ignore patterns for the workflow `name` value.",
                        properties: {
                            camelCase: {
                                description: "Allow camelCase workflow names.",
                                type: "boolean",
                            },
                            ignores: {
                                description:
                                    "Literal workflow names that should be ignored by this rule.",
                                items: {
                                    type: "string",
                                },
                                type: "array",
                                uniqueItems: true,
                            },
                            "kebab-case": {
                                description: "Allow kebab-case workflow names.",
                                type: "boolean",
                            },
                            PascalCase: {
                                description: "Allow PascalCase workflow names.",
                                type: "boolean",
                            },
                            SCREAMING_SNAKE_CASE: {
                                description:
                                    "Allow SCREAMING_SNAKE_CASE workflow names.",
                                type: "boolean",
                            },
                            snake_case: {
                                description: "Allow snake_case workflow names.",
                                type: "boolean",
                            },
                            "Title Case": {
                                description: "Allow Title Case workflow names.",
                                type: "boolean",
                            },
                            "Train-Case": {
                                description: "Allow Train-Case workflow names.",
                                type: "boolean",
                            },
                        },
                        type: "object",
                    },
                ],
                description:
                    "Configure one or more allowed casing conventions for workflow `name` values.",
            },
        ],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
