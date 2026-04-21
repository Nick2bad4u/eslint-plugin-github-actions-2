import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

describe("pin-action-shas", () => {
    it("reports tag-based action references", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  push:",
                "permissions:",
                "  contents: read",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    timeout-minutes: 10",
                "    steps:",
                "      - uses: actions/checkout@v4",
            ].join("\n"),
            {
                rules: {
                    "github-actions/pin-action-shas": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.message).toContain(
            "40-character commit SHA"
        );
    });

    it("allows full SHA pins", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  push:",
                "permissions:",
                "  contents: read",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    timeout-minutes: 10",
                "    steps:",
                "      - uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332",
            ].join("\n"),
            {
                rules: {
                    "github-actions/pin-action-shas": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports unpinned reusable workflow references with the reusable-workflow message", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  workflow_dispatch:",
                "jobs:",
                "  deploy:",
                "    uses: org/repo/.github/workflows/deploy.yml@main",
            ].join("\n"),
            {
                rules: {
                    "github-actions/pin-action-shas": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.message).toContain("Reusable workflow");
    });

    it("reports references that omit the @ref segment", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: actions/checkout",
            ].join("\n"),
            {
                rules: {
                    "github-actions/pin-action-shas": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.message).toContain(
            "40-character commit SHA"
        );
    });

    it("ignores local action and docker references", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: ./.github/actions/setup",
                "      - uses: docker://alpine:3.20",
            ].join("\n"),
            {
                rules: {
                    "github-actions/pin-action-shas": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports each unpinned job-level and step-level uses reference", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  workflow_dispatch:",
                "jobs:",
                "  deploy:",
                "    uses: org/repo/.github/workflows/deploy.yml@v1",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: actions/cache@v4",
            ].join("\n"),
            {
                rules: {
                    "github-actions/pin-action-shas": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(2);
    });
});
