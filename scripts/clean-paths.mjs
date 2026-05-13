/**
 * Remove files/directories and glob matches using modern Node.js APIs.
 */
import { glob, rm } from "node:fs/promises";

/**
 * @param {string} value
 */
const hasGlobSyntax = (value) =>
    value.includes("*") ||
    value.includes("?") ||
    value.includes("[") ||
    value.includes("]") ||
    value.includes("{") ||
    value.includes("}");

/**
 * @param {string} path
 */
const removePath = async (path) => {
    await rm(path, {
        force: true,
        maxRetries: 3,
        recursive: true,
        retryDelay: 100,
    });
};

const patterns = process.argv.slice(2);

for (const pattern of patterns) {
    let hadMatch = false;

    for await (const matchedPath of glob(pattern)) {
        hadMatch = true;
        await removePath(matchedPath);
    }

    if (!hadMatch && !hasGlobSyntax(pattern)) {
        await removePath(pattern);
    }
}
