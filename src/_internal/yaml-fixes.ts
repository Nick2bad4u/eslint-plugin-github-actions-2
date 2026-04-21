/**
 * @packageDocumentation
 * Shared range helpers for safe YAML/JSON text fixes.
 */

/** Determine whether a character is horizontal whitespace. */
import { arrayFirst } from "ts-extras";

const isHorizontalWhitespace = (character: string | undefined): boolean =>
    character === " " || character === "\t";

/** Determine whether a character is any whitespace. */
const isWhitespace = (character: string | undefined): boolean =>
    character === " " ||
    character === "\t" ||
    character === "\n" ||
    character === "\r";

/** Return the start index of the line containing the provided offset. */
const getLineStartIndex = (sourceText: string, offset: number): number => {
    const previousLineBreakIndex = sourceText.lastIndexOf(
        "\n",
        Math.max(0, offset - 1)
    );

    return previousLineBreakIndex === -1 ? 0 : previousLineBreakIndex + 1;
};

/** Return the end index of the line containing the provided offset. */
const getLineEndIndex = (sourceText: string, offset: number): number => {
    const nextLineBreakIndex = sourceText.indexOf("\n", offset);

    return nextLineBreakIndex === -1 ? sourceText.length : nextLineBreakIndex;
};

/** Read the indentation prefix of the line containing the provided offset. */
export const getLineIndentation = (
    sourceText: string,
    offset: number
): string => {
    const lineStart = getLineStartIndex(sourceText, offset);
    let index = lineStart;

    while (
        index < sourceText.length &&
        isHorizontalWhitespace(sourceText[index])
    ) {
        index += 1;
    }

    return sourceText.slice(lineStart, index);
};

/** Return the insertion point immediately after the line containing the offset. */
export const getIndexAfterLine = (
    sourceText: string,
    offset: number
): number => {
    const lineEnd = getLineEndIndex(sourceText, offset);

    return lineEnd === sourceText.length ? sourceText.length : lineEnd + 1;
};

/** Expand a node range to cover its entire containing line. */
export const getEnclosingLineRemovalRange = (
    sourceText: string,
    range: readonly [number, number]
): [number, number] => {
    const previousLineBreakIndex = sourceText.lastIndexOf(
        "\n",
        Math.max(0, arrayFirst(range) - 1)
    );
    const start =
        previousLineBreakIndex === -1 ? 0 : previousLineBreakIndex + 1;
    const nextLineBreakIndex = sourceText.indexOf("\n", range[1]);
    const end =
        nextLineBreakIndex === -1 ? sourceText.length : nextLineBreakIndex + 1;

    return [start, end];
};

/** Safely remove a flow-style sequence entry and its adjacent delimiter. */
export const getFlowSequenceEntryRemovalRange = (
    sourceText: string,
    range: readonly [number, number]
): [number, number] => {
    let start = arrayFirst(range);
    let end = range[1];

    while (start > 0 && isHorizontalWhitespace(sourceText[start - 1])) {
        start -= 1;
    }

    while (end < sourceText.length && isHorizontalWhitespace(sourceText[end])) {
        end += 1;
    }

    let nextIndex = end;

    while (
        nextIndex < sourceText.length &&
        isWhitespace(sourceText[nextIndex])
    ) {
        nextIndex += 1;
    }

    if (sourceText[nextIndex] === ",") {
        end = nextIndex + 1;

        while (
            end < sourceText.length &&
            isHorizontalWhitespace(sourceText[end])
        ) {
            end += 1;
        }

        return [start, end];
    }

    let previousIndex = start - 1;

    while (previousIndex >= 0 && isWhitespace(sourceText[previousIndex])) {
        previousIndex -= 1;
    }

    if (sourceText[previousIndex] === ",") {
        return [previousIndex, end];
    }

    return [start, end];
};
