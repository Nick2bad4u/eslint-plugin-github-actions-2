/**
 * @packageDocumentation
 * Workflow display-name title casing helpers.
 */
import {
    arrayFirst,
    arrayJoin,
    isDefined,
    isEmpty,
    objectEntries,
    setHas,
} from "ts-extras";

import { casePoliceDictionary } from "./case-police-dictionary.js";

/** Common short words that stay lowercase inside title-style names. */
const titleCaseSmallWords: ReadonlySet<string> = new Set([
    "a",
    "an",
    "and",
    "as",
    "at",
    "but",
    "by",
    "for",
    "from",
    "in",
    "into",
    "nor",
    "of",
    "on",
    "onto",
    "or",
    "per",
    "the",
    "to",
    "via",
    "vs",
    "with",
]);

/** Workflow-domain acronym overrides missing from the generic dictionary. */
const workflowTitleCaseDictionary: Readonly<Record<string, string>> = {
    ...casePoliceDictionary,
    ai: "AI",
    cd: "CD",
    ci: "CI",
};

interface CaseDictionaryMatch {
    readonly canonical: string;
    readonly tokenCount: number;
}

type TitleCaseToken =
    | {
          readonly kind: "symbol";
          readonly value: string;
      }
    | {
          readonly kind: "word";
          readonly value: string;
      };

const isAlphaNumericCharacter = (character: string): boolean => {
    const codePoint = character.codePointAt(0) ?? -1;

    return (
        (codePoint >= 48 && codePoint <= 57) ||
        (codePoint >= 65 && codePoint <= 90) ||
        (codePoint >= 97 && codePoint <= 122)
    );
};

const isUppercaseCharacter = (character: string): boolean => {
    const codePoint = character.codePointAt(0) ?? -1;

    return codePoint >= 65 && codePoint <= 90;
};

const isLowercaseCharacter = (character: string): boolean => {
    const codePoint = character.codePointAt(0) ?? -1;

    return codePoint >= 97 && codePoint <= 122;
};

const splitIntoTitleCaseTokens = (value: string): readonly TitleCaseToken[] => {
    const tokens: TitleCaseToken[] = [];
    let currentWord = "";

    const flushCurrentWord = (): void => {
        if (currentWord.length === 0) {
            return;
        }

        tokens.push({
            kind: "word",
            value: currentWord.toLowerCase(),
        });
        currentWord = "";
    };

    for (let index = 0; index < value.length; index += 1) {
        const character = value[index];

        if (!isDefined(character)) {
            continue;
        }

        if (!isAlphaNumericCharacter(character)) {
            flushCurrentWord();

            if (character === "&") {
                tokens.push({
                    kind: "symbol",
                    value: character,
                });
            }

            continue;
        }

        const previousCharacter = index > 0 ? value[index - 1] : undefined;
        const nextCharacter =
            index + 1 < value.length ? value[index + 1] : undefined;
        const isStartsNewWord =
            currentWord.length > 0 &&
            isDefined(previousCharacter) &&
            ((isLowercaseCharacter(previousCharacter) &&
                isUppercaseCharacter(character)) ||
                (isUppercaseCharacter(previousCharacter) &&
                    isUppercaseCharacter(character) &&
                    isDefined(nextCharacter) &&
                    isLowercaseCharacter(nextCharacter)));

        if (isStartsNewWord) {
            flushCurrentWord();
        }

        currentWord += character;
    }

    flushCurrentWord();

    return tokens;
};

const splitDictionaryKeyIntoWords = (value: string): readonly string[] =>
    splitIntoTitleCaseTokens(value)
        .filter((token) => token.kind === "word")
        .map((token) => token.value);

const capitalizeWord = (word: string): string =>
    word.length === 0
        ? word
        : `${word.at(0)?.toUpperCase() ?? ""}${word.slice(1)}`;

const buildCaseDictionaryIndex = (): {
    readonly matchesByCollapsedKey: ReadonlyMap<
        string,
        readonly CaseDictionaryMatch[]
    >;
    readonly maxTokenSpan: number;
} => {
    const matchesByCollapsedKey = new Map<string, CaseDictionaryMatch[]>();
    let maxTokenSpan = 1;

    for (const [dictionaryKey, canonical] of objectEntries(
        workflowTitleCaseDictionary
    )) {
        const keyWords = splitDictionaryKeyIntoWords(dictionaryKey);

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

const caseDictionaryIndex = buildCaseDictionaryIndex();

const resolveTitleSegments = (
    words: readonly string[],
    startWordIndex: number,
    totalWordCount: number
): readonly string[] => {
    const segments: string[] = [];

    for (let index = 0; index < words.length; ) {
        const remainingWordCount = words.length - index;
        const maxSpan = Math.min(
            caseDictionaryIndex.maxTokenSpan,
            remainingWordCount
        );
        let isMatched = false;

        for (let span = maxSpan; span >= 1; span -= 1) {
            const collapsedCandidate = arrayJoin(
                words.slice(index, index + span),
                ""
            );
            const candidateMatches =
                caseDictionaryIndex.matchesByCollapsedKey.get(
                    collapsedCandidate
                );

            if (!isDefined(candidateMatches)) {
                continue;
            }

            const exactTokenCountMatch = candidateMatches.find(
                (candidateMatch) => candidateMatch.tokenCount === span
            );
            const selectedMatch =
                exactTokenCountMatch ?? arrayFirst(candidateMatches);

            if (!isDefined(selectedMatch)) {
                continue;
            }

            segments.push(selectedMatch.canonical);
            index += span;
            isMatched = true;

            break;
        }

        if (isMatched) {
            continue;
        }

        const currentWord = words[index];

        if (!isDefined(currentWord)) {
            index += 1;

            continue;
        }

        const absoluteWordIndex = startWordIndex + index;

        segments.push(
            setHas(titleCaseSmallWords, currentWord) &&
                absoluteWordIndex > 0 &&
                absoluteWordIndex < totalWordCount - 1
                ? currentWord
                : capitalizeWord(currentWord)
        );
        index += 1;
    }

    return segments;
};

/** Convert a workflow display name to title case while preserving `&`. */
export const convertWorkflowNameToTitleCase = (value: string): string => {
    const tokens = splitIntoTitleCaseTokens(value);
    const totalWordCount = tokens.filter(
        (token) => token.kind === "word"
    ).length;
    const segments: string[] = [];
    let currentWordRun: string[] = [];
    let consumedWordCount = 0;

    const flushCurrentWordRun = (): void => {
        if (isEmpty(currentWordRun)) {
            return;
        }

        segments.push(
            ...resolveTitleSegments(
                currentWordRun,
                consumedWordCount,
                totalWordCount
            )
        );
        consumedWordCount += currentWordRun.length;
        currentWordRun = [];
    };

    for (const token of tokens) {
        if (token.kind === "word") {
            currentWordRun.push(token.value);
            continue;
        }

        flushCurrentWordRun();
        segments.push(token.value);
    }

    flushCurrentWordRun();

    return isEmpty(segments) ? value : arrayJoin(segments, " ");
};
