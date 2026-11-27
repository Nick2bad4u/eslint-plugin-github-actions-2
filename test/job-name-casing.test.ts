import { createRuleTester, getPluginRule } from "./_internal/ruleTester.js";

const ruleTester = createRuleTester();
const workflowFilename = ".github/workflows/ci.yml";

/** Build a workflow with one job whose `name` line is provided verbatim. */
const workflowWithJobName = (nameLine: string): string =>
    [
        "name: CI",
        "on: push",
        "jobs:",
        "  build:",
        `    ${nameLine}`,
        "    runs-on: ubuntu-latest",
        "    steps:",
        "      - run: echo",
        "",
    ].join("\n");

ruleTester.run("job-name-casing", getPluginRule("job-name-casing"), {
    invalid: [
        {
            code: workflowWithJobName("name: lint code and docs"),
            errors: [
                {
                    data: {
                        caseTypes: "Title Case",
                        jobId: "build",
                        name: "lint code and docs",
                        replacementName: "Lint Code and Docs",
                    },
                    messageId: "jobNameDoesNotMatchCasing",
                    suggestions: [
                        {
                            data: {
                                caseTypes: "Title Case",
                                jobId: "build",
                                name: "lint code and docs",
                                replacementName: "Lint Code and Docs",
                            },
                            messageId: "renameJobSuggestion",
                            output: workflowWithJobName(
                                "name: Lint Code and Docs"
                            ),
                        },
                    ],
                },
            ],
            filename: workflowFilename,
        },
        {
            code: workflowWithJobName(
                `name: "validate package on \${{ matrix.os }}"`
            ),
            errors: [
                {
                    messageId: "jobNameDoesNotMatchCasing",
                    suggestions: [
                        {
                            messageId: "renameJobSuggestion",
                            output: workflowWithJobName(
                                `name: "Validate Package on \${{ matrix.os }}"`
                            ),
                        },
                    ],
                },
            ],
            filename: workflowFilename,
        },
        ...[
            {
                fixedNameLine: `name: Run \${{ '}}lowercase' }}`,
                nameLine: `name: run \${{ '}}lowercase' }}`,
            },
            {
                fixedNameLine: `name: Run \${{ 'it''s }} done' }} Now`,
                nameLine: `name: run \${{ 'it''s }} done' }} now`,
            },
        ].map(({ fixedNameLine, nameLine }) => ({
            code: workflowWithJobName(nameLine),
            errors: [
                {
                    messageId: "jobNameDoesNotMatchCasing",
                    suggestions: [
                        {
                            messageId: "renameJobSuggestion",
                            output: workflowWithJobName(fixedNameLine),
                        },
                    ],
                },
            ],
            filename: workflowFilename,
        })),
        {
            code: workflowWithJobName("name: 'build ''and'' test'"),
            errors: [
                {
                    messageId: "jobNameDoesNotMatchCasing",
                    suggestions: [],
                },
            ],
            filename: workflowFilename,
        },
        {
            code: [
                "on: push",
                "jobs:",
                "  call:",
                "    name: call shared workflow",
                "    uses: ./.github/workflows/shared.yml",
                "",
            ].join("\n"),
            errors: [
                {
                    messageId: "jobNameDoesNotMatchCasing",
                    suggestions: [
                        {
                            messageId: "renameJobSuggestion",
                            output: [
                                "on: push",
                                "jobs:",
                                "  call:",
                                "    name: Call Shared Workflow",
                                "    uses: ./.github/workflows/shared.yml",
                                "",
                            ].join("\n"),
                        },
                    ],
                },
            ],
            filename: workflowFilename,
        },
        {
            code: workflowWithJobName("name: Build Docs"),
            errors: [
                {
                    data: {
                        caseTypes: "kebab-case",
                        jobId: "build",
                        name: "Build Docs",
                        replacementName: "build-docs",
                    },
                    messageId: "jobNameDoesNotMatchCasing",
                    suggestions: [
                        {
                            messageId: "renameJobSuggestion",
                            output: workflowWithJobName("name: build-docs"),
                        },
                    ],
                },
            ],
            filename: workflowFilename,
            options: ["kebab-case"],
        },
        {
            code: workflowWithJobName("name: build_docs"),
            errors: [
                {
                    data: {
                        caseTypes: "kebab-case, Title Case",
                        jobId: "build",
                        name: "build_docs",
                        replacementName: "",
                    },
                    messageId: "jobNameDoesNotMatchCasing",
                    suggestions: [],
                },
            ],
            filename: workflowFilename,
            options: [{ "kebab-case": true, "Title Case": true }],
        },
        {
            code: workflowWithJobName("name: |\n      lint code"),
            errors: [
                {
                    messageId: "jobNameDoesNotMatchCasing",
                    suggestions: [],
                },
            ],
            filename: workflowFilename,
        },
    ],
    valid: [
        ...[
            "name: Lint Code and Documentation",
            `name: Validate Package on \${{ matrix.entry.os }}`,
            `name: \${{ matrix.name }}`,
            "name: Build & Test (Linux)",
            "name: CodeQL Analysis",
            'name: ""',
            "name: 42",
            "if: always()",
        ].map((nameLine) => ({
            code: workflowWithJobName(nameLine),
            filename: workflowFilename,
        })),
        {
            code: workflowWithJobName("name: build docs"),
            filename: ".github/dependabot.yml",
        },
        {
            code: workflowWithJobName("name: build docs"),
            filename: workflowFilename,
            options: [{ ignores: ["build docs"] }],
        },
        {
            code: workflowWithJobName("name: codeQL scan"),
            filename: workflowFilename,
            options: [{ allowPattern: "^codeQL" }],
        },
        {
            code: workflowWithJobName("name: build-docs"),
            filename: workflowFilename,
            options: ["kebab-case"],
        },
        {
            code: workflowWithJobName(`name: build \${{ matrix.os }}`),
            filename: workflowFilename,
            options: ["kebab-case"],
        },
        {
            code: "on: push\njobs: []\n",
            filename: workflowFilename,
        },
        {
            code: "- not a mapping\n",
            filename: workflowFilename,
        },
    ],
});
