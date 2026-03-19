import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

describe("workflow metadata rules", () => {
    it("requires a workflow name", async () => {
        const result = await lintWorkflow(["on:", "  push:"].join("\n"), {
            rules: {
                "github-actions/require-action-name": "error",
            },
        });

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-action-name"
        );
    });

    it("requires a workflow run-name when enabled", async () => {
        const result = await lintWorkflow(
            [
                "name: Release",
                "on:",
                "  workflow_dispatch:",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-action-run-name": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-action-run-name"
        );
    });

    it("reports workflow names that do not match the configured casing", async () => {
        const result = await lintWorkflow(
            [
                "name: releasePipeline",
                "on:",
                "  push:",
            ].join("\n"),
            {
                rules: {
                    "github-actions/action-name-casing": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/action-name-casing"
        );
    });

    it("reports invalid workflow trigger events", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  foo_bar:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                rules: {
                    "github-actions/valid-trigger-events": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/valid-trigger-events"
        );
    });

    it("reports workflow files that do not use the preferred extension", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
            ].join("\n"),
            {
                filePath: ".github/workflows/test.yaml",
                rules: {
                    "github-actions/prefer-file-extension": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/prefer-file-extension"
        );
    });

    it("accepts the default preferred workflow extension", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
            ].join("\n"),
            {
                filePath: ".github/workflows/test.yml",
                rules: {
                    "github-actions/prefer-file-extension": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("supports configuring the preferred workflow extension", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
            ].join("\n"),
            {
                filePath: ".github/workflows/test.yaml",
                rules: {
                    "github-actions/prefer-file-extension": [
                        "error",
                        {
                            extension: "yaml",
                        },
                    ],
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("requires explicit types for workflow_dispatch inputs", async () => {
        const result = await lintWorkflow(
            [
                "name: Release",
                "on:",
                "  workflow_dispatch:",
                "    inputs:",
                "      environment:",
                "        description: Deployment target",
                "        required: true",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-dispatch-input-type":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-workflow-dispatch-input-type"
        );
    });

    it("accepts explicitly typed workflow_dispatch inputs", async () => {
        const result = await lintWorkflow(
            [
                "name: Release",
                "on:",
                "  workflow_dispatch:",
                "    inputs:",
                "      environment:",
                "        description: Deployment target",
                "        required: true",
                "        type: environment",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-dispatch-input-type":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("requires explicit types for selected multi-activity events", async () => {
        const result = await lintWorkflow(
            [
                "name: PR review automation",
                "on:",
                "  pull_request_review:",
                "jobs:",
                "  react:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: echo review",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-trigger-types": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-trigger-types"
        );
    });

    it("accepts selected multi-activity events with explicit types", async () => {
        const result = await lintWorkflow(
            [
                "name: PR review automation",
                "on:",
                "  pull_request_review:",
                "    types:",
                "      - submitted",
                "jobs:",
                "  react:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: echo review",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-trigger-types": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports pull_request workflows that do not include merge_group", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  pull_request:",
                "    branches:",
                "      - main",
                "jobs:",
                "  test:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: npm test",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-merge-group-trigger": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-merge-group-trigger"
        );
    });

    it("accepts pull_request workflows that also declare merge_group", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  pull_request:",
                "    branches:",
                "      - main",
                "  merge_group:",
                "    types:",
                "      - checks_requested",
                "jobs:",
                "  test:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: npm test",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-merge-group-trigger": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });
});
