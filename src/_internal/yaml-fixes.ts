/**
 * @packageDocumentation
 * Shared range helpers for safe YAML/JSON text fixes.
 */

/** Determine whether a character is horizontal whitespace. */
const isHorizontalWhitespace = (character: string | undefined): boolean =>
    character === " " || character === "\t";

/** Determine whether a character is any whitespace. */
const isWhitespace = (character: string | undefined): boolean =>
    character === " " ||
    character === "\t" ||
    character === "\n" ||
    character === "\r";

/** Expand a node range to cover its entire containing line. */
export const getEnclosingLineRemovalRange = (
    sourceText: string,
    range: readonly [number, number]
): [number, number] => {
    const previousLineBreakIndex = sourceText.lastIndexOf(
        "\n",
        Math.max(0, range[0] - 1)
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
    let start = range[0];
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
