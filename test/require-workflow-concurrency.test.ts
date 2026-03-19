import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

const githubExpression = (expression: string): string =>
    `\${{ ${expression} }}`;

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

    it("reports unsupported contexts in workflow-level concurrency", async () => {
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
});
