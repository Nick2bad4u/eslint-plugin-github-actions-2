import { createRuleTester, getPluginRule } from "./_internal/ruleTester.js";

const ruleTester = createRuleTester();
const workflowFilename = ".github/workflows/ci.yml";
const actionFilename = "action.yml";

/** Build a workflow whose single job has the provided step lines. */
const workflowWithSteps = (...stepLines: readonly string[]): string =>
    [
        "on: push",
        "jobs:",
        "  build:",
        "    runs-on: ubuntu-latest",
        "    steps:",
        ...stepLines.map((line) => `      ${line}`),
        "",
    ].join("\n");

/** Build a composite action whose steps are provided verbatim. */
const compositeActionWithSteps = (
    using: string,
    ...stepLines: readonly string[]
): string =>
    [
        "name: Example",
        "description: Example action",
        "runs:",
        `  using: ${using}`,
        "  steps:",
        ...stepLines.map((line) => `    ${line}`),
        "",
    ].join("\n");

ruleTester.run("step-name-casing", getPluginRule("step-name-casing"), {
    invalid: [
        {
            code: workflowWithSteps(
                "- name: check out source",
                "  uses: actions/checkout@v7",
                `- name: run \`npm test\` on \${{ matrix.os }}`,
                "  run: npm test"
            ),
            errors: [
                {
                    data: {
                        caseTypes: "Title Case",
                        location: "job 'build'",
                        name: "check out source",
                        replacementName: "Check Out Source",
                    },
                    messageId: "stepNameDoesNotMatchCasing",
                },
                {
                    messageId: "stepNameDoesNotMatchCasing",
                },
            ],
            filename: workflowFilename,
            output: workflowWithSteps(
                "- name: Check Out Source",
                "  uses: actions/checkout@v7",
                `- name: Run \`npm test\` on \${{ matrix.os }}`,
                "  run: npm test"
            ),
        },
        {
            code: workflowWithSteps(
                `- name: run \${{ '}}lowercase' }}`,
                "  run: echo",
                `- name: run \${{ 'it''s }} done' }} now`,
                "  run: echo"
            ),
            errors: [
                { messageId: "stepNameDoesNotMatchCasing" },
                { messageId: "stepNameDoesNotMatchCasing" },
            ],
            filename: workflowFilename,
            output: workflowWithSteps(
                `- name: Run \${{ '}}lowercase' }}`,
                "  run: echo",
                `- name: Run \${{ 'it''s }} done' }} Now`,
                "  run: echo"
            ),
        },
        {
            code: workflowWithSteps('- name: "set up node.js"', "  run: echo"),
            errors: [{ messageId: "stepNameDoesNotMatchCasing" }],
            filename: workflowFilename,
            output: workflowWithSteps(
                '- name: "Set Up Node.js"',
                "  run: echo"
            ),
        },
        {
            code: workflowWithSteps("- name: 'set up node'", "  run: echo"),
            errors: [{ messageId: "stepNameDoesNotMatchCasing" }],
            filename: workflowFilename,
            output: workflowWithSteps("- name: 'Set Up Node'", "  run: echo"),
        },
        {
            code: workflowWithSteps(
                String.raw`- name: "set\tup"`,
                "  run: echo"
            ),
            errors: [{ messageId: "stepNameDoesNotMatchCasing" }],
            filename: workflowFilename,
            output: null,
        },
        {
            code: compositeActionWithSteps(
                "composite",
                "- name: install dependencies",
                "  run: npm ci",
                "  shell: bash"
            ),
            errors: [
                {
                    data: {
                        caseTypes: "Title Case",
                        location: "this composite action",
                        name: "install dependencies",
                        replacementName: "Install Dependencies",
                    },
                    messageId: "stepNameDoesNotMatchCasing",
                },
            ],
            filename: actionFilename,
            output: compositeActionWithSteps(
                "composite",
                "- name: Install Dependencies",
                "  run: npm ci",
                "  shell: bash"
            ),
        },
        {
            code: workflowWithSteps(
                "- name: Install Dependencies",
                "  run: npm ci"
            ),
            errors: [{ messageId: "stepNameDoesNotMatchCasing" }],
            filename: workflowFilename,
            options: ["snake_case"],
            output: workflowWithSteps(
                "- name: install_dependencies",
                "  run: npm ci"
            ),
        },
        {
            code: workflowWithSteps(
                "- name: install-dependencies",
                "  run: npm ci"
            ),
            errors: [{ messageId: "stepNameDoesNotMatchCasing" }],
            filename: workflowFilename,
            options: [{ snake_case: true, "Title Case": true }],
            output: null,
        },
    ],
    valid: [
        {
            code: workflowWithSteps(
                "- name: Check Out Source",
                "  uses: actions/checkout@v7",
                "- name: Set Up Node.js 22.x",
                "  uses: actions/setup-node@v7",
                "- name: Run `npm test` (CI)",
                "  run: npm test",
                `- name: \${{ matrix.step-name }}`,
                "  run: echo",
                "- run: echo unnamed",
                "- name: 3",
                "  run: echo",
                "- not a mapping"
            ),
            filename: workflowFilename,
        },
        {
            code: workflowWithSteps("- name: check out source", "  run: echo"),
            filename: workflowFilename,
            options: [{ ignores: ["check out source"] }],
        },
        {
            code: workflowWithSteps("- name: npm ci", "  run: npm ci"),
            filename: workflowFilename,
            options: [{ allowPattern: "^npm " }],
        },
        {
            code: workflowWithSteps(
                `- name: run on \${{ matrix.os }}`,
                "  run: echo"
            ),
            filename: workflowFilename,
            options: ["snake_case"],
        },
        {
            code: [
                "on: push",
                "jobs:",
                "  call:",
                "    uses: ./.github/workflows/shared.yml",
                "",
            ].join("\n"),
            filename: workflowFilename,
        },
        {
            code: compositeActionWithSteps(
                "composite",
                "- name: Install Dependencies",
                "  run: npm ci",
                "  shell: bash"
            ),
            filename: actionFilename,
        },
        {
            code: compositeActionWithSteps(
                "node24",
                "- name: install dependencies",
                "  run: npm ci"
            ),
            filename: actionFilename,
        },
        {
            code: "name: Example\ndescription: Example action\nruns:\n  using: composite\n",
            filename: actionFilename,
        },
        {
            code: "name: Example\n",
            filename: actionFilename,
        },
        {
            code: workflowWithSteps("- name: check out source", "  run: echo"),
            filename: "src/config.yml",
        },
        {
            code: "- not a mapping\n",
            filename: workflowFilename,
        },
    ],
});
