import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

describe("require-workflow-concurrency", () => {
    it("reports pull_request workflows that omit concurrency", async () => {
        const result = await lintWorkflow(
            [
                "on:",
                "  pull_request:",
                "permissions:",
                "  contents: read",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    timeout-minutes: 10",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-concurrency": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.message).toContain("concurrency");
    });

    it("accepts a workflow-level concurrency group with cancel-in-progress", async () => {
        const result = await lintWorkflow(
            [
                "on:",
                "  pull_request:",
                "permissions:",
                "  contents: read",
                "concurrency:",
                `  group: ci-\${{ github.ref }}`,
                "  cancel-in-progress: true",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    timeout-minutes: 10",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-concurrency": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });
});
