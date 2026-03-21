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

    it("reports all supported untrusted event payload sources when interpolated in run steps", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  issue_comment:",
                "jobs:",
                "  audit:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                `      - run: echo "${githubExpression("github.event.issue.body")}"`,
                `      - run: echo "${githubExpression("github.event.comment.body")}"`,
                `      - run: echo "${githubExpression("github.event.review.body")}"`,
                `      - run: echo "${githubExpression("github.event.discussion.title")}"`,
                `      - run: echo "${githubExpression("github.event.discussion_comment.body")}"`,
                `      - run: echo "${githubExpression("github.event.client_payload.payload_value")}"`,
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-untrusted-input-in-run": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(6);
        expect(
            result.messages.every(
                (message) =>
                    message.ruleId ===
                    "github-actions/no-untrusted-input-in-run"
            )
        ).toBeTruthy();
    });

    it("ignores untrusted expressions when they are outside run scripts", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  pull_request:",
                "jobs:",
                "  audit:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: actions/github-script@v8",
                "        with:",
                `          script: ${githubExpression("github.event.pull_request.title")}`,
                `      - env:\n          PR_TITLE: ${githubExpression("github.event.pull_request.title")}\n        run: echo "$PR_TITLE"`,
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-untrusted-input-in-run": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("ignores no-untrusted-input-in-run when workflow or step shapes do not expose runnable scripts", async () => {
        const nonMappingRootResult = await lintWorkflow("- pull_request", {
            rules: {
                "github-actions/no-untrusted-input-in-run": "error",
            },
        });

        const noStepsResult = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  pull_request:",
                "jobs:",
                "  audit:",
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-untrusted-input-in-run": "error",
                },
            }
        );

        const nonMappingAndNoRunStepResult = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  pull_request:",
                "jobs:",
                "  audit:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - 123",
                "      - uses: actions/checkout@v5",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-untrusted-input-in-run": "error",
                },
            }
        );

        expect(nonMappingRootResult.messages).toHaveLength(0);
        expect(noStepsResult.messages).toHaveLength(0);
        expect(nonMappingAndNoRunStepResult.messages).toHaveLength(0);
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

    it("ignores no-secrets-in-if when workflow root is not a mapping", async () => {
        const result = await lintWorkflow("- secrets.DEPLOY_TOKEN", {
            rules: {
                "github-actions/no-secrets-in-if": "error",
            },
        });

        expect(result.messages).toHaveLength(0);
    });

    it("ignores no-secrets-in-if for jobs without steps", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  deploy:",
                `    if: ${githubExpression("env.DEPLOY_TOKEN != ''")}`,
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-secrets-in-if": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("ignores non-mapping step entries while checking no-secrets-in-if", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  deploy:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - not-a-step-mapping",
                "      - run: ./deploy.sh",
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

    it("reports scalar and sequence pull_request_target triggers without filters", async () => {
        const scalarResult = await lintWorkflow(
            [
                "name: Comment",
                "on: pull_request_target",
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
        const sequenceResult = await lintWorkflow(
            [
                "name: Comment",
                "on:",
                "  - pull_request_target",
                "  - push",
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

        expect(scalarResult.messages).toHaveLength(1);
        expect(sequenceResult.messages).toHaveLength(1);
    });

    it("accepts pull_request_target workflows filtered by branches-ignore", async () => {
        const result = await lintWorkflow(
            [
                "name: Comment",
                "on:",
                "  pull_request_target:",
                "    branches-ignore: canary",
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

    it("reports non-mapping pull_request_target trigger configuration", async () => {
        const result = await lintWorkflow(
            [
                "name: Comment",
                "on:",
                "  pull_request_target: opened",
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

    it("ignores pull_request_target branch rule when root/on mappings or trigger key are missing", async () => {
        const nonMappingRootResult = await lintWorkflow(
            "- pull_request_target",
            {
                rules: {
                    "github-actions/require-pull-request-target-branches":
                        "error",
                },
            }
        );

        const missingOnResult = await lintWorkflow(
            [
                "name: Comment",
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

        const scalarNonTargetOnResult = await lintWorkflow(
            [
                "name: Comment",
                "on: push",
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

        const missingPullRequestTargetKeyResult = await lintWorkflow(
            [
                "name: Comment",
                "on:",
                "  pull_request:",
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

        expect(nonMappingRootResult.messages).toHaveLength(0);
        expect(missingOnResult.messages).toHaveLength(0);
        expect(scalarNonTargetOnResult.messages).toHaveLength(0);
        expect(missingPullRequestTargetKeyResult.messages).toHaveLength(0);
    });

    it("reports pull_request_target with null or non-sequence branch filter values", async () => {
        const nullPullRequestTargetValueResult = await lintWorkflow(
            [
                "name: Comment",
                "on:",
                "  pull_request_target:",
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

        const nonSequenceBranchFilterResult = await lintWorkflow(
            [
                "name: Comment",
                "on:",
                "  pull_request_target:",
                "    branches:",
                "      main: true",
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

        expect(nullPullRequestTargetValueResult.messages).toHaveLength(1);
        expect(nonSequenceBranchFilterResult.messages).toHaveLength(1);
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

    it("reports non-mapping workflow_run trigger configuration", async () => {
        const result = await lintWorkflow(
            [
                "name: Follow up",
                "on:",
                "  workflow_run: completed",
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
    });

    it("accepts workflow_run triggers scoped with scalar branches", async () => {
        const result = await lintWorkflow(
            [
                "name: Follow up",
                "on:",
                "  workflow_run:",
                "    workflows: ['CI']",
                "    types: [completed]",
                "    branches: main",
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

    it("reports workflow_run triggers with empty branch filters", async () => {
        const result = await lintWorkflow(
            [
                "name: Follow up",
                "on:",
                "  workflow_run:",
                "    workflows: ['CI']",
                "    types: [completed]",
                "    branches: []",
                "    branches-ignore: '   '",
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

    it("ignores workflow_run branch rule when workflow root, on, or workflow_run are missing", async () => {
        const nonMappingRootResult = await lintWorkflow("- workflow_run", {
            rules: {
                "github-actions/require-workflow-run-branches": "error",
            },
        });

        const missingOnResult = await lintWorkflow(
            [
                "name: Follow up",
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

        const missingWorkflowRunKeyResult = await lintWorkflow(
            [
                "name: Follow up",
                "on:",
                "  push:",
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

        expect(nonMappingRootResult.messages).toHaveLength(0);
        expect(missingOnResult.messages).toHaveLength(0);
        expect(missingWorkflowRunKeyResult.messages).toHaveLength(0);
    });

    it("reports workflow_run with null value and non-sequence branch filter mappings", async () => {
        const nullWorkflowRunValueResult = await lintWorkflow(
            [
                "name: Follow up",
                "on:",
                "  workflow_run:",
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

        const nonSequenceBranchFilterResult = await lintWorkflow(
            [
                "name: Follow up",
                "on:",
                "  workflow_run:",
                "    workflows: ['CI']",
                "    branches:",
                "      main: true",
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

        expect(nullWorkflowRunValueResult.messages).toHaveLength(1);
        expect(nonSequenceBranchFilterResult.messages).toHaveLength(1);
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

    it("reports scalar and mapping self-hosted labels on fork-capable events", async () => {
        const scalarLabelResult = await lintWorkflow(
            [
                "name: PR validation",
                "on:",
                "  pull_request_target:",
                "jobs:",
                "  test:",
                "    runs-on: ' self-hosted '",
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

        const mappingScalarLabelsResult = await lintWorkflow(
            [
                "name: PR validation",
                "on:",
                "  pull_request_review_comment:",
                "jobs:",
                "  test:",
                "    runs-on:",
                "      labels: self-hosted",
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

        expect(scalarLabelResult.messages).toHaveLength(1);
        expect(mappingScalarLabelsResult.messages).toHaveLength(1);
    });

    it("ignores no-self-hosted-runner rule when events are not fork-capable or runs-on is null", async () => {
        const nonForkEventResult = await lintWorkflow(
            [
                "name: Build",
                "on:",
                "  push:",
                "jobs:",
                "  test:",
                "    runs-on: self-hosted",
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

        const nullRunsOnResult = await lintWorkflow(
            [
                "name: PR validation",
                "on:",
                "  pull_request:",
                "jobs:",
                "  test:",
                "    runs-on:",
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

        expect(nonForkEventResult.messages).toHaveLength(0);
        expect(nullRunsOnResult.messages).toHaveLength(0);
    });
});
