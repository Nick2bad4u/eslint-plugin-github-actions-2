import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

describe("workflow permissions hardening rules", () => {
    it("reports top-level write-all permissions", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "permissions: write-all",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-write-all-permissions": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-write-all-permissions"
        );
    });

    it("reports job-level write-all permissions", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "permissions:",
                "  contents: read",
                "jobs:",
                "  release:",
                "    runs-on: ubuntu-latest",
                "    permissions: write-all",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-write-all-permissions": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-write-all-permissions"
        );
    });

    it("accepts granular workflow and job permissions maps", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "permissions:",
                "  contents: read",
                "jobs:",
                "  release:",
                "    runs-on: ubuntu-latest",
                "    permissions:",
                "      contents: read",
                "      issues: write",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-write-all-permissions": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("ignores no-write-all-permissions when workflow root is not a mapping", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow("- write-all", {
            rules: {
                "github-actions/no-write-all-permissions": "error",
            },
        });

        expect(result.messages).toHaveLength(0);
    });
});
