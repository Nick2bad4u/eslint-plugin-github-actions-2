/**
 * @packageDocumentation
 * Shared ESLint runtime helpers for workflow-rule tests.
 */
import type { Linter } from "eslint";

import { ESLint } from "eslint";

import githubActionsPlugin from "../../src/plugin.js";

/** Lint a GitHub Actions workflow YAML snippet with the plugin under test. */
export const lintWorkflow = async (
    code: string,
    options: Readonly<{
        readonly configName?: keyof typeof githubActionsPlugin.configs;
        readonly filePath?: string;
        readonly rules?: NonNullable<Linter.Config["rules"]>;
    }> = {}
): Promise<ESLint.LintResult> => {
    const configName = options.configName ?? "all";
    const baseConfig = githubActionsPlugin.configs[configName];
    const eslint = new ESLint({
        fix: false,
        overrideConfig: [
            {
                ...baseConfig,
                rules: options.rules ?? baseConfig.rules,
            },
        ],
        overrideConfigFile: true,
    });
    const [result] = await eslint.lintText(code, {
        filePath: options.filePath ?? ".github/workflows/test.yml",
    });

    if (result === undefined) {
        throw new Error("Expected ESLint to return a lint result.");
    }

    return result;
};
