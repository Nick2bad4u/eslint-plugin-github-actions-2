import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

import type { LoadContext, Plugin, PluginModule } from "@docusaurus/types";

const require = createRequire(import.meta.url);

type PackageJson = {
    readonly exports?: unknown;
    readonly main?: unknown;
    readonly module?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const getStringProperty = (
    record: Record<string, unknown>,
    key: string
): string | undefined => {
    const value = record[key];

    return typeof value === "string" ? value : undefined;
};

const findPackageRoot = (entryPath: string): string | undefined => {
    let currentDirectory = dirname(entryPath);

    while (true) {
        const packageJsonPath = resolve(currentDirectory, "package.json");

        if (existsSync(packageJsonPath)) {
            return currentDirectory;
        }

        const parentDirectory = dirname(currentDirectory);

        if (parentDirectory === currentDirectory) {
            return undefined;
        }

        currentDirectory = parentDirectory;
    }
};

const resolvePackageRoot = (packageName: string): string | undefined => {
    try {
        return findPackageRoot(require.resolve(packageName));
    } catch {
        return undefined;
    }
};

const readPackageJson = (packageRoot: string): PackageJson | undefined => {
    const packageJsonPath = resolve(packageRoot, "package.json");
    const packageJsonText = readFileSync(packageJsonPath, "utf8");
    const packageJsonValue: unknown = JSON.parse(packageJsonText);

    return isRecord(packageJsonValue) ? packageJsonValue : undefined;
};

const resolvePackageRelativeEntry = (
    packageRoot: string,
    entryPath: string
): string | undefined => {
    const resolvedEntryPath = resolve(packageRoot, entryPath);

    return existsSync(resolvedEntryPath) ? resolvedEntryPath : undefined;
};

const resolveExportsEntry = (packageJson: PackageJson): string | undefined => {
    const exportsField = packageJson.exports;

    if (!isRecord(exportsField)) {
        return undefined;
    }

    const rootExport = exportsField["."];

    if (typeof rootExport === "string") {
        return rootExport;
    }

    if (!isRecord(rootExport)) {
        return undefined;
    }

    return (
        getStringProperty(rootExport, "browser") ??
        getStringProperty(rootExport, "import") ??
        getStringProperty(rootExport, "default")
    );
};

const resolvePreferredEntry = (packageName: string): string | undefined => {
    const packageRoot = resolvePackageRoot(packageName);

    if (packageRoot === undefined) {
        return undefined;
    }

    const packageJson = readPackageJson(packageRoot);

    if (packageJson === undefined) {
        return undefined;
    }

    const preferredEntry =
        resolveExportsEntry(packageJson) ??
        (typeof packageJson.module === "string"
            ? packageJson.module
            : undefined) ??
        (typeof packageJson.main === "string" ? packageJson.main : undefined);

    return preferredEntry === undefined
        ? undefined
        : resolvePackageRelativeEntry(packageRoot, preferredEntry);
};

const vscodeCssLanguageServiceEsmEntry = resolvePreferredEntry(
    "vscode-css-languageservice"
);
const vscodeLanguageServerTypesEsmEntry = resolvePreferredEntry(
    "vscode-languageserver-types"
);

/**
 * Docusaurus plugin that aliases known ESM package entries and suppresses the
 * corresponding webpack UMD warning noise.
 */
export const suppressKnownWebpackWarningsPlugin: PluginModule = (
    _context: LoadContext,
    _options: unknown
): Plugin | null => {
    const alias: Record<string, string> = {};

    if (vscodeCssLanguageServiceEsmEntry !== undefined) {
        alias["vscode-css-languageservice$"] = vscodeCssLanguageServiceEsmEntry;
    }

    if (vscodeLanguageServerTypesEsmEntry !== undefined) {
        alias["vscode-languageserver-types$"] =
            vscodeLanguageServerTypesEsmEntry;
        alias["vscode-languageserver-types/lib/umd/main.js$"] =
            vscodeLanguageServerTypesEsmEntry;
    }

    if (Object.keys(alias).length === 0) {
        return null;
    }

    return {
        configureWebpack() {
            return {
                ...(vscodeLanguageServerTypesEsmEntry === undefined
                    ? {}
                    : {
                          ignoreWarnings: [
                              {
                                  message:
                                      /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/u,
                                  module: /vscode-languageserver-types[\\/]lib[\\/]umd[\\/]main\.js/u,
                              },
                          ],
                      }),
                resolve: {
                    alias,
                },
            };
        },
        name: "suppress-known-webpack-warnings",
    };
};
