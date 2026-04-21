import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

describe("require-workflow-permissions", () => {
    it("reports when neither workflow nor jobs declare permissions", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: ci",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: npm test",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-permissions": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-workflow-permissions"
        );
    });

    it("allows explicit workflow-level permissions", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: ci",
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
                    "github-actions/require-workflow-permissions": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports each job missing permissions when workflow-level permissions are absent", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: ci",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "  lint:",
                "    runs-on: ubuntu-latest",
                "    permissions:",
                "      contents: read",
                "  test:",
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-permissions": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(2);
        expect(
            result.messages.every(
                (message) =>
                    message.ruleId ===
                    "github-actions/require-workflow-permissions"
            )
        ).toBeTruthy();
    });

    it("allows all jobs to declare permissions when workflow-level permissions are omitted", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: ci",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    permissions:",
                "      contents: read",
                "  lint:",
                "    runs-on: ubuntu-latest",
                "    permissions:",
                "      contents: read",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-permissions": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("requires top-level permissions when allowJobLevelPermissions is false", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: ci",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    permissions:",
                "      contents: read",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-permissions": [
                        "error",
                        {
                            allowJobLevelPermissions: false,
                        },
                    ],
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-workflow-permissions"
        );
    });

    it("reports workflows with no jobs and no permissions", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: ci",
                "on:",
                "  push:",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-permissions": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });
});
