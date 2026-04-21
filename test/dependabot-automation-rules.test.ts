import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

const githubTokenExpression = `\${{ secrets.GITHUB_TOKEN }}`;
const pullRequestUrlExpression = `\${{ github.event.pull_request.html_url }}`;

const validDependabotAutomationWorkflow = [
    'name: "Dependabot Auto Label"',
    "on:",
    "  pull_request:",
    "    branches: [main]",
    "permissions:",
    "  contents: read",
    "  pull-requests: write",
    "  issues: write",
    "jobs:",
    "  dependabot:",
    "    if: github.event.pull_request.user.login == 'dependabot[bot]'",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd",
    "      - id: metadata",
    "        uses: dependabot/fetch-metadata@d7267f607e9d3fb96fc2fbe83e0af444713e90b7",
    "        with:",
    `          github-token: "${githubTokenExpression}"`,
    '      - run: gh pr edit "$PR_URL" --add-label "production"',
    "        env:",
    `          PR_URL: "${pullRequestUrlExpression}"`,
    `          GH_TOKEN: "${githubTokenExpression}"`,
].join("\n");

describe("dependabot automation workflow rules", () => {
    it("accepts a Dependabot automation workflow that follows the security conventions", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(validDependabotAutomationWorkflow, {
            configName: "security",
            filePath: ".github/workflows/dependabot-auto-label.yml",
        });

        expect(result.messages).toHaveLength(0);
    });

    it("requires a Dependabot bot actor guard and pull_request trigger", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                'name: "Dependabot Auto Label"',
                "on: [workflow_dispatch]",
                "permissions:",
                "  pull-requests: write",
                "  issues: write",
                "jobs:",
                "  dependabot:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: dependabot/fetch-metadata@v2",
                "        with:",
                `          github-token: "${githubTokenExpression}"`,
            ].join("\n"),
            {
                filePath: ".github/workflows/dependabot-auto-label.yml",
                rules: {
                    "github-actions/require-dependabot-automation-pull-request-trigger":
                        "error",
                    "github-actions/require-dependabot-bot-actor-guard":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(2);
    });

    it("requires fetch-metadata github-token and minimum automation permissions", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                'name: "Dependabot Auto Label"',
                "on: [pull_request]",
                "permissions:",
                "  contents: read",
                "jobs:",
                "  dependabot:",
                "    if: github.event.pull_request.user.login == 'dependabot[bot]'",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: dependabot/fetch-metadata@v2",
                '      - run: gh pr edit "$PR_URL" --add-label "production"',
            ].join("\n"),
            {
                filePath: ".github/workflows/dependabot-auto-label.yml",
                rules: {
                    "github-actions/require-dependabot-automation-permissions":
                        "error",
                    "github-actions/require-fetch-metadata-github-token":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(3);
    });
});
