import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

const githubExpression = (expression: string): string =>
    `\${{ ${expression} }}`;

describe("workflow shape rules", () => {
    it("reports reusable-workflow jobs when external jobs are disallowed", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Release",
                "on:",
                "  workflow_dispatch:",
                "jobs:",
                "  deploy:",
                "    uses: ./.github/workflows/deploy.yml",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-external-job": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-external-job"
        );
    });

    it("accepts inline jobs when reusable-workflow jobs are disallowed", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Release",
                "on:",
                "  workflow_dispatch:",
                "jobs:",
                "  deploy:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: echo deploy",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-external-job": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports each job that uses a reusable workflow", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Release",
                "on:",
                "  workflow_dispatch:",
                "jobs:",
                "  deploy:",
                "    uses: ./.github/workflows/deploy.yml",
                "  notify:",
                "    uses: ./.github/workflows/notify.yml",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-external-job": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(2);
    });

    it("ignores no-external-job when workflows define no jobs", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Release",
                "on:",
                "  workflow_dispatch:",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-external-job": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("ignores no-external-job when workflow root is not a mapping", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow("- deploy", {
            rules: {
                "github-actions/no-external-job": "error",
            },
        });

        expect(result.messages).toHaveLength(0);
    });

    it("reports external jobs even when uses has an empty value", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: Release",
                "on:",
                "  workflow_dispatch:",
                "jobs:",
                "  deploy:",
                "    uses:",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-external-job": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("reports top-level workflow env", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "env:",
                "  NODE_ENV: production",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-top-level-env": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-top-level-env"
        );
    });

    it("accepts workflows that scope env values at job level", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    env:",
                "      NODE_ENV: production",
                "    steps:",
                "      - run: npm test",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-top-level-env": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("ignores top-level env and permissions rules when the workflow root is not a mapping", async () => {
        expect.hasAssertions();

        const noTopLevelEnvResult = await lintWorkflow("- push", {
            rules: {
                "github-actions/no-top-level-env": "error",
            },
        });

        const noTopLevelPermissionsResult = await lintWorkflow("- push", {
            rules: {
                "github-actions/no-top-level-permissions": "error",
            },
        });

        expect(noTopLevelEnvResult.messages).toHaveLength(0);
        expect(noTopLevelPermissionsResult.messages).toHaveLength(0);
    });

    it("reports invalid workflow mapping keys", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    name: Build",
                "    runs-on: ubuntu-latest",
                "    strategy:",
                "      retry: 2",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-key": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-invalid-key"
        );
    });

    it("accepts valid workflow mapping keys across jobs, steps, and services", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    name: Build",
                "    runs-on: ubuntu-latest",
                "    strategy:",
                "      fail-fast: true",
                "      matrix:",
                "        node: [20]",
                "    container:",
                "      image: node:20",
                "      options: --user 1001",
                "    services:",
                "      redis:",
                "        image: redis:7",
                "        ports:",
                "          - 6379:6379",
                "    steps:",
                "      - name: Checkout",
                "        uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332",
                "      - name: Test",
                "        run: npm test",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-key": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports invalid keys across top-level, job, strategy, container, service, and step mappings", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "triggers:",
                "  - push",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runner: ubuntu-latest",
                "    runs-on: ubuntu-latest",
                "    strategy:",
                "      retry: 2",
                "      matrix:",
                "        node: [20]",
                "    container:",
                "      image: node:20",
                "      cpu: 2",
                "    services:",
                "      redis:",
                "        image: redis:7",
                "        cpu: 1",
                "    steps:",
                "      - script: echo hi",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-key": "error",
                },
            }
        );

        const messageIds = result.messages.map((message) => message.messageId);

        expect(result.messages).toHaveLength(6);
        expect(messageIds).toStrictEqual(
            expect.arrayContaining([
                "invalidContainerKey",
                "invalidJobKey",
                "invalidServiceKey",
                "invalidStepKey",
                "invalidStrategyKey",
                "invalidTopLevelKey",
            ])
        );
    });

    it("ignores no-invalid-key checks for non-scalar mapping keys", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    strategy:",
                "      ? [retry]",
                "      : 2",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-key": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("ignores no-invalid-key when the workflow root is not a mapping", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow("- push", {
            rules: {
                "github-actions/no-invalid-key": "error",
            },
        });

        expect(result.messages).toHaveLength(0);
    });

    it("ignores non-scalar keys and non-mapping service and step entries", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "? [name]",
                ": CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    services:",
                "      redis: redis:7",
                "    steps:",
                "      - run: echo hi",
                "      - 42",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-key": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("accepts jobs without strategy blocks for no-invalid-key", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
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
                    "github-actions/no-invalid-key": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports top-level workflow permissions", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "permissions:",
                "  contents: read",
                "jobs:",
                "  build:",
                "    permissions:",
                "      contents: read",
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-top-level-permissions": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-top-level-permissions"
        );
    });

    it("accepts workflows that scope permissions at job level", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    permissions:",
                "      contents: read",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: npm test",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-top-level-permissions": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports jobs that explicitly disable fail-fast", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  test:",
                "    name: Test",
                "    runs-on: ubuntu-latest",
                "    strategy:",
                "      fail-fast: false",
                "      matrix:",
                "        node: [20, 22]",
            ].join("\n"),
            {
                rules: {
                    "github-actions/prefer-fail-fast": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/prefer-fail-fast"
        );
    });

    it("accepts jobs that keep fail-fast enabled or expression-driven", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  test:",
                "    name: Test",
                "    runs-on: ubuntu-latest",
                "    strategy:",
                "      fail-fast: true",
                "      matrix:",
                "        node: [20, 22]",
                "  lint:",
                "    name: Lint",
                "    runs-on: ubuntu-latest",
                "    strategy:",
                `      fail-fast: ${githubExpression("github.ref != 'refs/heads/main'")}`,
                "      matrix:",
                "        node: [20]",
            ].join("\n"),
            {
                rules: {
                    "github-actions/prefer-fail-fast": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("accepts jobs without strategy.fail-fast declarations", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  test:",
                "    name: Test",
                "    runs-on: ubuntu-latest",
                "    strategy:",
                "      matrix:",
                "        node: [20, 22]",
            ].join("\n"),
            {
                rules: {
                    "github-actions/prefer-fail-fast": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("ignores prefer-fail-fast when strategy is not a mapping", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  test:",
                "    name: Test",
                "    runs-on: ubuntu-latest",
                "    strategy: fast",
            ].join("\n"),
            {
                rules: {
                    "github-actions/prefer-fail-fast": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("accepts workflows at the default job-count limit", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  one:",
                "    name: One",
                "    runs-on: ubuntu-latest",
                "  two:",
                "    name: Two",
                "    runs-on: ubuntu-latest",
                "  three:",
                "    name: Three",
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                rules: {
                    "github-actions/max-jobs-per-action": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("supports custom max-jobs-per-action thresholds", async () => {
        expect.hasAssertions();

        const workflowText = [
            "name: CI",
            "on:",
            "  push:",
            "jobs:",
            "  one:",
            "    name: One",
            "    runs-on: ubuntu-latest",
            "  two:",
            "    name: Two",
            "    runs-on: ubuntu-latest",
            "  three:",
            "    name: Three",
            "    runs-on: ubuntu-latest",
            "  four:",
            "    name: Four",
            "    runs-on: ubuntu-latest",
        ].join("\n");

        const customLimitResult = await lintWorkflow(workflowText, {
            rules: {
                "github-actions/max-jobs-per-action": ["error", 4],
            },
        });

        expect(customLimitResult.messages).toHaveLength(0);
    });

    it("reports workflows that exceed max-jobs-per-action default and custom limits", async () => {
        expect.hasAssertions();

        const workflowText = [
            "name: CI",
            "on:",
            "  push:",
            "jobs:",
            "  one:",
            "    runs-on: ubuntu-latest",
            "  two:",
            "    runs-on: ubuntu-latest",
            "  three:",
            "    runs-on: ubuntu-latest",
            "  four:",
            "    runs-on: ubuntu-latest",
        ].join("\n");

        const defaultLimitResult = await lintWorkflow(workflowText, {
            rules: {
                "github-actions/max-jobs-per-action": "error",
            },
        });
        const customLimitResult = await lintWorkflow(workflowText, {
            rules: {
                "github-actions/max-jobs-per-action": ["error", 2],
            },
        });

        expect(defaultLimitResult.messages).toHaveLength(1);
        expect(customLimitResult.messages).toHaveLength(1);
    });

    it("ignores max-jobs-per-action when workflow has no jobs mapping", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
            ].join("\n"),
            {
                rules: {
                    "github-actions/max-jobs-per-action": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("ignores max-jobs-per-action when workflow root is not a mapping", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow("- push", {
            rules: {
                "github-actions/max-jobs-per-action": "error",
            },
        });

        expect(result.messages).toHaveLength(0);
    });
});
