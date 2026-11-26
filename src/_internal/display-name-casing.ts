/**
 * @packageDocumentation
 * Shared option handling, checks, and fixes for job and step display-name
 * casing rules.
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

import { createCasingOptionProperties } from "./casing-schema.js";
import {
    convertToGithubActionsCasing,
    type GithubActionsCasingKind,
    githubActionsCasingKinds,
    matchesGithubActionsCasing,
} from "./casing.js";
import {
    convertDisplayNameToTitleCase,
    hasOpaqueDisplayNameSegment,
} from "./workflow-title-case.js";
import {
    getMappingPair,
    getScalarStringValue,
    unwrapYamlValue,
} from "./workflow-yaml.js";

/** Normalized display-name casing policy. */
export interface DisplayNameCasingPolicy {
    readonly allowedCasings: readonly GithubActionsCasingKind[];
    readonly allowedNamePattern: RegExp | undefined;
    readonly ignoredNames: readonly string[];
}

/** A display name that does not match the configured casing. */
export interface DisplayNameCasingViolation {
    readonly data: Readonly<{
        caseTypes: string;
        name: string;
        replacementName: string;
    }>;
    readonly fix: Rule.ReportFixer | undefined;
    readonly node: AST.YAMLScalar;
}

/** Object-style configuration shared by display-name casing rules. */
type DisplayNameCasingObjectOption = Partial<
    Record<GithubActionsCasingKind, boolean>
> & {
    readonly allowPattern?: string;
    readonly ignores?: readonly string[];
};

/** Default casing enforced for job and step display names. */
export const DEFAULT_DISPLAY_NAME_CASING: GithubActionsCasingKind =
    "Title Case";

const displayNameCasingSet: ReadonlySet<string> = new Set(
    githubActionsCasingKinds
);

/** Determine whether an unknown value is a supported rule option. */
const isDisplayNameCasingOption = (
    value: unknown
): value is DisplayNameCasingObjectOption | GithubActionsCasingKind =>
    typeof value === "string"
        ? setHas(displayNameCasingSet, value)
        : typeof value === "object" && value !== null;

/** Normalize raw rule options into a display-name casing policy. */
export const createDisplayNameCasingPolicy = (
    options: Readonly<UnknownArray>
): DisplayNameCasingPolicy => {
    const rawOption = arrayFirst(safeCastTo<Readonly<UnknownArray>>(options));
    const option = isDisplayNameCasingOption(rawOption) ? rawOption : undefined;

    if (typeof option === "string" || !isDefined(option)) {
        return {
            allowedCasings: [option ?? DEFAULT_DISPLAY_NAME_CASING],
            allowedNamePattern: undefined,
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
                : [DEFAULT_DISPLAY_NAME_CASING],
        allowedNamePattern: isDefined(option.allowPattern)
            ? new RegExp(option.allowPattern, "u")
            : undefined,
        ignoredNames: [...(option.ignores ?? [])],
    };
};

/** Build the JSON schema shared by display-name casing rules. */
export const createDisplayNameCasingSchema = (
    subject: string
): NonNullable<Rule.RuleMetaData["schema"]> => [
    {
        anyOf: [
            {
                description: `Single allowed casing convention for ${subject}.`,
                enum: [...githubActionsCasingKinds],
                type: "string",
            },
            {
                additionalProperties: false,
                description: `Allowed casing conventions and exceptions for ${subject}.`,
                properties: {
                    ...createCasingOptionProperties(
                        githubActionsCasingKinds,
                        subject,
                        `Literal ${subject} that should be ignored by this rule.`
                    ),
                    allowPattern: {
                        description: `Regular expression source for ${subject} that should be ignored by this rule.`,
                        format: "regex",
                        minLength: 1,
                        type: "string",
                    },
                },
                type: "object",
            },
        ],
        description: `Configure one or more allowed casing conventions for ${subject}.`,
    },
];

/** Convert a display name into one casing convention. */
const convertDisplayNameToCasing = (
    value: string,
    casingKind: GithubActionsCasingKind
): string =>
    casingKind === "Title Case"
        ? convertDisplayNameToTitleCase(value)
        : convertToGithubActionsCasing(value, casingKind);

/**
 * Determine whether a display name satisfies one casing convention. Names with
 * expressions or code spans can only be checked as Title Case, because the
 * identifier-style casings would rewrite the embedded text.
 */
const matchesDisplayNameCasing = (
    value: string,
    casingKind: GithubActionsCasingKind
): boolean => {
    if (casingKind === "Title Case") {
        return convertDisplayNameToTitleCase(value) === value;
    }

    return (
        hasOpaqueDisplayNameSegment(value) ||
        matchesGithubActionsCasing(value, casingKind)
    );
};

/**
 * Rewrite a scalar's source text when its raw form maps directly onto its
 * value. Plain and quoted scalars without escapes qualify; block scalars and
 * escaped strings do not.
 */
const getScalarReplacementText = (
    rawText: string,
    value: string,
    replacement: string
): string | undefined => {
    if (rawText === value) {
        return replacement;
    }

    for (const quote of ['"', "'"]) {
        if (rawText === `${quote}${value}${quote}`) {
            return `${quote}${replacement}${quote}`;
        }
    }

    return undefined;
};

/**
 * Check the `name` scalar of a job or step mapping and describe the casing
 * violation, if any. The fixer is defined only when exactly one casing is
 * allowed and the scalar's source text can be rewritten safely.
 */
export const getDisplayNameCasingViolation = (
    context: Readonly<Rule.RuleContext>,
    mapping: Readonly<AST.YAMLMapping>,
    policy: Readonly<DisplayNameCasingPolicy>
): DisplayNameCasingViolation | undefined => {
    const nameNode = unwrapYamlValue(getMappingPair(mapping, "name")?.value);
    const nameValue = getScalarStringValue(nameNode);

    if (
        nameValue === null ||
        nameNode?.type !== "YAMLScalar" ||
        nameValue.trim().length === 0 ||
        arrayIncludes(policy.ignoredNames, nameValue) ||
        policy.allowedNamePattern?.test(nameValue) === true ||
        policy.allowedCasings.some((casingKind) =>
            matchesDisplayNameCasing(nameValue, casingKind)
        )
    ) {
        return undefined;
    }

    const [targetCasing] = policy.allowedCasings;
    const replacementName =
        isDefined(targetCasing) &&
        policy.allowedCasings.length === 1 &&
        (targetCasing === "Title Case" ||
            !hasOpaqueDisplayNameSegment(nameValue))
            ? convertDisplayNameToCasing(nameValue, targetCasing)
            : undefined;
    const replacementText = isDefined(replacementName)
        ? getScalarReplacementText(
              context.sourceCode.text.slice(...nameNode.range),
              nameValue,
              replacementName
          )
        : undefined;

    return {
        data: {
            caseTypes: arrayJoin(policy.allowedCasings, ", "),
            name: nameValue,
            replacementName: replacementName ?? "",
        },
        fix: isDefined(replacementText)
            ? (ruleFixer) =>
                  ruleFixer.replaceTextRange(nameNode.range, replacementText)
            : undefined,
        node: nameNode,
    };
};
