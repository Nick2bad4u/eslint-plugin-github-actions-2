import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

const githubExpression = (expression: string): string =>
    `\${{ ${expression} }}`;

describe("workflow interface rules", () => {
    it("reports workflow_dispatch expressions that use github.event.inputs", async () => {
        const result = await lintWorkflow(
            [
                "name: Deploy",
                "on:",
                "  workflow_dispatch:",
                "    inputs:",
                "      dry_run:",
                "        description: Run validation only",
                "        required: true",
                "        type: boolean",
                "jobs:",
                "  deploy:",
                "    runs-on: ubuntu-latest",
                `    if: ${githubExpression("github.event.inputs.dry_run")}`,
                "    steps:",
                "      - env:",
                `          DRY_RUN: ${githubExpression("github.event.inputs.dry_run")}`,
                '        run: echo "$DRY_RUN"',
            ].join("\n"),
            {
                rules: {
                    "github-actions/prefer-inputs-context": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(2);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/prefer-inputs-context"
        );
    });

    it("autofixes github.event.inputs references to inputs", async () => {
        const result = await lintWorkflow(
            [
                "name: Deploy",
                `run-name: "Deploy to ${githubExpression("github.event.inputs.environment")}"`,
                "on:",
                "  workflow_dispatch:",
                "    inputs:",
                "      environment:",
                "        description: Deployment target",
                "        required: true",
                "        type: string",
                "jobs:",
                "  deploy:",
                "    runs-on: ubuntu-latest",
                "    env:",
                `      ENVIRONMENT: ${githubExpression("github.event.inputs.environment")}`,
                "    steps:",
                '      - run: echo "Deploying"',
            ].join("\n"),
            {
                fix: true,
                rules: {
                    "github-actions/prefer-inputs-context": "error",
                },
            }
        );

        expect(result.output).toContain(githubExpression("inputs.environment"));
        expect(result.output).not.toContain("github.event.inputs.environment");
    });

    it("accepts workflow_dispatch expressions that already use inputs", async () => {
        const result = await lintWorkflow(
            [
                "name: Deploy",
                "on:",
                "  workflow_dispatch:",
                "    inputs:",
                "      environment:",
                "        description: Deployment target",
                "        required: true",
                "        type: string",
                "jobs:",
                "  deploy:",
                "    runs-on: ubuntu-latest",
                `    if: ${githubExpression("inputs.environment == 'prod'")}`,
                "    steps:",
                '      - run: echo "Deploying"',
            ].join("\n"),
            {
                rules: {
                    "github-actions/prefer-inputs-context": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports missing descriptions for workflow_dispatch inputs", async () => {
        const result = await lintWorkflow(
            [
                "name: Deploy",
                "on:",
                "  workflow_dispatch:",
                "    inputs:",
                "      environment:",
                "        required: true",
                "        type: environment",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-interface-description":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-workflow-interface-description"
        );
    });

    it("reports missing descriptions for reusable workflow secrets", async () => {
        const result = await lintWorkflow(
            [
                "name: Reusable deploy",
                "on:",
                "  workflow_call:",
                "    inputs:",
                "      config-path:",
                "        description: Path to the deployment config",
                "        required: true",
                "        type: string",
                "    secrets:",
                "      token:",
                "        required: true",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-interface-description":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-workflow-interface-description"
        );
    });

    it("reports missing types for reusable workflow inputs", async () => {
        const result = await lintWorkflow(
            [
                "name: Reusable deploy",
                "on:",
                "  workflow_call:",
                "    inputs:",
                "      dry_run:",
                "        description: Run validation only",
                "        required: false",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-call-input-type": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-workflow-call-input-type"
        );
    });

    it("reports unsupported reusable workflow input types", async () => {
        const result = await lintWorkflow(
            [
                "name: Reusable deploy",
                "on:",
                "  workflow_call:",
                "    inputs:",
                "      environment:",
                "        description: Deployment target",
                "        required: true",
                "        type: environment",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-call-input-type": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-workflow-call-input-type"
        );
    });

    it("accepts reusable workflow inputs with supported types", async () => {
        const result = await lintWorkflow(
            [
                "name: Reusable deploy",
                "on:",
                "  workflow_call:",
                "    inputs:",
                "      dry_run:",
                "        description: Run validation only",
                "        required: false",
                "        type: boolean",
                "      retries:",
                "        description: Retry budget",
                "        required: false",
                "        type: number",
                "      environment:",
                "        description: Deployment target",
                "        required: true",
                "        type: string",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-call-input-type": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports missing descriptions for reusable workflow outputs", async () => {
        const result = await lintWorkflow(
            [
                "name: Reusable deploy",
                "on:",
                "  workflow_call:",
                "    outputs:",
                "      deployment-url:",
                `        value: ${githubExpression("jobs.deploy.outputs.url")}`,
                "jobs:",
                "  deploy:",
                "    runs-on: ubuntu-latest",
                "    outputs:",
                `      url: ${githubExpression("steps.publish.outputs.url")}`,
                "    steps:",
                "      - id: publish",
                '        run: echo "url=https://example.com" >> $GITHUB_OUTPUT',
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-interface-description":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-workflow-interface-description"
        );
    });

    it("accepts described workflow_dispatch and workflow_call interfaces", async () => {
        const result = await lintWorkflow(
            [
                "name: Deploy",
                "on:",
                "  workflow_dispatch:",
                "    inputs:",
                "      environment:",
                "        description: Deployment target environment",
                "        required: true",
                "        type: environment",
                "  workflow_call:",
                "    inputs:",
                "      config-path:",
                "        description: Path to the deployment config",
                "        required: true",
                "        type: string",
                "    secrets:",
                "      token:",
                "        description: Token used to publish deployment state",
                "        required: true",
                "    outputs:",
                "      deployment-url:",
                "        description: Final deployment URL",
                `        value: ${githubExpression("jobs.deploy.outputs.url")}`,
                "jobs:",
                "  deploy:",
                "    runs-on: ubuntu-latest",
                "    outputs:",
                `      url: ${githubExpression("steps.publish.outputs.url")}`,
                "    steps:",
                "      - id: publish",
                '        run: echo "url=https://example.com" >> $GITHUB_OUTPUT',
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-interface-description":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports needs output references to jobs that are not listed in direct needs", async () => {
        const result = await lintWorkflow(
            [
                "name: Deploy",
                "on: push",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    outputs:",
                `      artifact-sha: ${githubExpression("steps.pkg.outputs.sha")}`,
                "    steps:",
                "      - id: pkg",
                '        run: echo "sha=abc123" >> "$GITHUB_OUTPUT"',
                "  deploy:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                `      - run: echo "${githubExpression("needs.build.outputs.artifact-sha")}"`,
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-unknown-job-output-reference": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-unknown-job-output-reference"
        );
    });

    it("reports unknown direct needs outputs", async () => {
        const result = await lintWorkflow(
            [
                "name: Deploy",
                "on: push",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    outputs:",
                `      artifact-sha: ${githubExpression("steps.pkg.outputs.sha")}`,
                "    steps:",
                "      - id: pkg",
                '        run: echo "sha=abc123" >> "$GITHUB_OUTPUT"',
                "  deploy:",
                "    needs: build",
                "    runs-on: ubuntu-latest",
                "    steps:",
                `      - run: echo "${githubExpression("needs.build.outputs.artifact_sha")}"`,
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-unknown-job-output-reference": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-unknown-job-output-reference"
        );
    });

    it("reports unknown reusable workflow job outputs", async () => {
        const result = await lintWorkflow(
            [
                "name: Reusable deploy",
                "on:",
                "  workflow_call:",
                "    outputs:",
                "      deployment-url:",
                "        description: Published deployment URL",
                `        value: ${githubExpression("jobs.deploy.outputs.deployment_url")}`,
                "jobs:",
                "  deploy:",
                "    runs-on: ubuntu-latest",
                "    outputs:",
                `      deployment-url: ${githubExpression("steps.publish.outputs.url")}`,
                "    steps:",
                "      - id: publish",
                '        run: echo "url=https://example.com" >> "$GITHUB_OUTPUT"',
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-unknown-job-output-reference": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-unknown-job-output-reference"
        );
    });

    it("accepts valid direct needs outputs and reusable workflow output mappings", async () => {
        const result = await lintWorkflow(
            [
                "name: Reusable deploy",
                "on:",
                "  workflow_call:",
                "    outputs:",
                "      deployment-url:",
                "        description: Published deployment URL",
                `        value: ${githubExpression("jobs.deploy.outputs.deployment-url")}`,
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    outputs:",
                `      artifact-sha: ${githubExpression("steps.pkg.outputs.sha")}`,
                "    steps:",
                "      - id: pkg",
                '        run: echo "sha=abc123" >> "$GITHUB_OUTPUT"',
                "  deploy:",
                "    needs: build",
                "    runs-on: ubuntu-latest",
                "    outputs:",
                `      deployment-url: ${githubExpression("steps.publish.outputs.url")}`,
                "    steps:",
                `      - run: echo "${githubExpression("needs.build.outputs.artifact-sha")}"`,
                "      - id: publish",
                '        run: echo "url=https://example.com" >> "$GITHUB_OUTPUT"',
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-unknown-job-output-reference": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("requires reusable workflow outputs to declare a value", async () => {
        const result = await lintWorkflow(
            [
                "name: Reusable deploy",
                "on:",
                "  workflow_call:",
                "    outputs:",
                "      deployment-url:",
                "        description: Published deployment URL",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-call-output-value":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-workflow-call-output-value"
        );
    });

    it("reports reusable workflow outputs that map directly from step outputs", async () => {
        const result = await lintWorkflow(
            [
                "name: Reusable deploy",
                "on:",
                "  workflow_call:",
                "    outputs:",
                "      deployment-url:",
                "        description: Published deployment URL",
                `        value: ${githubExpression("steps.publish.outputs.url")}`,
                "jobs:",
                "  deploy:",
                "    runs-on: ubuntu-latest",
                "    outputs:",
                `      deployment-url: ${githubExpression("steps.publish.outputs.url")}`,
                "    steps:",
                "      - id: publish",
                '        run: echo "url=https://example.com" >> "$GITHUB_OUTPUT"',
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-workflow-call-output-value":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-invalid-workflow-call-output-value"
        );
    });

    it("reports reusable workflow outputs that do not map from a job output", async () => {
        const result = await lintWorkflow(
            [
                "name: Reusable deploy",
                "on:",
                "  workflow_call:",
                "    outputs:",
                "      deployment-url:",
                "        description: Published deployment URL",
                `        value: ${githubExpression("github.ref")}`,
                "jobs:",
                "  deploy:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: echo deploy",
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-workflow-call-output-value":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-invalid-workflow-call-output-value"
        );
    });

    it("accepts reusable workflow outputs that combine allowed contexts with a job output mapping", async () => {
        const result = await lintWorkflow(
            [
                "name: Reusable deploy",
                "on:",
                "  workflow_call:",
                "    outputs:",
                "      deployment-summary:",
                "        description: Published deployment summary",
                `        value: ${githubExpression("format('{0}:{1}', inputs.target, jobs.deploy.outputs.url")}`,
                "jobs:",
                "  deploy:",
                "    runs-on: ubuntu-latest",
                "    outputs:",
                `      url: ${githubExpression("steps.publish.outputs.url")}`,
                "    steps:",
                "      - id: publish",
                '        run: echo "url=https://example.com" >> "$GITHUB_OUTPUT"',
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-invalid-workflow-call-output-value":
                        "error",
                    "github-actions/require-workflow-call-output-value":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports missing step ids in step context references", async () => {
        const result = await lintWorkflow(
            [
                "name: Build",
                "on: push",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    outputs:",
                `      deployment-url: ${githubExpression("steps.publish.outputs.url")}`,
                "    steps:",
                "      - id: package",
                '        run: echo "url=https://example.com" >> "$GITHUB_OUTPUT"',
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-unknown-step-reference": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-unknown-step-reference"
        );
    });

    it("reports step references before the referenced step has run", async () => {
        const result = await lintWorkflow(
            [
                "name: Build",
                "on: push",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                `      - run: echo "${githubExpression("steps.publish.outputs.url")}"`,
                "      - id: publish",
                '        run: echo "url=https://example.com" >> "$GITHUB_OUTPUT"',
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-unknown-step-reference": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/no-unknown-step-reference"
        );
    });

    it("accepts valid prior-step references and job outputs that read later final step data", async () => {
        const result = await lintWorkflow(
            [
                "name: Build",
                "on: push",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    outputs:",
                `      deployment-url: ${githubExpression("steps.publish.outputs.url")}`,
                "    steps:",
                "      - id: publish",
                '        run: echo "url=https://example.com" >> "$GITHUB_OUTPUT"',
                `      - run: echo "${githubExpression("steps.publish.outputs.url")}"`,
            ].join("\n"),
            {
                rules: {
                    "github-actions/no-unknown-step-reference": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });
});
