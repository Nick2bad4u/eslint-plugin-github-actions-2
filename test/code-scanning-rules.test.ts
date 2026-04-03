import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

const matrixLanguageExpression = `\${{ matrix.language }}`;

const validCodeqlWorkflow = [
    'name: "CodeQL"',
    "on:",
    "  push:",
    "    branches: [main]",
    "  pull_request:",
    "    branches: [main]",
    "  schedule:",
    '    - cron: "0 0 * * 1"',
    "permissions:",
    "  contents: read",
    "jobs:",
    "  analyze:",
    "    runs-on: ubuntu-latest",
    "    permissions:",
    "      actions: read",
    "      contents: read",
    "      security-events: write",
    "    strategy:",
    "      matrix:",
    '        language: ["javascript-typescript"]',
    "    steps:",
    "      - uses: actions/checkout@v6",
    "      - uses: github/codeql-action/init@v4",
    "        with:",
    `          languages: ${matrixLanguageExpression}`,
    "      - uses: github/codeql-action/analyze@v4",
    "        with:",
    `          category: "/language:${matrixLanguageExpression}"`,
].join("\n");

const validScorecardWorkflow = [
    'name: "Scorecard"',
    "on:",
    "  push:",
    "    branches: [main]",
    "jobs:",
    "  analysis:",
    "    runs-on: ubuntu-latest",
    "    permissions:",
    "      security-events: write",
    "      actions: read",
    "      contents: read",
    "    steps:",
    "      - uses: ossf/scorecard-action@v2",
    "        with:",
    "          results_file: results.sarif",
    "          results_format: sarif",
    "      - uses: github/codeql-action/upload-sarif@v4",
    "        with:",
    "          sarif_file: results.sarif",
].join("\n");

describe("code scanning rules", () => {
    it("accepts workflows that satisfy the codeScanning preset", async () => {
        const codeqlResult = await lintWorkflow(validCodeqlWorkflow, {
            configName: "codeScanning",
            filePath: ".github/workflows/codeql.yml",
        });
        const scorecardResult = await lintWorkflow(validScorecardWorkflow, {
            configName: "codeScanning",
            filePath: ".github/workflows/scorecards.yml",
        });

        expect(codeqlResult.messages).toHaveLength(0);
        expect(scorecardResult.messages).toHaveLength(0);
    });

    it("rejects split javascript/typescript CodeQL matrices and unnecessary autobuild", async () => {
        const splitMatrixResult = await lintWorkflow(
            [
                'name: "CodeQL"',
                "on: [pull_request]",
                "jobs:",
                "  analyze:",
                "    runs-on: ubuntu-latest",
                "    strategy:",
                "      matrix:",
                '        language: ["javascript", "typescript"]',
                "    steps:",
                "      - uses: github/codeql-action/init@v4",
                "        with:",
                `          languages: ${matrixLanguageExpression}`,
            ].join("\n"),
            {
                filePath: ".github/workflows/codeql.yml",
                rules: {
                    "github-actions/no-codeql-javascript-typescript-split-language-matrix":
                        "error",
                },
            }
        );
        const autobuildResult = await lintWorkflow(
            [
                'name: "CodeQL"',
                "on: [pull_request]",
                "jobs:",
                "  analyze:",
                "    runs-on: ubuntu-latest",
                "    strategy:",
                "      matrix:",
                '        language: ["javascript-typescript"]',
                "    steps:",
                "      - uses: github/codeql-action/init@v4",
                "        with:",
                `          languages: ${matrixLanguageExpression}`,
                "      - uses: github/codeql-action/autobuild@v4",
            ].join("\n"),
            {
                filePath: ".github/workflows/codeql.yml",
                rules: {
                    "github-actions/no-codeql-autobuild-for-javascript-typescript":
                        "error",
                },
            }
        );

        expect(splitMatrixResult.messages).toHaveLength(1);
        expect(autobuildResult.messages).toHaveLength(1);
    });

    it("requires CodeQL workflow triggers and permissions", async () => {
        const missingPermissionsResult = await lintWorkflow(
            [
                'name: "CodeQL"',
                "on: [pull_request]",
                "jobs:",
                "  analyze:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: github/codeql-action/init@v4",
                "      - uses: github/codeql-action/analyze@v4",
            ].join("\n"),
            {
                filePath: ".github/workflows/codeql.yml",
                rules: {
                    "github-actions/require-codeql-actions-read": "error",
                    "github-actions/require-codeql-security-events-write":
                        "error",
                },
            }
        );
        const missingPullRequestResult = await lintWorkflow(
            [
                'name: "CodeQL"',
                "on: [push]",
                "jobs:",
                "  analyze:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: github/codeql-action/init@v4",
            ].join("\n"),
            {
                filePath: ".github/workflows/codeql.yml",
                rules: {
                    "github-actions/require-codeql-pull-request-trigger":
                        "error",
                },
            }
        );
        const missingScheduleResult = await lintWorkflow(
            [
                'name: "CodeQL"',
                "on: [pull_request]",
                "jobs:",
                "  analyze:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: github/codeql-action/init@v4",
            ].join("\n"),
            {
                filePath: ".github/workflows/codeql.yml",
                rules: {
                    "github-actions/require-codeql-schedule": "error",
                },
            }
        );

        expect(missingPermissionsResult.messages).toHaveLength(2);
        expect(missingPullRequestResult.messages).toHaveLength(1);
        expect(missingScheduleResult.messages).toHaveLength(1);
    });

    it("requires SARIF upload discipline for scorecard workflows", async () => {
        const missingSarifFormatResult = await lintWorkflow(
            [
                'name: "Scorecard"',
                "on: [push]",
                "jobs:",
                "  analysis:",
                "    permissions:",
                "      security-events: write",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: ossf/scorecard-action@v2",
            ].join("\n"),
            {
                filePath: ".github/workflows/scorecards.yml",
                rules: {
                    "github-actions/require-scorecard-results-format-sarif":
                        "error",
                    "github-actions/require-scorecard-upload-sarif-step":
                        "error",
                },
            }
        );
        const missingSarifPermissionResult = await lintWorkflow(
            [
                'name: "Scorecard"',
                "on: [push]",
                "jobs:",
                "  analysis:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: github/codeql-action/upload-sarif@v4",
            ].join("\n"),
            {
                filePath: ".github/workflows/scorecards.yml",
                rules: {
                    "github-actions/require-sarif-upload-security-events-write":
                        "error",
                },
            }
        );

        expect(missingSarifFormatResult.messages).toHaveLength(2);
        expect(missingSarifPermissionResult.messages).toHaveLength(1);
    });
});
