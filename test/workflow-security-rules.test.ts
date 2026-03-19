import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

const githubExpression = (expression: string): string =>
    `\${{ ${expression} }}`;

describe("workflow security rules", () => {
    it("reports direct pull request title interpolation inside run steps", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  pull_request:",
                "jobs:",
                "  check-title:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                `      - run: echo "${githubExpression("github.event.pull_request.title")}"`,
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-untrusted-input-in-run": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-untrusted-input-in-run"
        );
    });

    it("accepts env indirection for untrusted pull request data in run steps", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  pull_request:",
                "jobs:",
                "  check-title:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - env:",
                `          PR_TITLE: ${githubExpression("github.event.pull_request.title")}`,
                '        run: echo "$PR_TITLE"',
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-untrusted-input-in-run": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports direct secret references in step if conditionals", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - name: Deploy",
                `        if: ${githubExpression("secrets.DEPLOY_TOKEN != ''")}`,
                "        run: ./deploy.sh",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-secrets-in-if": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-secrets-in-if"
        );
    });

    it("reports direct secret references in job if conditionals without expression wrappers", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  deploy:",
                "    if: secrets.DEPLOY_TOKEN != ''",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: ./deploy.sh",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-secrets-in-if": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("accepts env-based conditional checks derived from secrets", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  deploy:",
                "    runs-on: ubuntu-latest",
                "    env:",
                `      DEPLOY_TOKEN: ${githubExpression("secrets.DEPLOY_TOKEN")}`,
                "    steps:",
                "      - name: Deploy",
                `        if: ${githubExpression("env.DEPLOY_TOKEN != ''")}`,
                "        run: ./deploy.sh",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-secrets-in-if": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports pull_request_target workflows that checkout pull request head refs", async () => {
        const result = await lintWorkflow(
            [
                "name: Comment",
                "on:",
                "  pull_request_target:",
                "jobs:",
                "  annotate:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: actions/checkout@v5",
                "        with:",
                `          repository: ${githubExpression("github.event.pull_request.head.repo.full_name")}`,
                `          ref: ${githubExpression("github.event.pull_request.head.ref")}`,
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-pr-head-checkout-in-pull-request-target":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(2);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-pr-head-checkout-in-pull-request-target"
        );
    });

    it("accepts pull_request_target workflows that avoid pull request head checkout", async () => {
        const result = await lintWorkflow(
            [
                "name: Comment",
                "on:",
                "  pull_request_target:",
                "jobs:",
                "  annotate:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: actions/github-script@v8",
                "        with:",
                "          script: |",
                "            await github.rest.issues.createComment({",
                "              owner: context.repo.owner,",
                "              repo: context.repo.repo,",
                "              issue_number: context.issue.number,",
                "              body: 'Thanks for the PR!'",
                "            });",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-pr-head-checkout-in-pull-request-target":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports pull_request_target workflows without base branch filters", async () => {
        const result = await lintWorkflow(
            [
                "name: Comment",
                "on:",
                "  pull_request_target:",
                "    types:",
                "      - opened",
                "jobs:",
                "  annotate:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: echo comment",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-pull-request-target-branches":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-pull-request-target-branches"
        );
    });

    it("accepts pull_request_target workflows with base branch filters", async () => {
        const result = await lintWorkflow(
            [
                "name: Comment",
                "on:",
                "  pull_request_target:",
                "    types:",
                "      - opened",
                "    branches:",
                "      - main",
                "jobs:",
                "  annotate:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: echo comment",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-pull-request-target-branches":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports workflow_run triggers without branch filters", async () => {
        const result = await lintWorkflow(
            [
                "name: Follow up",
                "on:",
                "  workflow_run:",
                "    workflows: ['CI']",
                "    types: [completed]",
                "jobs:",
                "  notify:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: echo done",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-run-branches": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-workflow-run-branches"
        );
    });

    it("accepts workflow_run triggers scoped with branches", async () => {
        const result = await lintWorkflow(
            [
                "name: Follow up",
                "on:",
                "  workflow_run:",
                "    workflows: ['CI']",
                "    types: [completed]",
                "    branches:",
                "      - main",
                "jobs:",
                "  notify:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: echo done",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-run-branches": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("accepts workflow_run triggers scoped with branches-ignore", async () => {
        const result = await lintWorkflow(
            [
                "name: Follow up",
                "on:",
                "  workflow_run:",
                "    workflows: ['CI']",
                "    types: [completed]",
                "    branches-ignore:",
                "      - canary",
                "jobs:",
                "  notify:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: echo done",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-run-branches": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports self-hosted runners on fork-capable pull request events", async () => {
        const result = await lintWorkflow(
            [
                "name: PR validation",
                "on:",
                "  pull_request:",
                "jobs:",
                "  test:",
                "    runs-on:",
                "      - self-hosted",
                "      - linux",
                "    steps:",
                "      - run: npm test",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-self-hosted-runner-on-fork-pr-events":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-self-hosted-runner-on-fork-pr-events"
        );
    });

    it("reports self-hosted runner label mappings on issue_comment workflows", async () => {
        const result = await lintWorkflow(
            [
                "name: Comment automation",
                "on:",
                "  issue_comment:",
                "    types:",
                "      - created",
                "jobs:",
                "  triage:",
                "    runs-on:",
                "      labels:",
                "        - self-hosted",
                "        - linux",
                "    steps:",
                "      - run: echo triage",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-self-hosted-runner-on-fork-pr-events":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-self-hosted-runner-on-fork-pr-events"
        );
    });

    it("accepts GitHub-hosted runners on fork-capable pull request events", async () => {
        const result = await lintWorkflow(
            [
                "name: PR validation",
                "on:",
                "  pull_request_review:",
                "    types:",
                "      - submitted",
                "jobs:",
                "  test:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: npm test",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-self-hosted-runner-on-fork-pr-events":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });
});
