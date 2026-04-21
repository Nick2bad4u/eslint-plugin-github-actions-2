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
        expect.hasAssertions();

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
        expect.hasAssertions();

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
        expect.hasAssertions();

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

    it("accepts job-level contents: read for dependency review when workflow-level permissions are omitted", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                'name: "Dependency Review"',
                "on: [pull_request]",
                "jobs:",
                "  review:",
                "    runs-on: ubuntu-latest",
                "    permissions:",
                "      contents: read",
                "    steps:",
                "      - uses: actions/dependency-review-action@v4",
            ].join("\n"),
            {
                filePath: ".github/workflows/dependency-review.yml",
                rules: {
                    "github-actions/require-dependency-review-permissions-contents-read":
                        "error",
                    "github-actions/require-workflow-permissions": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("accepts workflow-level read-all but rejects workflow-level write-all for dependency review permissions", async () => {
        expect.hasAssertions();

        const readAllResult = await lintWorkflow(
            [
                'name: "Dependency Review"',
                "on: [pull_request]",
                "permissions: read-all",
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
        const writeAllResult = await lintWorkflow(
            [
                'name: "Dependency Review"',
                "on: [pull_request]",
                "permissions: write-all",
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

        expect(readAllResult.messages).toHaveLength(0);
        expect(writeAllResult.messages).toHaveLength(1);
    });

    it("requires dependency-review action steps to set fail-on-severity", async () => {
        expect.hasAssertions();

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
        expect.hasAssertions();

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
