/**
 * @packageDocumentation
 * Shared helpers for extracting GitHub Actions `${{ ... }}` expressions.
 */

/** Determine whether a character can begin a GitHub expression identifier. */
const isIdentifierStart = (character: string | undefined): boolean => {
    if (character === undefined) {
        return false;
    }

    return /[A-Z_a-z]/u.test(character);
};

/** Determine whether a character can continue a GitHub expression identifier. */
const isIdentifierContinue = (character: string | undefined): boolean => {
    if (character === undefined) {
        return false;
    }

    return /[\w-]/u.test(character);
};

/** Known root context names available in GitHub Actions expressions. */
const knownContextRoots: ReadonlySet<string> = new Set([
    "env",
    "github",
    "inputs",
    "job",
    "jobs",
    "matrix",
    "needs",
    "runner",
    "secrets",
    "steps",
    "strategy",
    "vars",
]);

/** Extract every embedded GitHub expression body from a scalar value. */
export const getGithubExpressionBodies = (value: string): readonly string[] => {
    const expressions: string[] = [];
    let searchStart = 0;

    while (searchStart < value.length) {
        const startOffset = value.indexOf("${{", searchStart);

        if (startOffset === -1) {
            break;
        }

        const endOffset = value.indexOf("}}", startOffset + 3);

        if (endOffset === -1) {
            break;
        }

        const expression = value.slice(startOffset + 3, endOffset).trim();

        if (expression.length > 0) {
            expressions.push(expression);
        }

        searchStart = endOffset + 2;
    }

    return expressions;
};

/** Collect referenced root contexts from embedded GitHub expressions. */
export const getReferencedContextRoots = (value: string): readonly string[] => {
    const roots = new Set<string>();

    for (const expression of getGithubExpressionBodies(value)) {
        let index = 0;

        while (index < expression.length) {
            const character = expression[index];
            const previousCharacter = expression[index - 1];

            if (
                !isIdentifierStart(character) ||
                isIdentifierContinue(previousCharacter)
            ) {
                index += 1;

                continue;
            }

            let endOffset = index + 1;

            while (isIdentifierContinue(expression[endOffset])) {
                endOffset += 1;
            }

            const token = expression.slice(index, endOffset);
            const nextChar = expression[endOffset];

            if (nextChar !== "." && nextChar !== "[") {
                index = endOffset;

                continue;
            }

            const normalizedToken = token.toLowerCase();

            if (knownContextRoots.has(normalizedToken)) {
                roots.add(normalizedToken);
            }

            index = endOffset;
        }
    }

    return [...roots];
};
