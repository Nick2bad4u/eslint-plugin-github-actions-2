import { createConfig } from "eslint-config-nick2bad4u";
import * as nodePath from "node:path";
import { fileURLToPath } from "node:url";

import plugin from "./plugin.mjs";

const rootDirectory = nodePath.dirname(fileURLToPath(import.meta.url));

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...createConfig({
        allowDefaultProjectFilePatterns: ["*.{js,mjs,cjs}", ".*.{js,mjs,cjs}"],
        plugins: {
            "github-actions": false,
            "test-signal": false,
        },
        rootDirectory,
    }),

    {
        ignores: ["docs/docusaurus/typedoc-plugins/*.mjs"],
        name: "Local ignored generated TypeDoc plugin JavaScript",
    },

    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
        name: "Local lint policy",
        rules: {
            complexity: "off",
            "import-x/max-dependencies": "off",
            "no-duplicate-imports": "off",
            "unicorn/consistent-boolean-name": "off",
            "unicorn/import-style": "off",
            "unicorn/no-break-in-nested-loop": "off",
            "unicorn/no-unnecessary-splice": "off",
            "unicorn/no-unreadable-for-of-expression": "off",
            "unicorn/no-unsafe-string-replacement": "off",
            "unicorn/prefer-import-meta-properties": "off",
            "unicorn/prefer-includes-over-repeated-comparisons": "off",
            "unicorn/prefer-number-coercion": "off",
            "unicorn/prefer-short-arrow-method": "off",
        },
    },

    {
        files: ["test/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
        name: "Local test lint policy",
        rules: {
            "max-lines-per-function": "off",
        },
    },

    {
        files: [
            "*.config.{js,mjs,cjs,ts,mts,cts}",
            ".*rc.{js,mjs,cjs,ts,mts,cts}",
            "stryker.config.mjs",
        ],
        name: "Local config-file lint policy",
        rules: {
            "@typescript-eslint/dot-notation": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
        },
    },

    {
        files: ["docs/docusaurus/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
        name: "Local Docusaurus lint policy",
        rules: {
            "@typescript-eslint/array-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/prefer-readonly-parameter-types": "off",
            "@typescript-eslint/restrict-template-expressions": "off",
            "canonical/filename-no-index": "off",
            "n/no-process-env": "off",
            "n/no-sync": "off",
            "n/no-unsupported-features/node-builtins": "off",
            "perfectionist/sort-modules": "off",
            "regexp/require-unicode-sets-regexp": "off",
            "security/detect-non-literal-fs-filename": "off",
            "unicorn/filename-case": "off",
            "unicorn/no-array-callback-reference": "off",
            "unicorn/no-array-sort": "off",
            "unicorn/no-non-function-verb-prefix": "off",
            "unicorn/no-unreadable-new-expression": "off",
            "unicorn/prefer-continue": "off",
            "unicorn/prefer-module": "off",
            "unicorn/prefer-temporal": "off",
        },
    },

    // TypeDoc creates these API targets during the dedicated documentation gate.
    {
        files: [
            "docs/docusaurus/site-docs/developer/index.md",
            "docs/docusaurus/site-docs/index.md",
        ],
        name: "Generated API Link Validation Boundary",
        rules: {
            "remark/remark": "off",
        },
    },

    {
        files: [".ncurc.json", "docs/docusaurus/static/manifest.json"],
        name: "Local JSON schema lint policy",
        rules: {
            "json-schema-validator-2/no-invalid": "off",
        },
    },

    // Local Plugin Config
    // This lets us use the plugin's rules in this repository without needing to publish the plugin first.
    {
        files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
        name: "Local GitHub Actions",
        plugins: {
            "github-actions": plugin,
        },
        rules: {
            ...plugin.configs.all.rules,
        },
    },
    // Add repository-specific config entries below as needed.
];

export default config;
