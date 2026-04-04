import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

describe("job identity rules", () => {
    it("reports job ids that do not match the configured casing", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  BuildApp:",
                "    runs-on: ubuntu-latest",
                "    name: Build App",
            ].join("\n"),
            {
                rules: {
                    "github-actions/job-id-casing": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe("github-actions/job-id-casing");
    });

    it("accepts kebab-case job ids with the default configuration", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build-app:",
                "    runs-on: ubuntu-latest",
                "    name: Build App",
            ].join("\n"),
            {
                rules: {
                    "github-actions/job-id-casing": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("accepts configured alternate casing and ignored job ids", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  BuildApp:",
                "    runs-on: ubuntu-latest",
                "    name: Build App",
                "  LEGACY_JOB:",
                "    runs-on: ubuntu-latest",
                "    name: Legacy",
            ].join("\n"),
            {
                rules: {
                    "github-actions/job-id-casing": [
                        "error",
                        {
                            ignores: ["LEGACY_JOB"],
                            PascalCase: true,
                        },
                    ],
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("accepts case-police canonical Train-Case job ids", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  GitHub-Build:",
                "    runs-on: ubuntu-latest",
                "    name: Build App",
            ].join("\n"),
            {
                rules: {
                    "github-actions/job-id-casing": [
                        "error",
                        {
                            "Train-Case": true,
                        },
                    ],
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("falls back to default casing when no casing flags are enabled", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  BuildApp:",
                "    runs-on: ubuntu-latest",
                "    name: Build App",
            ].join("\n"),
            {
                rules: {
                    "github-actions/job-id-casing": [
                        "error",
                        {
                            PascalCase: false,
                            snake_case: false,
                        },
                    ],
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe("github-actions/job-id-casing");
    });

    it("requires every job to declare a name", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-job-name": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-job-name"
        );
        expect(result.messages[0]?.suggestions).toHaveLength(1);
        expect(result.messages[0]?.suggestions?.[0]?.desc).toBe(
            "Insert `name: build` for this job."
        );
        expect(result.messages[0]?.suggestions?.[0]?.fix?.text).toBe(
            '    name: "build"\n'
        );
    });

    it("requires every job step to declare a name", async () => {
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
                "      - run: npm test",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-job-step-name": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-job-step-name"
        );
        expect(result.messages[0]?.suggestions).toHaveLength(1);
        expect(result.messages[0]?.suggestions?.[0]?.desc).toBe(
            "Insert `name: npm test` for this step in job 'build'."
        );
        expect(result.messages[0]?.suggestions?.[0]?.fix?.text).toBe(
            '        name: "npm test"\n'
        );
    });

    it("accepts jobs and steps with non-empty names", async () => {
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
                "      - name: Install",
                "        run: npm ci",
                "      - name: Test",
                "        run: npm test",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-job-name": "error",
                    "github-actions/require-job-step-name": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports non-mapping jobs as missing names", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build: true",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-job-name": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-job-name"
        );
        expect(result.messages[0]?.message).toContain("build");
    });

    it("reports blank job names", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    name: '   '",
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-job-name": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-job-name"
        );
        expect(result.messages[0]?.suggestions).toHaveLength(1);
        expect(result.messages[0]?.suggestions?.[0]?.desc).toBe(
            "Replace the blank job name with `build`."
        );
        expect(result.messages[0]?.suggestions?.[0]?.fix?.text).toBe('"build"');
    });

    it("reports null job names and unknown job ids for non-scalar keys", async () => {
        const nullNameResult = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    name:",
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-job-name": "error",
                },
            }
        );

        const nonScalarKeyResult = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  ? [build]:",
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-job-name": "error",
                },
            }
        );

        expect(nullNameResult.messages).toHaveLength(1);
        expect(nonScalarKeyResult.messages).toHaveLength(1);
        expect(nonScalarKeyResult.messages[0]?.message).toContain("<unknown>");
    });

    it("ignores require-job-name when workflow root or jobs mapping is missing", async () => {
        const nonMappingRootResult = await lintWorkflow("- push", {
            rules: {
                "github-actions/require-job-name": "error",
            },
        });

        const noJobsResult = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-job-name": "error",
                },
            }
        );

        expect(nonMappingRootResult.messages).toHaveLength(0);
        expect(noJobsResult.messages).toHaveLength(0);
    });

    it("reports blank step names", async () => {
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
                "      - name: '  '",
                "        run: npm test",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-job-step-name": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-job-step-name"
        );
        expect(result.messages[0]?.suggestions).toHaveLength(1);
        expect(result.messages[0]?.suggestions?.[0]?.desc).toBe(
            "Replace the blank step name with `npm test` in job 'build'."
        );
        expect(result.messages[0]?.suggestions?.[0]?.fix?.text).toBe(
            '"npm test"'
        );
    });

    it("reports null step names", async () => {
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
                "      - name:",
                "        run: npm test",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-job-step-name": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-job-step-name"
        );
    });

    it("offers a uses-based step-name suggestion", async () => {
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
                "      - uses: actions/checkout@v4",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-job-step-name": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.suggestions).toHaveLength(1);
        expect(result.messages[0]?.suggestions?.[0]?.desc).toBe(
            "Insert `name: actions/checkout` for this step in job 'build'."
        );
        expect(result.messages[0]?.suggestions?.[0]?.fix?.text).toBe(
            '        name: "actions/checkout"\n'
        );
    });

    it("ignores non-mapping step entries while still validating mapping steps", async () => {
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
                "      - uses: actions/checkout@v4",
                "      - plain-string-step",
                "      - name: Test",
                "        run: npm test",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-job-step-name": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/require-job-step-name"
        );
    });

    it("ignores require-job-step-name when workflow root is non-mapping or jobs omit steps", async () => {
        const nonMappingRootResult = await lintWorkflow("- push", {
            rules: {
                "github-actions/require-job-step-name": "error",
            },
        });

        const noStepsResult = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                rules: {
                    "github-actions/require-job-step-name": "error",
                },
            }
        );

        expect(nonMappingRootResult.messages).toHaveLength(0);
        expect(noStepsResult.messages).toHaveLength(0);
    });

    it("reports workflows that exceed the configured job limit", async () => {
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
                "  four:",
                "    name: Four",
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                rules: {
                    "github-actions/max-jobs-per-action": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.ruleId).toBe(
            "github-actions/max-jobs-per-action"
        );
    });
});
