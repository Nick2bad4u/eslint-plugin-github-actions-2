/**
 * @packageDocumentation
 * Enforce consistent casing for declared action and workflow input identifiers.
 */
import type { Rule } from "eslint";
import type { UnknownArray } from "type-fest";
import type { AST } from "yaml-eslint-parser";

import {
    arrayFirst,
    arrayIncludes,
    arrayJoin,
    isDefined,
    safeCastTo,
    setHas,
} from "ts-extras";

import {
    type GithubActionsNonTitleCasingKind,
    githubActionsNonTitleCasingKinds,
    matchesGithubActionsCasing,
} from "../_internal/casing.js";
import {
    isActionMetadataFile,
    isWorkflowFile,
} from "../_internal/lint-targets.js";
import { reportYamlNode } from "../_internal/report.js";
import {
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Object-style configuration matching the other identifier casing rules. */
type InputIdCaseObjectOption = Partial<
    Record<GithubActionsNonTitleCasingKind, boolean>
> & {
    readonly ignores?: readonly string[];
};

/** Default casing for input identifiers. */
const DEFAULT_INPUT_ID_CASE: GithubActionsNonTitleCasingKind = "kebab-case";
/** Supported single-style options. */
const inputIdCaseSet: ReadonlySet<string> = new Set(
    githubActionsNonTitleCasingKinds
);

/** Narrow an option after ESLint has validated its schema. */
const isInputIdCaseOption = (
    value: unknown
): value is GithubActionsNonTitleCasingKind | InputIdCaseObjectOption =>
    typeof value === "string"
        ? setHas(inputIdCaseSet, value)
        : typeof value === "object" && value !== null;

/**
 * Resolve enabled conventions, falling back to the default when none are
 * enabled.
 */
const normalizeInputIdCaseOptions = (
    option: Readonly<
        | GithubActionsNonTitleCasingKind
        | InputIdCaseObjectOption
        | undefined
    >
): {
    allowedCasings: readonly GithubActionsNonTitleCasingKind[];
    ignoredInputIds: readonly string[];
} => {
    if (typeof option === "string" || !isDefined(option)) {
        return {
            allowedCasings: [option ?? DEFAULT_INPUT_ID_CASE],
            ignoredInputIds: [],
        };
    }

    const allowedCasings = githubActionsNonTitleCasingKinds.filter(
        (casingKind) => option[casingKind] === true
    );

    return {
        allowedCasings:
            allowedCasings.length > 0
                ? allowedCasings
                : [DEFAULT_INPUT_ID_CASE],
        ignoredInputIds: [...(option.ignores ?? [])],
    };
};

/** Collect only declaration mappings, never consumer `with` keys. */
const getInputDeclarationMappings = (
    context: Readonly<Rule.RuleContext>
): readonly AST.YAMLMapping[] => {
    const isWorkflow = isWorkflowFile(context.filename);
    const isActionMetadata =
        !isWorkflow && isActionMetadataFile(context.filename);

    if (!isActionMetadata && !isWorkflow) {
        return [];
    }

    const root = getWorkflowRoot(context);

    if (root === null) {
        return [];
    }

    if (isActionMetadata) {
        const inputs = getMappingValueAsMapping(root, "inputs");

        return inputs === null ? [] : [inputs];
    }

    const onMapping = getMappingValueAsMapping(root, "on");

    if (onMapping === null) {
        return [];
    }

    const mappings: AST.YAMLMapping[] = [];

    for (const event of ["workflow_call", "workflow_dispatch"]) {
        const eventMapping = getMappingValueAsMapping(onMapping, event);
        const inputs =
            eventMapping === null
                ? null
                : getMappingValueAsMapping(eventMapping, "inputs");

        if (inputs !== null) {
            mappings.push(inputs);
        }
    }

    return mappings;
};

/** Rule implementation for declared input identifier casing. */
const rule: Rule.RuleModule = {
    create(context) {
        const rawOption = arrayFirst(
            safeCastTo<Readonly<UnknownArray>>(context.options)
        );
        const { allowedCasings, ignoredInputIds } = normalizeInputIdCaseOptions(
            isInputIdCaseOption(rawOption) ? rawOption : undefined
        );

        return {
            Program() {
                for (const inputs of getInputDeclarationMappings(context)) {
                    for (const pair of inputs.pairs) {
                        const inputId = getScalarStringValue(pair.key);

                        if (
                            inputId === null ||
                            inputId === "<<" ||
                            arrayIncludes(ignoredInputIds, inputId)
                        ) {
                            continue;
                        }

                        const isMatchesAllowedCasing = allowedCasings.some(
                            (casingKind) =>
                                matchesGithubActionsCasing(inputId, casingKind)
                        );

                        if (!isMatchesAllowedCasing) {
                            reportYamlNode(context, {
                                data: {
                                    caseTypes: arrayJoin(allowedCasings, ", "),
                                    inputId,
                                },
                                messageId: "inputIdDoesNotMatchCasing",
                                node: pair.key,
                            });
                        }
                    }
                }
            },
        };
    },
    meta: {
        defaultOptions: [DEFAULT_INPUT_ID_CASE],
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.stylistic",
            ],
            description:
                "enforce a consistent casing convention for declared action and workflow input identifiers.",
            dialects: ["GitHub Action metadata", "GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R116",
            ruleNumber: 116,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/input-id-case",
        },
        messages: {
            inputIdDoesNotMatchCasing:
                "Input id '{{inputId}}' is not in the configured casing: {{caseTypes}}.",
        },
        schema: [
            {
                anyOf: [
                    {
                        description:
                            "Single allowed casing convention for input ids.",
                        enum: githubActionsNonTitleCasingKinds,
                        type: "string",
                    },
                    {
                        additionalProperties: false,
                        description:
                            "Allowed casing conventions and literal input ids to ignore.",
                        properties: {
                            camelCase: {
                                description: "Allow camelCase input ids.",
                                type: "boolean",
                            },
                            ignores: {
                                description:
                                    "Literal, case-sensitive input ids to ignore.",
                                items: { type: "string" },
                                type: "array",
                                uniqueItems: true,
                            },
                            "kebab-case": {
                                description: "Allow kebab-case input ids.",
                                type: "boolean",
                            },
                            PascalCase: {
                                description: "Allow PascalCase input ids.",
                                type: "boolean",
                            },
                            SCREAMING_SNAKE_CASE: {
                                description:
                                    "Allow SCREAMING_SNAKE_CASE input ids.",
                                type: "boolean",
                            },
                            snake_case: {
                                description: "Allow snake_case input ids.",
                                type: "boolean",
                            },
                            "Train-Case": {
                                description: "Allow Train-Case input ids.",
                                type: "boolean",
                            },
                        },
                        type: "object",
                    },
                ],
                description:
                    "Configure one or more allowed casing conventions for declared input ids.",
            },
        ],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
