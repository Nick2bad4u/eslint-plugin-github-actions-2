import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

describe("require-run-step-timeout", () => {
    it("reports a job with a run step but no timeout-minutes", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Test",
                "on: push",
                "jobs:",
                "  test:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - name: Run test",
                "        run: npm test",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-run-step-timeout": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-run-step-timeout"
        );
        expect(result.messages[0]?.message).toContain("timeout-minutes");
    });

    it("accepts a job with a run step and timeout-minutes", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Test",
                "on: push",
                "jobs:",
                "  test:",
                "    runs-on: ubuntu-latest",
                "    timeout-minutes: 10",
                "    steps:",
                "      - name: Run test",
                "        run: npm test",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-run-step-timeout": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("accepts a job with only actions and no timeout-minutes", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Test",
                "on: push",
                "jobs:",
                "  test:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - name: Checkout",
                "        uses: actions/checkout@v4",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-run-step-timeout": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("accepts a job that uses a reusable workflow", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Test",
                "on: push",
                "jobs:",
                "  test:",
                "    uses: ./.github/workflows/test.yml",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-run-step-timeout": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("accepts a job with multiple run steps and timeout-minutes", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Test",
                "on: push",
                "jobs:",
                "  test:",
                "    runs-on: ubuntu-latest",
                "    timeout-minutes: 30",
                "    steps:",
                "      - name: Run tests",
                "        run: npm test",
                "      - name: Run lint",
                "        run: npm run lint",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-run-step-timeout": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports a job with mixed action and run steps but no timeout-minutes", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Test",
                "on: push",
                "jobs:",
                "  test:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - name: Checkout",
                "        uses: actions/checkout@v4",
                "      - name: Run test",
                "        run: npm test",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-run-step-timeout": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-run-step-timeout"
        );
    });

    it("accepts an empty job", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Test",
                "on: push",
                "jobs:",
                "  test:",
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-run-step-timeout": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });
});
