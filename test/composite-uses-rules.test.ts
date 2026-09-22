import { createRuleTester, getPluginRule } from "./_internal/ruleTester.js";

const SHA = "692973e3d937129bcbf40652eb9f2f61becf3332";
const actionFilename = "action.yml";

/** Build a composite action with one dependency at a stable report location. */
const compositeAction = (reference: string): string =>
    `name: Setup\nruns:\n  using: composite\n  steps:\n    - uses: ${reference}\n`;

const ruleTester = createRuleTester();

ruleTester.run(
    "pin-action-shas (composite actions)",
    getPluginRule("pin-action-shas"),
    {
        invalid: [
            ...[
                "action.yml",
                "action.yaml",
                "nested/action.yml",
                ".github/actions/setup/action.yaml",
                String.raw`C:\repo\action.yml`,
                String.raw`C:\repo\.github\actions\setup\action.yaml`,
            ].map((filename) => ({
                code: compositeAction("actions/checkout@v4"),
                errors: [{ column: 13, line: 5, messageId: "unpinnedAction" }],
                filename,
                output: null,
            })),
            ...[
                "actions/checkout@main",
                "actions/checkout@v4.2.0",
                "actions/checkout",
                "actions/checkout@",
                "owner/repo/subdirectory@v1",
                `actions/checkout@${SHA.slice(0, 39)}`,
                `actions/checkout@${SHA}a`,
                `actions/checkout@${SHA.toUpperCase()}`,
            ].map((reference) => ({
                code: compositeAction(reference),
                errors: [{ messageId: "unpinnedAction" }],
                filename: actionFilename,
                output: null,
            })),
            {
                code: "runs:\n  using: composite\n  steps:\n    - uses: 'actions/checkout@v4' # mutable tag\n    - uses: \"actions/cache@main\"\n    - uses: ./local\n    - run: echo done\n      shell: bash\n",
                errors: [
                    { messageId: "unpinnedAction" },
                    { messageId: "unpinnedAction" },
                ],
                filename: actionFilename,
                output: null,
            },
            {
                code: "runs:\n  using: composite\n  steps:\n    - &dependency\n      uses: &reference actions/checkout@v4\n    - *dependency\n",
                errors: [{ messageId: "unpinnedAction" }],
                filename: actionFilename,
                output: null,
            },
            {
                code: "jobs:\n  reuse:\n    uses: owner/repo/.github/workflows/ci.yml@main\n  build:\n    steps:\n      - uses: actions/checkout@v4\n",
                errors: [
                    { messageId: "unpinnedReusableWorkflow" },
                    { messageId: "unpinnedAction" },
                ],
                filename: ".github/workflows/action.yml",
                output: null,
            },
        ],
        valid: [
            ...[
                `actions/checkout@${SHA}`,
                `owner/repo/subdirectory@${SHA}`,
                "./local-action",
                "docker://alpine:3.20",
                `docker://alpine@sha256:${"a".repeat(64)}`,
            ].map((reference) => ({
                code: compositeAction(reference),
                filename: actionFilename,
            })),
            ...[
                "node20",
                "node24",
                "docker",
            ].map((using) => ({
                code: compositeAction("actions/checkout@v4").replace(
                    "using: composite",
                    `using: ${using}`
                ),
                filename: actionFilename,
            })),
            ...[
                "README.yml",
                "config.yaml",
                "nested/not-action.yaml",
            ].map((filename) => ({
                code: compositeAction("actions/checkout@v4"),
                filename,
            })),
            ...[
                "",
                "[]",
                "runs: []",
                "runs: {steps: [{uses: actions/checkout@v4}]}",
                "runs: {using: composite, steps: {uses: actions/checkout@v4}}",
                "runs: {using: composite, steps: [null, text, [], {}, {uses: }, {uses: []}, {uses: {ref: v4}}]}",
                "uses: actions/checkout@v4\nruns:\n  using: composite\n  steps:\n    - run: echo done\n      with:\n        uses: actions/checkout@v4\njobs:\n  unrelated:\n    uses: owner/repo/.github/workflows/ci.yml@v4\n",
            ].map((code) => ({ code, filename: actionFilename })),
            {
                // Workflow filenames keep their workflow semantics, even when named action.yml.
                code: compositeAction("actions/checkout@v4"),
                filename: ".github/workflows/action.yml",
            },
        ],
    }
);

ruleTester.run(
    "prefer-step-uses-style (composite actions)",
    getPluginRule("prefer-step-uses-style"),
    {
        invalid: [
            ...[
                "action.yml",
                "nested/action.yaml",
                String.raw`C:\repo\action.yaml`,
            ].map((filename) => ({
                code: compositeAction("actions/checkout@v4"),
                errors: [
                    {
                        data: { style: "release" },
                        messageId: "styleDisallowed",
                    },
                ],
                filename,
                output: null,
            })),
            {
                code: compositeAction("actions/checkout@main"),
                errors: [
                    { data: { style: "branch" }, messageId: "styleDisallowed" },
                ],
                filename: actionFilename,
                options: ["release"],
                output: null,
            },
            {
                code: compositeAction(`actions/checkout@${SHA}`),
                errors: [
                    { data: { style: "commit" }, messageId: "styleDisallowed" },
                ],
                filename: actionFilename,
                options: ["branch"],
                output: null,
            },
            {
                code: compositeAction("./local-action"),
                errors: [{ messageId: "repositoryActionDisallowed" }],
                filename: actionFilename,
                output: null,
            },
            {
                code: compositeAction("docker://alpine:3.20"),
                errors: [{ messageId: "dockerActionDisallowed" }],
                filename: actionFilename,
                output: null,
            },
            {
                code: compositeAction("actions/checkout@v4.2.0-beta.1"),
                errors: [
                    { data: { style: "branch" }, messageId: "styleDisallowed" },
                ],
                filename: actionFilename,
                options: ["release"],
                output: null,
            },
        ],
        valid: [
            {
                code: compositeAction(`actions/checkout@${SHA}`),
                filename: actionFilename,
            },
            ...["v4", "v4.2.0"].map((ref) => ({
                code: compositeAction(`actions/checkout@${ref}`),
                filename: "nested/action.yaml",
                options: ["release"],
            })),
            {
                code: compositeAction("actions/checkout@main"),
                filename: actionFilename,
                options: ["branch"],
            },
            {
                code: compositeAction("./local-action"),
                filename: actionFilename,
                options: [{ allowRepository: true, release: true }],
            },
            {
                code: compositeAction("docker://alpine:3.20"),
                filename: actionFilename,
                options: [{ allowDocker: true }],
            },
            {
                code: compositeAction("actions/checkout@v4"),
                filename: actionFilename,
                options: [{ ignores: ["actions/checkout@v4"] }],
            },
            {
                code: `runs:\n  using: composite\n  steps:\n    - uses: actions/checkout@v4\n    - uses: actions/cache@${SHA}\n`,
                filename: actionFilename,
                options: [{ commit: true, release: true }],
            },
            ...[
                "runs: {using: node24, steps: [{uses: actions/checkout@v4}]}",
                "runs: {using: docker, steps: [{uses: actions/checkout@v4}]}",
                "runs: {steps: [{uses: actions/checkout@v4}]}",
                "runs: {using: composite, steps: [null, text, [], {}, {uses: }, {uses: []}]}",
                "runs: {using: composite, steps: {uses: actions/checkout@v4}}",
                "runs: {using: composite, uses: actions/checkout@v4}",
                "jobs: {reuse: {uses: owner/repo/.github/workflows/ci.yml@v4}}",
                "[]",
            ].map((code) => ({ code, filename: actionFilename })),
            {
                code: compositeAction("actions/checkout@v4"),
                filename: "config.yml",
            },
            {
                code: compositeAction("actions/checkout@v4"),
                filename: ".github/workflows/action.yaml",
            },
        ],
    }
);
