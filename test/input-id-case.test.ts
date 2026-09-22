import { createRuleTester, getPluginRule } from "./_internal/ruleTester.js";

const ruleTester = createRuleTester();
const actionFilename = "actions/example/action.yml";
const workflowFilename = ".github/workflows/example.yaml";

ruleTester.run("input-id-case", getPluginRule("input-id-case"), {
    invalid: [
        {
            code: "on:\n  workflow_call:\n    inputs: {BadInput: {type: string}}",
            errors: [
                {
                    data: { caseTypes: "kebab-case", inputId: "BadInput" },
                    messageId: "inputIdDoesNotMatchCasing",
                },
            ],
            filename: ".github/workflows/action.yml",
            output: null,
        },
        {
            code: "inputs:\n  BadInput:\n    description: Example\nruns:\n  using: composite\n  steps: []",
            errors: [
                {
                    column: 3,
                    data: { caseTypes: "kebab-case", inputId: "BadInput" },
                    endColumn: 11,
                    endLine: 2,
                    line: 2,
                    messageId: "inputIdDoesNotMatchCasing",
                    suggestions: [],
                },
            ],
            filename: actionFilename,
            output: null,
        },
        {
            code: "inputs:\n  bad_input: {}\nruns:\n  using: node24\n  main: index.js",
            errors: [
                {
                    data: { caseTypes: "kebab-case", inputId: "bad_input" },
                    messageId: "inputIdDoesNotMatchCasing",
                    suggestions: [],
                },
            ],
            filename: "action.yaml",
            output: null,
        },
        {
            code: "inputs:\n  BAD_INPUT: {}\nruns:\n  using: docker\n  image: Dockerfile",
            errors: [
                {
                    data: { caseTypes: "kebab-case", inputId: "BAD_INPUT" },
                    messageId: "inputIdDoesNotMatchCasing",
                    suggestions: [],
                },
            ],
            filename: actionFilename,
            output: null,
        },
        {
            code: "on:\n  workflow_call:\n    inputs:\n      BadInput: {type: string}\n  workflow_dispatch:\n    inputs:\n      bad_input: {type: string}",
            errors: [
                {
                    column: 7,
                    data: { caseTypes: "kebab-case", inputId: "BadInput" },
                    endColumn: 15,
                    endLine: 4,
                    line: 4,
                    messageId: "inputIdDoesNotMatchCasing",
                    suggestions: [],
                },
                {
                    column: 7,
                    data: { caseTypes: "kebab-case", inputId: "bad_input" },
                    endColumn: 16,
                    endLine: 7,
                    line: 7,
                    messageId: "inputIdDoesNotMatchCasing",
                    suggestions: [],
                },
            ],
            filename: workflowFilename,
            output: null,
        },
        {
            code: "inputs: {bad-input: {}}",
            errors: [
                {
                    data: { caseTypes: "snake_case", inputId: "bad-input" },
                    messageId: "inputIdDoesNotMatchCasing",
                },
            ],
            filename: actionFilename,
            options: ["snake_case"],
            output: null,
        },
        {
            code: "inputs: {BadInput: {}}",
            errors: [
                {
                    data: {
                        caseTypes: "camelCase, snake_case",
                        inputId: "BadInput",
                    },
                    messageId: "inputIdDoesNotMatchCasing",
                },
            ],
            filename: actionFilename,
            options: [{ camelCase: true, PascalCase: false, snake_case: true }],
            output: null,
        },
        {
            code: "inputs: {BadInput: {}}",
            errors: [
                {
                    data: { caseTypes: "kebab-case", inputId: "BadInput" },
                    messageId: "inputIdDoesNotMatchCasing",
                },
            ],
            filename: actionFilename,
            options: [{ ignores: ["badinput", "Bad*"], "kebab-case": false }],
            output: null,
        },
        {
            // Quotes and YAML tags preserve the declared identifier and report the whole key.
            code: "inputs:\n  'BadInput': {}\n  !!str AnotherBadInput: {}",
            errors: [
                {
                    column: 3,
                    data: { caseTypes: "kebab-case", inputId: "BadInput" },
                    endColumn: 13,
                    endLine: 2,
                    line: 2,
                    messageId: "inputIdDoesNotMatchCasing",
                },
                {
                    column: 3,
                    data: {
                        caseTypes: "kebab-case",
                        inputId: "AnotherBadInput",
                    },
                    endColumn: 24,
                    endLine: 3,
                    line: 3,
                    messageId: "inputIdDoesNotMatchCasing",
                },
            ],
            filename: actionFilename,
            output: null,
        },
        {
            // Anchors and tags wrapping the declaration mapping still allow direct keys to be inspected.
            code: "inputs: &inputs !!map\n  BadInput: {}",
            errors: [
                {
                    data: { caseTypes: "kebab-case", inputId: "BadInput" },
                    messageId: "inputIdDoesNotMatchCasing",
                },
            ],
            filename: actionFilename,
            output: null,
        },
        {
            // Casing validation does not depend on a well-formed input definition value.
            code: "inputs: {BadInput: null, AnotherBadInput: []}",
            errors: [
                {
                    data: { caseTypes: "kebab-case", inputId: "BadInput" },
                    messageId: "inputIdDoesNotMatchCasing",
                },
                {
                    data: {
                        caseTypes: "kebab-case",
                        inputId: "AnotherBadInput",
                    },
                    messageId: "inputIdDoesNotMatchCasing",
                },
            ],
            filename: actionFilename,
            output: null,
        },
    ],
    valid: [
        {
            code: "inputs: {BadInput: {}}\non:\n  workflow_call:\n    inputs: {good-input: {type: string}}",
            filename: ".github/workflows/action.yml",
        },
        {
            code: "inputs:\n  my-input: {}\n  another-input: {}\nruns:\n  using: composite\n  steps: []",
            filename: actionFilename,
        },
        {
            code: "on:\n  workflow_call:\n    inputs:\n      my-input: {type: string}\n  workflow_dispatch:\n    inputs:\n      another-input: {type: boolean}",
            filename: workflowFilename,
        },
        {
            code: "inputs: {myInput: {}}",
            filename: actionFilename,
            options: ["camelCase"],
        },
        {
            code: "inputs: {MyInput: {}}",
            filename: actionFilename,
            options: ["PascalCase"],
        },
        {
            code: "inputs: {MY_INPUT: {}}",
            filename: actionFilename,
            options: ["SCREAMING_SNAKE_CASE"],
        },
        {
            code: "inputs: {my_input: {}}",
            filename: actionFilename,
            options: ["snake_case"],
        },
        {
            code: "inputs: {My-Input: {}}",
            filename: actionFilename,
            options: ["Train-Case"],
        },
        {
            code: "inputs: {my-input: {}}",
            filename: actionFilename,
            options: ["kebab-case"],
        },
        {
            code: "inputs: {myInput: {}, my_input: {}, LEGACY_ID: {}}",
            filename: actionFilename,
            options: [
                { camelCase: true, ignores: ["LEGACY_ID"], snake_case: true },
            ],
        },
        {
            code: "inputs: {my-input: {}}",
            filename: actionFilename,
            options: [{}],
        },
        {
            code: "inputs: {my-input: {}}",
            filename: actionFilename,
            options: [{ camelCase: false, "kebab-case": false }],
        },
        {
            // Consumer input names belong to the external action or reusable workflow.
            code: "jobs:\n  call:\n    uses: owner/repo/.github/workflows/reuse.yml@v1\n    with: {BadInput: value}\n  run:\n    steps:\n      - uses: owner/action@v1\n        with: {AnotherBadInput: value}",
            filename: workflowFilename,
        },
        {
            code: "outputs: {BadOutput: {}}\nruns:\n  using: composite\n  steps:\n    - uses: owner/action@v1\n      with: {BadInput: value}",
            filename: actionFilename,
        },
        {
            code: "inputs: {BadInput: {}}\non:\n  push:\n    inputs: {BadInput: {}}\n  workflow_call:\n    outputs: {BadOutput: {}}",
            filename: workflowFilename,
        },
        {
            code: "inputs: {BadInput: {}}\non:\n  workflow_dispatch:\n    inputs: {BadInput: {}}",
            filename: "config/settings.yml",
        },
        { code: "", filename: actionFilename },
        { code: "[]", filename: actionFilename },
        { code: "inputs: []", filename: actionFilename },
        { code: "inputs: null", filename: actionFilename },
        {
            code: "on: [workflow_call, workflow_dispatch]",
            filename: workflowFilename,
        },
        {
            code: "on:\n  workflow_call: []\n  workflow_dispatch:\n    inputs: []",
            filename: workflowFilename,
        },
        {
            // Complex and alias keys are not literal input identifiers; merge keys are not declarations.
            code: "defaults: &defaults {BadInput: {}}\nkey: &key AnotherBadInput\ninputs:\n  <<: *defaults\n  ? [BadInput]\n  : {}\n  *key : {}\n  : {}",
            filename: actionFilename,
        },
        {
            // References to anchored mappings are intentionally not expanded.
            code: "defaults: &defaults {BadInput: {}}\ninputs: *defaults",
            filename: actionFilename,
        },
        {
            code: "on: push",
            filename: workflowFilename,
        },
    ],
});
