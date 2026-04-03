import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

const validDependencyReviewWorkflow = [
    'name: "Dependency Review"',
    "on: [pull_request]",
    "permissions:",
    "  contents: read",
    "jobs:",
    "  dependency-review:",
    "    runs-on: ubuntu-latest",
    "    steps:",
    '      - name: "Checkout Repository"',
    "        uses: actions/checkout@v5",
    '      - name: "Dependency Review"',
    "        uses: actions/dependency-review-action@v4",
    "        with:",
    '          fail-on-severity: "moderate"',
].join("\n");

describe("dependency review workflow rules", () => {
    it("accepts a dependency review workflow that follows the security conventions", async () => {
        const result = await lintWorkflow(validDependencyReviewWorkflow, {
            configName: "security",
            filePath: ".github/workflows/dependency-review.yml",
            rules: {
                "github-actions/require-dependency-review-action": "error",
                "github-actions/require-dependency-review-fail-on-severity":
                    "error",
                "github-actions/require-dependency-review-permissions-contents-read":
                    "error",
                "github-actions/require-dependency-review-pull-request-trigger":
                    "error",
            },
        });

        expect(result.messages).toHaveLength(0);
    });

    it("requires dependency-review workflow files to invoke actions/dependency-review-action", async () => {
        const result = await lintWorkflow(
            [
                'name: "Dependency Review"',
                "on: [pull_request]",
                "jobs:",
                "  review:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: actions/checkout@v5",
            ].join("\n"),
            {
                filePath: ".github/workflows/dependency-review.yml",
                rules: {
                    "github-actions/require-dependency-review-action": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("requires dependency-review workflows to set permissions.contents to read", async () => {
        const result = await lintWorkflow(
            [
                'name: "Dependency Review"',
                "on: [pull_request]",
                "permissions:",
                "  contents: write",
                "jobs:",
                "  review:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: actions/dependency-review-action@v4",
            ].join("\n"),
            {
                filePath: ".github/workflows/dependency-review.yml",
                rules: {
                    "github-actions/require-dependency-review-permissions-contents-read":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("requires dependency-review action steps to set fail-on-severity", async () => {
        const result = await lintWorkflow(
            [
                'name: "Dependency Review"',
                "on: [pull_request]",
                "permissions:",
                "  contents: read",
                "jobs:",
                "  review:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: actions/dependency-review-action@v4",
            ].join("\n"),
            {
                filePath: ".github/workflows/dependency-review.yml",
                rules: {
                    "github-actions/require-dependency-review-fail-on-severity":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("requires workflows using dependency-review-action to listen for pull_request", async () => {
        const result = await lintWorkflow(
            [
                'name: "Dependency Review"',
                "on: [workflow_dispatch]",
                "permissions:",
                "  contents: read",
                "jobs:",
                "  review:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: actions/dependency-review-action@v4",
                "        with:",
                '          fail-on-severity: "moderate"',
            ].join("\n"),
            {
                filePath: ".github/workflows/dependency-review.yml",
                rules: {
                    "github-actions/require-dependency-review-pull-request-trigger":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });
});
