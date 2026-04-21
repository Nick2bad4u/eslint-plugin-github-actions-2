import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

const githubExpression = (expression: string): string =>
    `\${{ ${expression} }}`;

describe("require-workflow-concurrency", () => {
    it("reports pull_request workflows that omit concurrency", async () => {
        expect.hasAssertions();

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
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  pull_request:",
                "permissions:",
                "  contents: read",
                "concurrency:",
                `  group: ci-${githubExpression("github.ref")}`,
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

    it("does not require concurrency for events outside the default monitored set", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  schedule:",
                "    - cron: '0 0 * * *'",
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

    it("reports concurrency mappings that omit group", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  push:",
                "concurrency:",
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

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.message).toContain("group");
    });

    it("reports blank scalar concurrency values", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  push:",
                "concurrency: '   '",
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

    it("accepts non-empty scalar concurrency values", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  push:",
                `concurrency: ci-${githubExpression("github.ref")}`,
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

    it("reports non-mapping concurrency structures", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  push:",
                "concurrency:",
                "  - ci",
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

    it("reports mappings with missing cancel-in-progress when required", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  push:",
                "concurrency:",
                `  group: ci-${githubExpression("github.ref")}`,
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
        expect(result.messages[0]?.message).toContain("cancel-in-progress");
    });

    it("accepts mappings without cancel-in-progress when disabled by option", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  push:",
                "concurrency:",
                `  group: ci-${githubExpression("github.ref")}`,
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    timeout-minutes: 10",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-concurrency": [
                        "error",
                        {
                            requireCancelInProgress: false,
                        },
                    ],
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports disabled boolean cancel-in-progress values", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  push:",
                "concurrency:",
                `  group: ci-${githubExpression("github.ref")}`,
                "  cancel-in-progress: false",
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
        expect(result.messages[0]?.message).toContain("cancel-in-progress");
    });

    it("reports non-scalar cancel-in-progress values", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  push:",
                "concurrency:",
                `  group: ci-${githubExpression("github.ref")}`,
                "  cancel-in-progress:",
                "    enabled: true",
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
        expect(result.messages[0]?.message).toContain("cancel-in-progress");
    });

    it("accepts expression cancel-in-progress values", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  push:",
                "concurrency:",
                `  group: ci-${githubExpression("github.ref")}`,
                `  cancel-in-progress: ${githubExpression("github.ref != 'refs/heads/main'")}`,
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

    it("supports custom event scopes through onlyForEvents", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  schedule:",
                "    - cron: '0 0 * * *'",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    timeout-minutes: 10",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-concurrency": [
                        "error",
                        {
                            onlyForEvents: ["schedule"],
                        },
                    ],
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.message).toContain("concurrency");
    });

    it("does not report when onlyForEvents excludes active workflow events", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    timeout-minutes: 10",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-concurrency": [
                        "error",
                        {
                            onlyForEvents: ["schedule"],
                        },
                    ],
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports unsupported contexts in workflow-level concurrency", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  push:",
                "concurrency:",
                `  group: deploy-${githubExpression("secrets.ENVIRONMENT")}`,
                "  cancel-in-progress: true",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    timeout-minutes: 10",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-concurrency-context": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-invalid-concurrency-context"
        );
    });

    it("reports unsupported contexts in job-level concurrency", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    timeout-minutes: 10",
                "    concurrency:",
                `      group: deploy-${githubExpression("secrets.ENVIRONMENT")}`,
                `      cancel-in-progress: ${githubExpression("env.CANCEL_OLD == 'true'")}`,
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-concurrency-context": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(2);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-invalid-concurrency-context"
        );
    });

    it("accepts valid workflow-level and job-level concurrency contexts", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  workflow_dispatch:",
                "    inputs:",
                "      environment:",
                "        description: Deployment target",
                "        required: true",
                "        type: string",
                "concurrency:",
                `  group: deploy-${githubExpression("github.workflow")}-${githubExpression("inputs.environment")}-${githubExpression("vars.RELEASE_CHANNEL")}`,
                "  cancel-in-progress: true",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    outputs:",
                `      lock: ${githubExpression("steps.meta.outputs.lock")}`,
                "    steps:",
                "      - id: meta",
                '        run: echo "lock=prod" >> "$GITHUB_OUTPUT"',
                "  deploy:",
                "    needs: build",
                "    strategy:",
                "      matrix:",
                "        target: [production]",
                "    runs-on: ubuntu-latest",
                "    concurrency:",
                `      group: deploy-${githubExpression("matrix.target")}-${githubExpression("needs.build.outputs.lock")}-${githubExpression("github.ref")}`,
                `      cancel-in-progress: ${githubExpression("inputs.environment == 'production'")}`,
                "    steps:",
                '      - run: echo "deploy"',
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-concurrency-context": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports invalid contexts used in scalar workflow and job concurrency", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  push:",
                `concurrency: deploy-${githubExpression("secrets.ENVIRONMENT")}`,
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    timeout-minutes: 10",
                `    concurrency: deploy-${githubExpression("env.BRANCH_NAME")}`,
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-concurrency-context": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(2);
    });

    it("ignores non-expression and empty concurrency scalar fields", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  push:",
                "concurrency:",
                "  group: '   '",
                "  cancel-in-progress: false",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    timeout-minutes: 10",
                "    concurrency: ci-main",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-concurrency-context": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("ignores invalid-concurrency checks when workflow root is non-mapping or concurrency values are null/non-mapping", async () => {
        expect.hasAssertions();

        const nonMappingRootResult = await lintWorkflow("- push", {
            rules: {
                "github-actions/no-invalid-concurrency-context": "error",
            },
        });

        const nullConcurrencyResult = await lintWorkflow(
            [
                "on:",
                "  push:",
                "concurrency:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    timeout-minutes: 10",
                "    concurrency:",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-concurrency-context": "error",
                },
            }
        );

        const nonMappingConcurrencyResult = await lintWorkflow(
            [
                "on:",
                "  push:",
                "concurrency:",
                "  - prod",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    timeout-minutes: 10",
                "    concurrency:",
                "      - prod",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-concurrency-context": "error",
                },
            }
        );

        expect(nonMappingRootResult.messages).toHaveLength(0);
        expect(nullConcurrencyResult.messages).toHaveLength(0);
        expect(nonMappingConcurrencyResult.messages).toHaveLength(0);
    });

    it("handles partial concurrency mappings and jobs without concurrency declarations", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "on:",
                "  workflow_dispatch:",
                "    inputs:",
                "      target:",
                "        description: target",
                "        required: true",
                "        type: string",
                "concurrency:",
                `  group: deploy-${githubExpression("github.ref")}`,
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: npm test",
                "  deploy:",
                "    runs-on: ubuntu-latest",
                "    concurrency:",
                `      cancel-in-progress: ${githubExpression("inputs.target == 'production'")}`,
                "    steps:",
                "      - run: echo deploy",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-concurrency-context": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });
});
