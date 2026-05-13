import nickTwoBadFourU from "eslint-config-nick2bad4u";

import plugin from "./plugin.mjs";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nickTwoBadFourU.configs.withoutGithubActions2,

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
