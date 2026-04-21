import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

describe("uses and timeout rules", () => {
    it("reports step uses references that do not match the configured style", async () => {
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
                "    steps:",
                "      - name: Checkout",
                "        uses: actions/checkout@v4",
            ].join("\n"),
            {
                rules: {
                    "github-actions/prefer-step-uses-style": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/prefer-step-uses-style"
        );
    });

    it("accepts commit-style step uses references by default", async () => {
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
                "    steps:",
                "      - name: Checkout",
                "        uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332",
            ].join("\n"),
            {
                rules: {
                    "github-actions/prefer-step-uses-style": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports repository-local and docker uses references by default", async () => {
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
                "    steps:",
                "      - name: Local action",
                "        uses: ./.github/actions/setup",
                "      - name: Docker action",
                "        uses: docker://alpine:3.20",
            ].join("\n"),
            {
                rules: {
                    "github-actions/prefer-step-uses-style": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(2);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/prefer-step-uses-style"
        );
    });

    it("accepts repository-local and docker uses references when explicitly allowed", async () => {
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
                "    steps:",
                "      - name: Local action",
                "        uses: ./.github/actions/setup",
                "      - name: Docker action",
                "        uses: docker://alpine:3.20",
            ].join("\n"),
            {
                rules: {
                    "github-actions/prefer-step-uses-style": [
                        "error",
                        {
                            allowDocker: true,
                            allowRepository: true,
                        },
                    ],
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("supports release-style configuration and ignored references", async () => {
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
                "    steps:",
                "      - name: Checkout",
                "        uses: actions/checkout@v4",
                "      - name: Setup node",
                "        uses: actions/setup-node@main",
            ].join("\n"),
            {
                rules: {
                    "github-actions/prefer-step-uses-style": [
                        "error",
                        {
                            ignores: ["actions/setup-node@main"],
                            release: true,
                        },
                    ],
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("falls back to commit-style when object options enable no style flags", async () => {
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
                "    steps:",
                "      - name: Setup node",
                "        uses: actions/setup-node@main",
            ].join("\n"),
            {
                rules: {
                    "github-actions/prefer-step-uses-style": [
                        "error",
                        {
                            branch: false,
                            release: false,
                        },
                    ],
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/prefer-step-uses-style"
        );
    });

    it("reports invalid timeout-minutes values", async () => {
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
                "    timeout-minutes: 0",
            ].join("\n"),
            {
                rules: {
                    "github-actions/valid-timeout-minutes": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/valid-timeout-minutes"
        );
    });

    it("accepts GitHub expressions for timeout-minutes", async () => {
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
                [
                    "    timeout-minutes: $",
                    "{{ fromJSON(vars.JOB_TIMEOUT_MINUTES) }}",
                ].join(""),
            ].join("\n"),
            {
                rules: {
                    "github-actions/valid-timeout-minutes": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("requires run steps to declare an explicit shell when none is inherited", async () => {
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
                "    steps:",
                "      - name: Install dependencies",
                "        run: npm ci",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-run-step-shell": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-run-step-shell"
        );
    });

    it("accepts run steps with an explicit shell", async () => {
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
                "    steps:",
                "      - name: Install dependencies",
                "        shell: bash",
                "        run: npm ci",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-run-step-shell": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("accepts run steps that inherit a workflow default shell", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "defaults:",
                "  run:",
                "    shell: bash",
                "jobs:",
                "  build:",
                "    name: Build",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - name: Install dependencies",
                "        run: npm ci",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-run-step-shell": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("accepts run steps that inherit a job-level default shell", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    defaults:",
                "      run:",
                "        shell: bash",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - name: Install dependencies",
                "        run: npm ci",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-run-step-shell": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports invalid empty shell declarations at workflow, job, and step scope", async () => {
        expect.hasAssertions();

        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "defaults:",
                "  run:",
                "    shell: '   '",
                "jobs:",
                "  build:",
                "    defaults:",
                "      run:",
                "        shell: ''",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - name: Install dependencies",
                "        shell: '  '",
                "        run: npm ci",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-run-step-shell": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(3);
        expect(
            result.messages.every(
                (message) =>
                    message.ruleId === "github-actions/require-run-step-shell"
            )
        ).toBeTruthy();
    });

    it("accepts branch-style references when branch style is explicitly enabled", async () => {
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
                "    steps:",
                "      - name: Setup node",
                "        uses: actions/setup-node@main",
            ].join("\n"),
            {
                rules: {
                    "github-actions/prefer-step-uses-style": [
                        "error",
                        {
                            branch: true,
                        },
                    ],
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });
});
