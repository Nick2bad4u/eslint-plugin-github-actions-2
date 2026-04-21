import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

describe("require-job-timeout-minutes", () => {
    it("reports jobs that omit timeout-minutes", async () => {
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
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-job-timeout-minutes": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.message).toContain("timeout-minutes");
    });

    it("accepts a positive integer timeout within the configured maximum", async () => {
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
                "    timeout-minutes: 30",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-job-timeout-minutes": [
                        "error",
                        { maxMinutes: 60 },
                    ],
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });
});
