import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

const githubExpression = (expression: string): string =>
    `\${{ ${expression} }}`;

describe("workflow reuse rules", () => {
    it("reports local actions used before checkout", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - name: Use local action",
                "        uses: ./.github/actions/setup-project",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-checkout-before-local-action":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-checkout-before-local-action"
        );
    });

    it("accepts local actions after checkout", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - name: Checkout",
                "        uses: actions/checkout@v5",
                "      - name: Use local action",
                "        uses: ./.github/actions/setup-project",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-checkout-before-local-action":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("still reports when checkout appears after the local action", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - name: Use local action",
                "        uses: ./.github/actions/setup-project",
                "      - name: Checkout",
                "        uses: actions/checkout@v5",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-checkout-before-local-action":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("reports reusable workflow jobs that inherit all secrets", async () => {
        const result = await lintWorkflow(
            [
                "name: Reuse",
                "on:",
                "  workflow_dispatch:",
                "jobs:",
                "  deploy:",
                "    uses: ./.github/workflows/deploy.yml",
                "    secrets: inherit",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-inherit-secrets": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-inherit-secrets"
        );
    });

    it("accepts reusable workflow jobs with explicit secrets", async () => {
        const result = await lintWorkflow(
            [
                "name: Reuse",
                "on:",
                "  workflow_dispatch:",
                "jobs:",
                "  deploy:",
                "    uses: ./.github/workflows/deploy.yml",
                "    secrets:",
                `      token: ${githubExpression("secrets.DEPLOY_TOKEN")}`,
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-inherit-secrets": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports unsupported inline-job keys on reusable workflow caller jobs", async () => {
        const result = await lintWorkflow(
            [
                "name: Reuse",
                "on:",
                "  workflow_dispatch:",
                "jobs:",
                "  deploy:",
                "    uses: ./.github/workflows/deploy.yml",
                "    runs-on: ubuntu-latest",
                "    steps:",
                '      - run: echo "invalid"',
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-reusable-workflow-job-key":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(2);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-invalid-reusable-workflow-job-key"
        );
    });

    it("accepts supported reusable workflow caller-job keys", async () => {
        const result = await lintWorkflow(
            [
                "name: Reuse",
                "on:",
                "  workflow_dispatch:",
                "jobs:",
                "  deploy:",
                "    name: Deploy via reusable workflow",
                "    needs: []",
                `    if: ${githubExpression("github.ref == 'refs/heads/main'")}`,
                "    strategy:",
                "      matrix:",
                "        target: [production]",
                "    uses: ./.github/workflows/deploy.yml",
                "    with:",
                "      target: production",
                "    secrets:",
                `      token: ${githubExpression("secrets.DEPLOY_TOKEN")}`,
                "    concurrency:",
                `      group: deploy-${githubExpression("github.ref")}`,
                "      cancel-in-progress: true",
                "    permissions:",
                "      contents: read",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-reusable-workflow-job-key":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("does not report normal inline jobs", async () => {
        const result = await lintWorkflow(
            [
                "name: Inline",
                "on:",
                "  workflow_dispatch:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                '      - run: echo "ok"',
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-reusable-workflow-job-key":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });
});
