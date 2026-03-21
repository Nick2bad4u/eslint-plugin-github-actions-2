import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

const githubExpression = (expression: string): string =>
    `\${{ ${expression} }}`;

// eslint-disable-next-line max-lines-per-function -- Integration tests intentionally cover many workflow interface rule paths in one suite.
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

    it("autofixes all github.event.inputs occurrences within the same scalar", async () => {
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
                `    if: ${githubExpression("github.event.inputs.environment == 'prod' && github.event.inputs.environment != ''")}`,
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

        expect(result.output).not.toContain("github.event.inputs.environment");
        expect(result.output).toContain("inputs.environment == 'prod'");
        expect(result.output).toContain("inputs.environment != ''");
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

    it("does not report github.event.inputs references when workflow_dispatch is not configured", async () => {
        const result = await lintWorkflow(
            [
                "name: Deploy",
                "on:",
                "  push:",
                "jobs:",
                "  deploy:",
                "    runs-on: ubuntu-latest",
                `    if: ${githubExpression("github.event.inputs.environment == 'prod'")}`,
                "    steps:",
                `      - run: echo ${githubExpression("github.event.inputs.environment")}`,
            ].join("\n"),
            {
                rules: {
                    "github-actions/prefer-inputs-context": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("handles null-valued mapping entries while traversing workflow_dispatch documents", async () => {
        const result = await lintWorkflow(
            [
                "name: Deploy",
                "on:",
                "  workflow_dispatch:",
                "jobs:",
                "  deploy:",
                "    runs-on:",
                "    env:",
                "    steps:",
                "      - run: echo safe",
            ].join("\n"),
            {
                rules: {
                    "github-actions/prefer-inputs-context": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("ignores prefer-inputs-context when workflow_dispatch is not declared", async () => {
        const result = await lintWorkflow(
            [
                "name: Deploy",
                "on:",
                "  push:",
                "jobs:",
                "  deploy:",
                "    runs-on: ubuntu-latest",
                `    if: ${githubExpression("github.event.inputs.environment == 'prod'")}`,
            ].join("\n"),
            {
                rules: {
                    "github-actions/prefer-inputs-context": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("ignores non-string scalar values while traversing workflow_dispatch workflows", async () => {
        const result = await lintWorkflow(
            [
                "name: Deploy",
                "on:",
                "  workflow_dispatch:",
                "jobs:",
                "  deploy:",
                "    runs-on: ubuntu-latest",
                "    timeout-minutes: 5",
                "    steps:",
                "      - run: echo done",
            ].join("\n"),
            {
                rules: {
                    "github-actions/prefer-inputs-context": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("skips YAML alias nodes while traversing workflow_dispatch workflows", async () => {
        const result = await lintWorkflow(
            [
                "name: Deploy",
                "on:",
                "  workflow_dispatch:",
                "shared-env: &shared_env",
                "  GREETING: hello",
                "jobs:",
                "  deploy:",
                "    runs-on: ubuntu-latest",
                "    env: *shared_env",
                "    steps:",
                "      - run: echo done",
            ].join("\n"),
            {
                rules: {
                    "github-actions/prefer-inputs-context": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports legacy inputs usage even when escaped scalars do not produce a fix", async () => {
        const escapedGithubEventInputsExpression = String.raw`github\u002eevent\u002einputs\u002eenvironment == 'prod'`;

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
                `    if: "${githubExpression(escapedGithubEventInputsExpression)}"`,
            ].join("\n"),
            {
                fix: true,
                rules: {
                    "github-actions/prefer-inputs-context": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.output).toBeUndefined();
    });

    it("ignores prefer-inputs-context when workflow root is not a mapping", async () => {
        const result = await lintWorkflow("- workflow_dispatch", {
            rules: {
                "github-actions/prefer-inputs-context": "error",
            },
        });

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

    it("ignores require-workflow-call-input-type when workflow_call is not configured", async () => {
        const result = await lintWorkflow(
            [
                "name: Deploy",
                "on:",
                "  workflow_dispatch:",
                "    inputs:",
                "      environment:",
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

    it("ignores non-mapping workflow_call declarations and workflow_call without inputs", async () => {
        const scalarWorkflowCallResult = await lintWorkflow(
            [
                "name: Reusable deploy",
                "on:",
                "  workflow_call: true",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-call-input-type": "error",
                },
            }
        );
        const noInputsResult = await lintWorkflow(
            [
                "name: Reusable deploy",
                "on:",
                "  workflow_call:",
                "    secrets:",
                "      token:",
                "        required: true",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-call-input-type": "error",
                },
            }
        );

        expect(scalarWorkflowCallResult.messages).toHaveLength(0);
        expect(noInputsResult.messages).toHaveLength(0);
    });

    it("reports invalid reusable workflow input type values including null type entries", async () => {
        const result = await lintWorkflow(
            [
                "name: Reusable deploy",
                "on:",
                "  workflow_call:",
                "    inputs:",
                "      region:",
                "        description: Region",
                "        type:",
                "      retries:",
                "        description: Retries",
                "        type: integer",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-call-input-type": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(2);
        expect(
            result.messages.every(
                (message) =>
                    message.ruleId ===
                    "github-actions/require-workflow-call-input-type"
            )
        ).toBeTruthy();
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

    it("ignores require-workflow-interface-description when root or on/workflow_call mappings are missing", async () => {
        const nonMappingRootResult = await lintWorkflow("- workflow_dispatch", {
            rules: {
                "github-actions/require-workflow-interface-description":
                    "error",
            },
        });

        const noOnResult = await lintWorkflow(
            [
                "name: Deploy",
                "jobs:",
                "  deploy:",
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-interface-description":
                        "error",
                },
            }
        );

        const workflowDispatchWithoutInputsResult = await lintWorkflow(
            [
                "name: Deploy",
                "on:",
                "  workflow_dispatch:",
                "    types: [requested]",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-interface-description":
                        "error",
                },
            }
        );

        const nonMappingWorkflowCallResult = await lintWorkflow(
            [
                "name: Deploy",
                "on:",
                "  workflow_call: true",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-interface-description":
                        "error",
                },
            }
        );

        expect(nonMappingRootResult.messages).toHaveLength(0);
        expect(noOnResult.messages).toHaveLength(0);
        expect(workflowDispatchWithoutInputsResult.messages).toHaveLength(0);
        expect(nonMappingWorkflowCallResult.messages).toHaveLength(0);
    });

    it("reports invalid interface descriptions for non-mapping entries and null or blank values", async () => {
        const result = await lintWorkflow(
            [
                "name: Deploy",
                "on:",
                "  workflow_dispatch:",
                "    inputs:",
                "      ? [environment]",
                "      : generated",
                "      region:",
                "        description:",
                "        required: false",
                "        type: string",
                "  workflow_call:",
                "    inputs:",
                "      config-path:",
                "        description: '   '",
                "        required: true",
                "        type: string",
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
                '        run: echo "url=https://example.com" >> "$GITHUB_OUTPUT"',
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-workflow-interface-description":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(3);
        expect(
            result.messages.filter(
                (message) => message.messageId === "invalidDescription"
            )
        ).toHaveLength(2);
        expect(
            result.messages.filter(
                (message) => message.messageId === "missingDescription"
            )
        ).toHaveLength(1);
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

    it("reports unknown step references when a job defines no steps", async () => {
        const result = await lintWorkflow(
            [
                "name: Build",
                "on: push",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    outputs:",
                `      deployment-url: ${githubExpression("steps.publish.outputs.url")}`,
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

    it("handles null, non-string, sequence, and alias traversal nodes without false positives", async () => {
        const result = await lintWorkflow(
            [
                "name: Build",
                "on: push",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    timeout-minutes: 5",
                "    note:",
                "    matrixValues:",
                `      - ${githubExpression("steps.publish.outputs.url")}`,
                "    anchors:",
                "      list: &shared",
                "        - one",
                "    aliasList: *shared",
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

    it("uses the first matching step id when duplicates exist and ignores non-mapping step entries", async () => {
        const result = await lintWorkflow(
            [
                "name: Build",
                "on: push",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - id: publish",
                '        run: echo "url=https://example.com/one" >> "$GITHUB_OUTPUT"',
                "      - 123",
                "      - id: publish",
                '        run: echo "url=https://example.com/two" >> "$GITHUB_OUTPUT"',
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
