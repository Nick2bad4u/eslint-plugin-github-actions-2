import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

const githubExpression = (expression: string): string =>
    `\${{ ${expression} }}`;

// eslint-disable-next-line max-lines-per-function -- Integration tests intentionally cover many workflow metadata rule permutations in one suite.
describe("workflow metadata rules", () => {
    it("requires a workflow name", async () => {
        expect.hasAssertions();

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

    it("accepts workflows with a non-empty name", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-action-name": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports non-scalar workflow names", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: []",
                "on:",
                "  push:",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-action-name": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-action-name"
        );
    });

    it("reports workflows whose YAML root is not a mapping", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow("- push", {
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
        expect.hasAssertions();

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

    it("accepts workflows with a non-empty run-name", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Release",
                `run-name: Release ${githubExpression("github.ref_name")}`,
                "on:",
                "  workflow_dispatch:",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-action-run-name": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports blank workflow run-name values", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Release",
                "run-name: '   '",
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

    it("reports non-scalar workflow run-name values", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Release",
                "run-name: {}",
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

    it("reports missing run-name for non-mapping workflow roots", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow("- workflow_dispatch", {
            rules: {
                "github-actions/require-action-run-name": "error",
            },
        });

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-action-run-name"
        );
    });

    it("reports null workflow run-name values", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Release",
                "run-name:",
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
        expect.hasAssertions();

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

    it("accepts workflow names that match configured casing and ignored names", async () => {
        expect.hasAssertions();

        const kebabCaseResult = await lintWorkflow(
            [
                "name: release-pipeline",
                "on:",
                "  push:",
            ].join("\n"),
            {
                rules: {
                    "github-actions/action-name-casing": [
                        "error",
                        {
                            "kebab-case": true,
                        },
                    ],
                },
            }
        );

        const ignoredNameResult = await lintWorkflow(
            [
                "name: releasePipeline",
                "on:",
                "  push:",
            ].join("\n"),
            {
                rules: {
                    "github-actions/action-name-casing": [
                        "error",
                        {
                            ignores: ["releasePipeline"],
                            "Title Case": true,
                        },
                    ],
                },
            }
        );

        expect(kebabCaseResult.messages).toHaveLength(0);
        expect(ignoredNameResult.messages).toHaveLength(0);
    });

    it("accepts case-police canonical title words with default casing", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: GitHub Actions HTTP API",
                "on:",
                "  push:",
            ].join("\n"),
            {
                rules: {
                    "github-actions/action-name-casing": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("falls back to the default casing when object options enable no casings", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: release-pipeline",
                "on:",
                "  push:",
            ].join("\n"),
            {
                rules: {
                    "github-actions/action-name-casing": ["error", {}],
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/action-name-casing"
        );
    });

    it("autofixes names when a single target casing is configured", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: release pipeline",
                "on:",
                "  push:",
            ].join("\n"),
            {
                fix: true,
                rules: {
                    "github-actions/action-name-casing": [
                        "error",
                        "Title Case",
                    ],
                },
            }
        );

        expect(result.output).toContain("name: Release Pipeline");
    });

    it("autofixes known case-police words in title casing", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: git hub actions http api",
                "on:",
                "  push:",
            ].join("\n"),
            {
                fix: true,
                rules: {
                    "github-actions/action-name-casing": [
                        "error",
                        "Title Case",
                    ],
                },
            }
        );

        expect(result.output).toContain("name: GitHub Actions HTTP API");
    });

    it("reports invalid workflow trigger events", async () => {
        expect.hasAssertions();

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

    it("accepts valid scalar workflow trigger events", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(["name: CI", "on: push"].join("\n"), {
            rules: {
                "github-actions/valid-trigger-events": "error",
            },
        });

        expect(result.messages).toHaveLength(0);
    });

    it("ignores valid-trigger-events when workflow root or on key is missing", async () => {
        expect.hasAssertions();

        const nonMappingRootResult = await lintWorkflow("- push", {
            rules: {
                "github-actions/valid-trigger-events": "error",
            },
        });

        const noOnKeyResult = await lintWorkflow(
            [
                "name: CI",
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

        expect(nonMappingRootResult.messages).toHaveLength(0);
        expect(noOnKeyResult.messages).toHaveLength(0);
    });

    it("reports invalid scalar trigger events", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            ["name: CI", "on: not_a_real_event"].join("\n"),
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

    it("reports invalid sequence trigger entries", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  - push",
                "  - not_a_real_event",
                "  - {}",
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

        expect(result.messages).toHaveLength(2);
        expect(
            result.messages.every(
                (message) =>
                    message.ruleId === "github-actions/valid-trigger-events"
            )
        ).toBeTruthy();
    });

    it("reports non-string mapping trigger keys", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  ? [push]",
                "  : {}",
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

    it("accepts valid mapping trigger keys", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "  workflow_dispatch:",
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

        expect(result.messages).toHaveLength(0);
    });

    it("reports alias trigger values that are not explicit scalar, sequence, or mapping nodes", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "events: &events",
                "  - push",
                "on: *events",
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
        expect.hasAssertions();

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
        expect.hasAssertions();

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
        expect.hasAssertions();

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

    it("supports string option form for preferred workflow extension", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
            ].join("\n"),
            {
                filePath: ".github/workflows/test.yml",
                rules: {
                    "github-actions/prefer-file-extension": ["error", "yaml"],
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/prefer-file-extension"
        );
    });

    it("handles case-insensitive preferred extension matching", async () => {
        expect.hasAssertions();

        const caseInsensitiveResult = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
            ].join("\n"),
            {
                filePath: ".github/workflows/test.yml",
                rules: {
                    "github-actions/prefer-file-extension": [
                        "error",
                        {
                            caseSensitive: false,
                            extension: "yml",
                        },
                    ],
                },
            }
        );

        expect(caseInsensitiveResult.messages).toHaveLength(0);
    });

    it("reports mismatches under case-insensitive extension checks", async () => {
        expect.hasAssertions();

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
                            caseSensitive: false,
                            extension: "yml",
                        },
                    ],
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/prefer-file-extension"
        );
    });

    it("defaults extension options when extension is omitted", async () => {
        expect.hasAssertions();

        const acceptedDefaultExtensionResult = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
            ].join("\n"),
            {
                filePath: ".github/workflows/test.yml",
                rules: {
                    "github-actions/prefer-file-extension": [
                        "error",
                        {
                            caseSensitive: true,
                        },
                    ],
                },
            }
        );

        const rejectedNonDefaultExtensionResult = await lintWorkflow(
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
                            caseSensitive: true,
                        },
                    ],
                },
            }
        );

        expect(acceptedDefaultExtensionResult.messages).toHaveLength(0);
        expect(rejectedNonDefaultExtensionResult.messages).toHaveLength(1);
    });

    it("requires explicit types for workflow_dispatch inputs", async () => {
        expect.hasAssertions();

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
        expect.hasAssertions();

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

    it("reports blank workflow_dispatch input types", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Release",
                "on:",
                "  workflow_dispatch:",
                "    inputs:",
                "      environment:",
                "        description: Deployment target",
                "        required: true",
                "        type: '   '",
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

    it("ignores non-mapping workflow_dispatch input entries", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Release",
                "on:",
                "  workflow_dispatch:",
                "    inputs:",
                "      environment: production",
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

    it("ignores require-workflow-dispatch-input-type when root or on/workflow_dispatch mappings are missing", async () => {
        expect.hasAssertions();

        const nonMappingRootResult = await lintWorkflow("- workflow_dispatch", {
            rules: {
                "github-actions/require-workflow-dispatch-input-type": "error",
            },
        });

        const noOnMappingResult = await lintWorkflow(
            [
                "name: Release",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-dispatch-input-type":
                        "error",
                },
            }
        );

        const scalarWorkflowDispatchResult = await lintWorkflow(
            [
                "name: Release",
                "on:",
                "  workflow_dispatch: true",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-dispatch-input-type":
                        "error",
                },
            }
        );

        const noInputsResult = await lintWorkflow(
            [
                "name: Release",
                "on:",
                "  workflow_dispatch:",
                "    types: [requested]",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-dispatch-input-type":
                        "error",
                },
            }
        );

        expect(nonMappingRootResult.messages).toHaveLength(0);
        expect(noOnMappingResult.messages).toHaveLength(0);
        expect(scalarWorkflowDispatchResult.messages).toHaveLength(0);
        expect(noInputsResult.messages).toHaveLength(0);
    });

    it("reports null and non-scalar workflow_dispatch input types", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Release",
                "on:",
                "  workflow_dispatch:",
                "    inputs:",
                "      environment:",
                "        description: Deployment target",
                "        type:",
                "      retries:",
                "        description: Retry count",
                "        type:",
                "          - number",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-dispatch-input-type":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(2);
        expect(
            result.messages.every(
                (message) =>
                    message.ruleId ===
                    "github-actions/require-workflow-dispatch-input-type"
            )
        ).toBeTruthy();
    });

    it("requires explicit types for selected multi-activity events", async () => {
        expect.hasAssertions();

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

    it("reports selected events in scalar trigger form", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Review automation",
                "on: pull_request_review",
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

    it("reports selected events in sequence trigger form", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Review automation",
                "on:",
                "  - pull_request_review",
                "  - push",
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

    it("reports selected mapped events that do not define a mapping value", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Review automation",
                "on:",
                "  pull_request_review: submitted",
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

    it("reports selected mapped events with empty types filters", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Review automation",
                "on:",
                "  pull_request_review:",
                "    types: []",
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

    it("accepts selected mapped events with non-empty scalar types", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Review automation",
                "on:",
                "  pull_request_review:",
                "    types: submitted",
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

    it("accepts selected mapped events with non-empty sequence types", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Review automation",
                "on:",
                "  pull_request_review:",
                "    types:",
                "      - ''",
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

    it("accepts selected multi-activity events with explicit types", async () => {
        expect.hasAssertions();

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

    it("ignores require-trigger-types when workflow root or on key is missing", async () => {
        expect.hasAssertions();

        const nonMappingRootResult = await lintWorkflow(
            "- pull_request_review",
            {
                rules: {
                    "github-actions/require-trigger-types": "error",
                },
            }
        );

        const noOnKeyResult = await lintWorkflow(
            [
                "name: Review automation",
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

        expect(nonMappingRootResult.messages).toHaveLength(0);
        expect(noOnKeyResult.messages).toHaveLength(0);
    });

    it("ignores scalar trigger events that are not in the explicit-types list", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Push workflow",
                "on: push",
                "jobs:",
                "  react:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: echo push",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-trigger-types": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("ignores mapped trigger events that do not require explicit types", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Push workflow",
                "on:",
                "  push:",
                "jobs:",
                "  react:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: echo push",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-trigger-types": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports selected mapped events when types is not a scalar or sequence", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Review automation",
                "on:",
                "  pull_request_review:",
                "    types:",
                "      mode: submitted",
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

    it("ignores aliased on values that cannot be resolved as a mapping", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Review automation",
                "events: &events",
                "  pull_request_review:",
                "on: *events",
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
        expect.hasAssertions();

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

    it("reports scalar and sequence pull_request triggers without merge_group", async () => {
        expect.hasAssertions();

        const scalarResult = await lintWorkflow(
            [
                "name: CI",
                "on: pull_request",
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
        const sequenceResult = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  - pull_request",
                "  - workflow_dispatch",
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

        expect(scalarResult.messages).toHaveLength(1);
        expect(sequenceResult.messages).toHaveLength(1);
    });

    it("ignores workflows that do not listen for pull_request", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  workflow_dispatch:",
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

    it("accepts pull_request workflows that also declare merge_group", async () => {
        expect.hasAssertions();

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

    it("ignores require-merge-group-trigger when on is missing", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
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

    it("ignores require-merge-group-trigger when on uses a YAML alias node", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "triggers: &triggers",
                "  pull_request:",
                "on: *triggers",
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
