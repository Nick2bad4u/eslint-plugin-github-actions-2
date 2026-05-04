import nick2bad4u from "eslint-config-nick2bad4u";

import githubActions from "./plugin.mjs";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nick2bad4u.configs.withoutGithubActions2,

    // Local Plugin Config
    // This lets us use the plugin's rules in this repository without needing to publish the plugin first.
    {
        files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
        name: "Local GitHub Actions",
        plugins: {
            "github-actions": githubActions,
        },
        rules: {
            // @ts-expect-error -- plugin.mjs is typed as generic ESLint.Plugin.
            ...githubActions.configs.all.rules,
        },
    },
    // Add repository-specific config entries below as needed.
];

export default config;
