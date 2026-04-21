/**
 * @packageDocumentation
 * Shared casing helpers for naming-oriented GitHub Actions rules.
 */

import { arrayFirst, arrayJoin, isEmpty, objectEntries, stringSplit     } from "ts-extras";

import { casePoliceDictionary } from "./case-police-dictionary.js";

/** Supported naming conventions used by workflow naming rules. */
export const githubActionsCasingKinds = [
    "camelCase",
    "kebab-case",
    "PascalCase",
    "snake_case",
    "Title Case",
    "Train-Case",
    "SCREAMING_SNAKE_CASE",
] as const;

/** String literal union of supported naming conventions. */
export type GithubActionsCasingKind = (typeof githubActionsCasingKinds)[number];

/** Casing variants that exclude title-cased words with spaces. */
export const githubActionsNonTitleCasingKinds = [
    "camelCase",
    "kebab-case",
    "PascalCase",
    "snake_case",
    "Train-Case",
    "SCREAMING_SNAKE_CASE",
] as const;

/** String literal union of supported non-title casing conventions. */
export type GithubActionsNonTitleCasingKind =
    (typeof githubActionsNonTitleCasingKinds)[number];

/** Determine whether a character is an ASCII letter or digit. */
const isAlphaNumericCharacter = (character: string): boolean => {
    const codePoint = character.codePointAt(0) ?? -1;

    return (
        (codePoint >= 48 && codePoint <= 57) ||
        (codePoint >= 65 && codePoint <= 90) ||
        (codePoint >= 97 && codePoint <= 122)
    );
};

/** Determine whether a character is an ASCII uppercase letter. */
const isUppercaseCharacter = (character: string): boolean => {
    const codePoint = character.codePointAt(0) ?? -1;

    return codePoint >= 65 && codePoint <= 90;
};

/** Determine whether a character is an ASCII lowercase letter. */
const isLowercaseCharacter = (character: string): boolean => {
    const codePoint = character.codePointAt(0) ?? -1;

    return codePoint >= 97 && codePoint <= 122;
};

/** Normalize a free-form identifier or label into lowercase word tokens. */
const splitIntoWords = (value: string): readonly string[] => {
    const words: string[] = [];
    let currentWord = "";

    for (let index = 0; index < value.length; index += 1) {
        const character = value[index];

        if (character === undefined) {
            continue;
        }

        if (!isAlphaNumericCharacter(character)) {
            if (currentWord.length > 0) {
                words.push(currentWord.toLowerCase());
                currentWord = "";
            }

            continue;
        }

        const previousCharacter = index > 0 ? value[index - 1] : undefined;
        const nextCharacter =
            index + 1 < value.length ? value[index + 1] : undefined;
        const startsNewWord =
            currentWord.length > 0 &&
            previousCharacter !== undefined &&
            ((isLowercaseCharacter(previousCharacter) &&
                isUppercaseCharacter(character)) ||
                (isUppercaseCharacter(previousCharacter) &&
                    isUppercaseCharacter(character) &&
                    nextCharacter !== undefined &&
                    isLowercaseCharacter(nextCharacter)));

        if (startsNewWord) {
            words.push(currentWord.toLowerCase());
            currentWord = character;

            continue;
        }

        currentWord += character;
    }

    if (currentWord.length > 0) {
        words.push(currentWord.toLowerCase());
    }

    return words;
};

/** Uppercase the first character of a normalized word token. */
const capitalizeWord = (word: string): string =>
    word.length === 0
        ? word
        : `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`;

/** Case-police dictionary match shape keyed by collapsed word tokens. */
type CasePoliceDictionaryMatch = {
    readonly canonical: string;
    readonly tokenCount: number;
};

/** Index case-police entries by collapsed key and track longest token span. */
const buildCasePoliceDictionaryIndex = (): {
    readonly matchesByCollapsedKey: ReadonlyMap<
        string,
        readonly CasePoliceDictionaryMatch[]
    >;
    readonly maxTokenSpan: number;
} => {
    const matchesByCollapsedKey = new Map<
        string,
        CasePoliceDictionaryMatch[]
    >();
    let maxTokenSpan = 1;

    for (const [dictionaryKey, canonical] of objectEntries(
        casePoliceDictionary
    )) {
        const keyWords = splitIntoWords(dictionaryKey);

        if (isEmpty(keyWords)) {
            continue;
        }

        const tokenCount = keyWords.length;
        const collapsedKey = arrayJoin(keyWords, "");
        const existingMatches = matchesByCollapsedKey.get(collapsedKey) ?? [];
        const isDuplicateMatch = existingMatches.some(
            (existingMatch) =>
                existingMatch.canonical === canonical &&
                existingMatch.tokenCount === tokenCount
        );

        if (!isDuplicateMatch) {
            existingMatches.push({
                canonical,
                tokenCount,
            });
            matchesByCollapsedKey.set(collapsedKey, existingMatches);
        }

        if (tokenCount > maxTokenSpan) {
            maxTokenSpan = tokenCount;
        }
    }

    return {
        matchesByCollapsedKey,
        maxTokenSpan,
    };
};

/** Precomputed case-police dictionary index used by Title/Train conversions. */
const casePoliceDictionaryIndex = buildCasePoliceDictionaryIndex();

/**
 * Resolve normalized words into title-style segments using the case-police
 * dictionary. Falls back to naive capitalization for unknown tokens.
 */
const resolveCasePoliceTitleSegments = (
    words: readonly string[]
): readonly string[] => {
    const segments: string[] = [];

    for (let index = 0; index < words.length; ) {
        const remainingWordCount = words.length - index;
        const maxSpan = Math.min(
            casePoliceDictionaryIndex.maxTokenSpan,
            remainingWordCount
        );

        let matched = false;

        for (let span = maxSpan; span >= 1; span -= 1) {
            const collapsedCandidate = arrayJoin(words
                .slice(index, index + span), "");
            const candidateMatches =
                casePoliceDictionaryIndex.matchesByCollapsedKey.get(
                    collapsedCandidate
                );

            if (candidateMatches === undefined) {
                continue;
            }

            const exactTokenCountMatch = candidateMatches.find(
                (candidateMatch) => candidateMatch.tokenCount === span
            );
            const selectedMatch = exactTokenCountMatch ?? arrayFirst(candidateMatches);

            if (selectedMatch === undefined) {
                continue;
            }

            segments.push(selectedMatch.canonical);
            index += span;
            matched = true;

            break;
        }

        if (matched) {
            continue;
        }

        const currentWord = words[index];

        if (currentWord === undefined) {
            index += 1;

            continue;
        }

        segments.push(capitalizeWord(currentWord));
        index += 1;
    }

    return segments;
};

/** Convert a value into the exact requested casing convention. */
export const convertToGithubActionsCasing = (
    value: string,
    casingKind: GithubActionsCasingKind
): string => {
    const words = splitIntoWords(value);
    const titleSegments = resolveCasePoliceTitleSegments(words);

    if (isEmpty(words)) {
        return value;
    }

    switch (casingKind) {
        case "camelCase": {
            const [firstWord = "", ...remainingWords] = words;

            return `${firstWord}${arrayJoin(remainingWords.map((word) => capitalizeWord(word)), "")}`;
        }

        case "kebab-case": {
            return arrayJoin(words, "-");
        }

        case "PascalCase": {
            return arrayJoin(words.map((word) => capitalizeWord(word)), "");
        }

        case "SCREAMING_SNAKE_CASE": {
            return arrayJoin(words.map((word) => word.toUpperCase()), "_");
        }

        case "snake_case": {
            return arrayJoin(words, "_");
        }

        case "Title Case": {
            return arrayJoin(titleSegments, " ");
        }

        case "Train-Case": {
            return arrayJoin(titleSegments
                .flatMap((segment) => stringSplit(segment, /\s+/u))
                .filter((segment) => segment.length > 0), "-");
        }

        default: {
            return value;
        }
    }
};

/** Determine whether a value already satisfies a requested casing convention. */
export const matchesGithubActionsCasing = (
    value: string,
    casingKind: GithubActionsCasingKind
): boolean => convertToGithubActionsCasing(value, casingKind) === value;
