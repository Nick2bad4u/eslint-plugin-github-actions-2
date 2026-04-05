import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const typedocPackageJsonPath = require.resolve("typedoc/package.json");
const typedocCliPath = resolve(
    dirname(typedocPackageJsonPath),
    "bin",
    "typedoc"
);

/**
 * Parse a `--config FILE` (or `--options FILE`) argument from CLI args.
 *
 * @param {readonly string[]} cliArgs - Raw process arguments after the script
 *   path.
 *
 * @returns {string} TypeDoc options file name to pass to `typedoc --options`.
 */
function getConfigFileName(cliArgs) {
    for (let index = 0; index < cliArgs.length; index += 1) {
        const argument = cliArgs[index];
        if (argument !== "--config" && argument !== "--options") {
            continue;
        }

        const nextIndex = index + 1;
        if (nextIndex >= cliArgs.length) {
            throw new Error(`Missing value for CLI argument: ${argument}`);
        }

        const nextValue = cliArgs[nextIndex];
        if (typeof nextValue !== "string" || nextValue.length === 0) {
            throw new Error(`Missing value for CLI argument: ${argument}`);
        }

        return nextValue;
    }

    return "typedoc.config.json";
}

/**
 * Resolve the nearest hoisted/local TypeDoc CLI executable by walking up from
 * cwd.
 *
 * @param {string} cwd - Starting directory for lookup.
 *
 * @returns {string} Path to a TypeDoc CLI script.
 */
function resolveTypedocCliFromCwd(cwd) {
    let currentPath = cwd;

    while (true) {
        const candidatePath = resolve(
            currentPath,
            "node_modules",
            "typedoc",
            "bin",
            "typedoc"
        );

        if (existsSync(candidatePath)) {
            return candidatePath;
        }

        const parentPath = dirname(currentPath);

        if (parentPath === currentPath) {
            break;
        }

        currentPath = parentPath;
    }

    return typedocCliPath;
}

/**
 * Execute TypeDoc with the provided options file in a specific working
 * directory.
 *
 * @param {string} cwd - Working directory for the TypeDoc process.
 * @param {string} configFile - TypeDoc options file to pass to `--options`.
 */
function runTypedoc(cwd, configFile) {
    const resolvedTypedocCliPath = resolveTypedocCliFromCwd(cwd);

    execFileSync(
        process.execPath,
        [
            resolvedTypedocCliPath,
            "--options",
            configFile,
        ],
        {
            cwd,
            stdio: "inherit",
        }
    );
}

const mdxEscapeMap = Object.freeze({
    "<": "&lt;",
    ">": "&gt;",
    "{": "&#123;",
    "}": "&#125;",
});

const hasMdxUnsafeCharacterPattern = /[<>{}]/u;
const mdxUnsafeCharacterPattern = /[<>{}]/gu;
const typedocRelativeIndexMarkdownLinkPattern =
    /\]\(((?:\.\.\/|\.\/)[^)#\s]*?)\/index\.md((?:#[^)]+)?)\)/gu;
const typedocRelativeMarkdownLinkPattern =
    /\]\(((?:\.\.\/|\.\/)[^)#\s]+?)\.md((?:#[^)]+)?)\)/gu;
const typedocSidebarIdPrefixPattern = /id:"\.\.\/site-docs\//gu;

/**
 * Parse a fenced-code marker from a trimmed markdown line.
 *
 * @param {string} trimmedLine - Markdown line with leading whitespace removed.
 *
 * @returns {{ length: number; marker: "`" | "~" } | null}
 */
function parseFenceMarker(trimmedLine) {
    const firstCharacter = trimmedLine[0];

    if (firstCharacter !== "`" && firstCharacter !== "~") {
        return null;
    }

    let markerLength = 0;

    while (trimmedLine[markerLength] === firstCharacter) {
        markerLength += 1;
    }

    if (markerLength < 3) {
        return null;
    }

    return {
        length: markerLength,
        marker: firstCharacter,
    };
}

/**
 * Escape MDX-unsafe characters outside fenced code blocks.
 *
 * @param {string} markdownText - Markdown file contents.
 *
 * @returns {string} MDX-safe markdown text.
 */
function sanitizeMarkdownForMdx(markdownText) {
    const lines = markdownText.split(/\r?\n/u);
    /** @type {{ length: number; marker: "`" | "~" } | null} */
    let activeFence = null;

    const sanitizedLines = lines.map((line) => {
        const trimmedLine = line.trimStart();
        const fenceMarker = parseFenceMarker(trimmedLine);

        if (activeFence === null && fenceMarker !== null) {
            activeFence = fenceMarker;
            return line;
        }

        if (
            activeFence !== null &&
            fenceMarker !== null &&
            fenceMarker.marker === activeFence.marker &&
            fenceMarker.length >= activeFence.length
        ) {
            activeFence = null;
            return line;
        }

        if (activeFence !== null || !hasMdxUnsafeCharacterPattern.test(line)) {
            return line;
        }

        return line.replace(
            mdxUnsafeCharacterPattern,
            (character) =>
                mdxEscapeMap[
                    /** @type {keyof typeof mdxEscapeMap} */ (character)
                ] ?? character
        );
    });

    const hasTrailingLineBreak = /\r?\n$/u.test(markdownText);
    const nextContent = sanitizedLines.join("\n");

    return hasTrailingLineBreak ? `${nextContent}\n` : nextContent;
}

/**
 * Rewrite relative markdown links in generated TypeDoc output to Docusaurus doc
 * routes.
 *
 * @param {string} markdownText - Generated markdown file contents.
 *
 * @returns {string} Markdown with relative `.md` links normalized.
 */
function normalizeTypedocMarkdownLinks(markdownText) {
    return markdownText
        .replace(
            typedocRelativeIndexMarkdownLinkPattern,
            (_, targetPath, hashSuffix = "") => `](${targetPath}/${hashSuffix})`
        )
        .replace(
            typedocRelativeMarkdownLinkPattern,
            (_, targetPath, hashSuffix = "") => `](${targetPath}${hashSuffix})`
        );
}

/**
 * Recursively collect markdown files under a directory.
 *
 * @param {string} directoryPath - Root directory.
 *
 * @returns {readonly string[]} Absolute markdown file paths.
 */
function getMarkdownFilePaths(directoryPath) {
    const filePaths = [];

    for (const entry of readdirSync(directoryPath, { withFileTypes: true })) {
        const entryPath = resolve(directoryPath, entry.name);

        if (entry.isDirectory()) {
            filePaths.push(...getMarkdownFilePaths(entryPath));
            continue;
        }

        if (entry.isFile() && entry.name.endsWith(".md")) {
            filePaths.push(entryPath);
        }
    }

    return filePaths;
}

/**
 * Sanitize generated TypeDoc markdown output to avoid MDX parse errors in
 * Docusaurus.
 *
 * @param {string} outputDirectoryPath - Absolute TypeDoc output directory.
 */
function sanitizeTypedocMarkdownOutput(outputDirectoryPath) {
    if (!existsSync(outputDirectoryPath)) {
        return;
    }

    for (const markdownFilePath of getMarkdownFilePaths(outputDirectoryPath)) {
        const previousContent = readFileSync(markdownFilePath, "utf8");
        const nextContent = sanitizeMarkdownForMdx(
            normalizeTypedocMarkdownLinks(previousContent)
        );

        if (nextContent === previousContent) {
            continue;
        }

        writeFileSync(markdownFilePath, nextContent, "utf8");
    }
}

/**
 * Normalize generated TypeDoc sidebar IDs for Docusaurus docs ids.
 *
 * The generated sidebar may include ids prefixed with `../site-docs/`, while
 * Docusaurus docs ids are rooted from `site-docs` (for example,
 * `developer/api/index`).
 *
 * @param {string} outputDirectoryPath - Absolute TypeDoc output directory.
 */
function sanitizeTypedocSidebar(outputDirectoryPath) {
    const typedocSidebarPath = resolve(
        outputDirectoryPath,
        "typedoc-sidebar.cjs"
    );

    if (!existsSync(typedocSidebarPath)) {
        return;
    }

    const previousContent = readFileSync(typedocSidebarPath, "utf8");
    const nextContent = previousContent.replace(
        typedocSidebarIdPrefixPattern,
        'id:"'
    );

    if (nextContent === previousContent) {
        return;
    }

    writeFileSync(typedocSidebarPath, nextContent, "utf8");
}

/**
 * Normalize a filesystem path to a forward-slash docs-relative path.
 *
 * @param {string} fromPath - Base directory used for the relative path.
 * @param {string} toPath - Destination path to normalize.
 *
 * @returns {string} Forward-slash relative path.
 */
function toDocsRelativePath(fromPath, toPath) {
    return relative(fromPath, toPath).replaceAll("\\", "/");
}

/**
 * Build a simple generated index page for a TypeDoc output subdirectory.
 *
 * @param {{
 *     childDirectoryLinks: readonly string[];
 *     childMarkdownLinks: readonly string[];
 *     directoryPath: string;
 *     outputDirectoryPath: string;
 * }} options
 *   - Index-generation inputs.
 *
 * @returns {string} Markdown contents for the synthetic index page.
 */
function buildSyntheticTypedocIndexMarkdown({
    childDirectoryLinks,
    childMarkdownLinks,
    directoryPath,
    outputDirectoryPath,
}) {
    const relativeDirectoryPath = toDocsRelativePath(
        outputDirectoryPath,
        directoryPath
    );
    const lines = [
        `# \`${relativeDirectoryPath}\``,
        "",
        "Synthetic index generated after TypeDoc so Docusaurus has a stable landing page for this API section.",
        "",
    ];

    if (childDirectoryLinks.length > 0) {
        lines.push("## Sections", "", ...childDirectoryLinks, "");
    }

    if (childMarkdownLinks.length > 0) {
        lines.push("## Members", "", ...childMarkdownLinks, "");
    }

    return `${lines.join("\n")}\n`;
}

/**
 * Recursively synthesize missing TypeDoc index pages for documented folders.
 *
 * @param {string} directoryPath - Directory to inspect recursively.
 * @param {string} outputDirectoryPath - Root TypeDoc output directory.
 */
function synthesizeMissingTypedocIndexes(directoryPath, outputDirectoryPath) {
    const childEntries = readdirSync(directoryPath, { withFileTypes: true });

    for (const entry of childEntries) {
        if (!entry.isDirectory()) {
            continue;
        }

        synthesizeMissingTypedocIndexes(
            resolve(directoryPath, entry.name),
            outputDirectoryPath
        );
    }

    const markdownChildren = childEntries
        .filter(
            (entry) =>
                entry.isFile() &&
                entry.name.endsWith(".md") &&
                entry.name !== "index.md"
        )
        .map((entry) => entry.name)
        .sort();
    const childDirectoriesWithIndex = childEntries
        .filter(
            (entry) =>
                entry.isDirectory() &&
                existsSync(resolve(directoryPath, entry.name, "index.md"))
        )
        .map((entry) => entry.name)
        .sort();
    const indexPath = resolve(directoryPath, "index.md");

    if (
        existsSync(indexPath) ||
        (markdownChildren.length === 0 &&
            childDirectoriesWithIndex.length === 0)
    ) {
        return;
    }

    const childDirectoryLinks = childDirectoriesWithIndex.map(
        (directoryName) => `- [\`${directoryName}\`](./${directoryName}/)`
    );
    const childMarkdownLinks = markdownChildren.map(
        (fileName) =>
            `- [\`${fileName.slice(0, -3)}\`](./${fileName.slice(0, -3)})`
    );
    const indexMarkdown = buildSyntheticTypedocIndexMarkdown({
        childDirectoryLinks,
        childMarkdownLinks,
        directoryPath,
        outputDirectoryPath,
    });

    writeFileSync(indexPath, indexMarkdown, "utf8");
}

/**
 * Pick an unused drive letter suitable for a temporary `subst` mapping.
 *
 * @returns {string} Drive letter (without colon).
 */
function getTemporaryDriveLetter() {
    const candidateLetters = [
        "Z",
        "Y",
        "X",
        "W",
        "V",
        "U",
        "T",
        "S",
        "R",
    ];

    for (const letter of candidateLetters) {
        if (!existsSync(`${letter}:\\`)) {
            return letter;
        }
    }

    throw new Error(
        "No free temporary drive letter was found for TypeDoc subst mapping."
    );
}

/**
 * Run TypeDoc from a temporary subst drive to avoid escaped-parentheses path
 * bugs on Windows.
 *
 * @param {string} repositoryRoot - Absolute repository root directory.
 * @param {string} docsWorkspaceRelativePath - Docs workspace relative path from
 *   the repository root.
 * @param {string} configFile - TypeDoc options file name to use.
 */
function runViaTemporaryDrive(
    repositoryRoot,
    docsWorkspaceRelativePath,
    configFile
) {
    const driveLetter = getTemporaryDriveLetter();
    const driveRoot = `${driveLetter}:`;

    execFileSync("subst", [driveRoot, repositoryRoot], {
        stdio: "ignore",
    });

    try {
        const mappedDocsWorkspaceDirectory = resolve(
            `${driveRoot}\\`,
            docsWorkspaceRelativePath
        );
        runTypedoc(mappedDocsWorkspaceDirectory, configFile);
    } finally {
        execFileSync("subst", [driveRoot, "/d"], {
            stdio: "ignore",
        });
    }
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");
const docsWorkspaceDirectory = resolve(repositoryRoot, "docs", "docusaurus");
const docsWorkspaceRelativePath = relative(
    repositoryRoot,
    docsWorkspaceDirectory
);
const typedocOutputDirectory = resolve(
    docsWorkspaceDirectory,
    "site-docs",
    "developer",
    "api"
);
const configFile = getConfigFileName(process.argv.slice(2));

if (process.platform === "win32" && /[()]/u.test(repositoryRoot)) {
    runViaTemporaryDrive(repositoryRoot, docsWorkspaceRelativePath, configFile);
} else {
    runTypedoc(docsWorkspaceDirectory, configFile);
}

sanitizeTypedocMarkdownOutput(typedocOutputDirectory);
sanitizeTypedocSidebar(typedocOutputDirectory);
synthesizeMissingTypedocIndexes(typedocOutputDirectory, typedocOutputDirectory);
