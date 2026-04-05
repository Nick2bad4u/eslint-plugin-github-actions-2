import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

const validGitleaksWorkflow = [
    'name: "Gitleaks"',
    "on:",
    "  pull_request:",
    "  schedule:",
    '    - cron: "12 4 * * *"',
    "permissions:",
    "  contents: read",
    "jobs:",
    "  scan:",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd",
    "        with:",
    "          fetch-depth: 0",
    "      - uses: gitleaks/gitleaks-action@ff98106e4c7b2bc287b24eaf42907196329070c7",
].join("\n");

const validTrufflehogWorkflow = [
    'name: "TruffleHog"',
    "on:",
    "  pull_request:",
    "  schedule:",
    '    - cron: "44 4 * * 0"',
    "permissions:",
    "  contents: read",
    "jobs:",
    "  scan:",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd",
    "        with:",
    "          fetch-depth: 0",
    "      - uses: trufflesecurity/trufflehog@7c0734f987ad0bb30ee8da210773b800ee2016d3",
    "        with:",
    '          extra_args: "--results=verified"',
].join("\n");

describe("secret scanning workflow rules", () => {
    it("accepts secret scanning workflows that follow the security conventions", async () => {
        const gitleaksResult = await lintWorkflow(validGitleaksWorkflow, {
            configName: "security",
            filePath: ".github/workflows/gitleaks.yml",
        });
        const trufflehogResult = await lintWorkflow(validTrufflehogWorkflow, {
            configName: "security",
            filePath: ".github/workflows/trufflehog.yml",
        });

        expect(gitleaksResult.messages).toHaveLength(0);
        expect(trufflehogResult.messages).toHaveLength(0);
    });

    it("requires secret scanning workflows to checkout full history, schedule scans, and grant contents read", async () => {
        const result = await lintWorkflow(
            [
                'name: "Gitleaks"',
                "on: [pull_request]",
                "jobs:",
                "  scan:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: actions/checkout@v6",
                "      - uses: gitleaks/gitleaks-action@v2",
            ].join("\n"),
            {
                filePath: ".github/workflows/gitleaks.yml",
                rules: {
                    "github-actions/require-secret-scan-contents-read": "error",
                    "github-actions/require-secret-scan-fetch-depth-zero":
                        "error",
                    "github-actions/require-secret-scan-schedule": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(3);
    });

    it("rejects broader-than-necessary contents permissions for secret scanning jobs", async () => {
        const result = await lintWorkflow(
            [
                'name: "Gitleaks"',
                "on:",
                "  pull_request:",
                "  schedule:",
                '    - cron: "12 4 * * *"',
                "permissions:",
                "  contents: write",
                "jobs:",
                "  scan:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd",
                "        with:",
                "          fetch-depth: 0",
                "      - uses: gitleaks/gitleaks-action@ff98106e4c7b2bc287b24eaf42907196329070c7",
            ].join("\n"),
            {
                filePath: ".github/workflows/gitleaks.yml",
                rules: {
                    "github-actions/require-secret-scan-contents-read": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("accepts workflow-level read-all but rejects job-level write-all for secret scanning permissions", async () => {
        const readAllResult = await lintWorkflow(
            [
                'name: "Gitleaks"',
                "on:",
                "  pull_request:",
                "  schedule:",
                '    - cron: "12 4 * * *"',
                "permissions: read-all",
                "jobs:",
                "  scan:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd",
                "        with:",
                "          fetch-depth: 0",
                "      - uses: gitleaks/gitleaks-action@ff98106e4c7b2bc287b24eaf42907196329070c7",
            ].join("\n"),
            {
                filePath: ".github/workflows/gitleaks.yml",
                rules: {
                    "github-actions/require-secret-scan-contents-read": "error",
                },
            }
        );
        const writeAllResult = await lintWorkflow(
            [
                'name: "Gitleaks"',
                "on:",
                "  pull_request:",
                "  schedule:",
                '    - cron: "12 4 * * *"',
                "jobs:",
                "  scan:",
                "    runs-on: ubuntu-latest",
                "    permissions: write-all",
                "    steps:",
                "      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd",
                "        with:",
                "          fetch-depth: 0",
                "      - uses: gitleaks/gitleaks-action@ff98106e4c7b2bc287b24eaf42907196329070c7",
            ].join("\n"),
            {
                filePath: ".github/workflows/gitleaks.yml",
                rules: {
                    "github-actions/require-secret-scan-contents-read": "error",
                },
            }
        );

        expect(readAllResult.messages).toHaveLength(0);
        expect(writeAllResult.messages).toHaveLength(1);
    });

    it("requires TruffleHog to use verified-results mode", async () => {
        const result = await lintWorkflow(
            [
                'name: "TruffleHog"',
                "on: [pull_request]",
                "permissions:",
                "  contents: read",
                "jobs:",
                "  scan:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: actions/checkout@v6",
                "        with:",
                "          fetch-depth: 0",
                "      - uses: trufflesecurity/trufflehog@v3",
            ].join("\n"),
            {
                filePath: ".github/workflows/trufflehog.yml",
                rules: {
                    "github-actions/require-trufflehog-verified-results-mode":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });
});
