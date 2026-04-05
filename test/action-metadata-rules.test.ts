import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

const githubExpression = (expression: string): string =>
    `\${{ ${expression} }}`;

// eslint-disable-next-line max-lines-per-function -- Integration test catalog intentionally exercises many action-metadata rule permutations in one suite.
describe("action metadata rules", () => {
    it("does not run workflow-only rules on valid action metadata files under the all preset", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - name: Echo",
                "      run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "all",
                filePath: ".github/actions/example/action.yml",
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("prefers action.yml over action.yaml", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yaml",
                rules: {
                    "github-actions/prefer-action-yml": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("accepts action.yml metadata filenames", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - name: Echo",
                "      run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/prefer-action-yml": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports action.yaml metadata filenames regardless of extension casing", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.YAML",
                rules: {
                    "github-actions/prefer-action-yml": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("reports deprecated node runtimes", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: node16",
                "  main: dist/index.js",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-deprecated-node-runtime": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("accepts supported node runtimes", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: node20",
                "  main: dist/index.js",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-deprecated-node-runtime": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports node12 runtimes and ignores workflow files", async () => {
        const deprecatedResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: node12",
                "  main: dist/index.js",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-deprecated-node-runtime": "error",
                },
            }
        );

        const workflowFileResult = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: echo hi",
            ].join("\n"),
            {
                configName: "all",
                filePath: ".github/workflows/ci.yml",
                rules: {
                    "github-actions/no-deprecated-node-runtime": "error",
                },
            }
        );

        expect(deprecatedResult.messages).toHaveLength(1);
        expect(workflowFileResult.messages).toHaveLength(0);
    });

    it("ignores deprecated runtime checks for non-mapping roots, missing runs, and non-scalar using values", async () => {
        const nonMappingRootResult = await lintWorkflow("- node16", {
            configName: "actionMetadata",
            filePath: ".github/actions/example/action.yml",
            rules: {
                "github-actions/no-deprecated-node-runtime": "error",
            },
        });

        const noRunsResult = await lintWorkflow(
            ["name: Example", "description: Example action"].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-deprecated-node-runtime": "error",
                },
            }
        );

        const missingUsingResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  main: dist/index.js",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-deprecated-node-runtime": "error",
                },
            }
        );

        const nonScalarUsingResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using:",
                "    - node16",
                "  main: dist/index.js",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-deprecated-node-runtime": "error",
                },
            }
        );

        expect(nonMappingRootResult.messages).toHaveLength(0);
        expect(noRunsResult.messages).toHaveLength(0);
        expect(missingUsingResult.messages).toHaveLength(0);
        expect(nonScalarUsingResult.messages).toHaveLength(0);
    });

    it("reports pre-if without pre", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: node20",
                "  main: dist/index.js",
                "  pre-if: runner.os == 'Linux'",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-pre-if-without-pre": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("autofixes pre-if without pre by removing the orphaned key", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: node20",
                "  main: dist/index.js",
                "  pre-if: runner.os == 'Linux'",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                fix: true,
                rules: {
                    "github-actions/no-pre-if-without-pre": "error",
                },
            }
        );

        expect(result.output).toBe(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: node20",
                "  main: dist/index.js",
                "",
            ].join("\n")
        );
    });

    it("reports post-if without post", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: node20",
                "  main: dist/index.js",
                "  post-if: runner.os == 'Linux'",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-post-if-without-post": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("autofixes post-if without post by removing the orphaned key", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: node20",
                "  main: dist/index.js",
                "  post-if: runner.os == 'Linux'",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                fix: true,
                rules: {
                    "github-actions/no-post-if-without-post": "error",
                },
            }
        );

        expect(result.output).toBe(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: node20",
                "  main: dist/index.js",
                "",
            ].join("\n")
        );
    });

    it("reports required inputs with defaults", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  token:",
                "    description: API token",
                "    required: true",
                "    default: abc",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-required-input-with-default": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("offers suggestions to remove either required or default when both are set", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  token:",
                "    description: API token",
                "    required: true",
                "    default: abc",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-required-input-with-default": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]?.suggestions).toHaveLength(2);
        expect(
            result.messages[0]?.suggestions?.map(
                (suggestion) => suggestion.desc
            )
        ).toEqual([
            "Remove `required: true` from input 'token' and keep the default value.",
            "Remove the default value from input 'token' and keep it required.",
        ]);
        expect(
            result.messages[0]?.suggestions?.map(
                (suggestion) => suggestion.fix?.text
            )
        ).toEqual(["", ""]);
    });

    it("accepts inputs that are defaulted but not strictly required", async () => {
        const optionalInputResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  token:",
                "    description: API token",
                "    required: false",
                "    default: abc",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-required-input-with-default": "error",
                },
            }
        );

        const nonBooleanRequiredResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  token:",
                "    description: API token",
                "    required: 'true'",
                "    default: abc",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-required-input-with-default": "error",
                },
            }
        );

        expect(optionalInputResult.messages).toHaveLength(0);
        expect(nonBooleanRequiredResult.messages).toHaveLength(0);
    });

    it("ignores required-input-with-default checks outside action metadata and when inputs are missing", async () => {
        const workflowFileResult = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                configName: "all",
                filePath: ".github/workflows/ci.yml",
                rules: {
                    "github-actions/no-required-input-with-default": "error",
                },
            }
        );

        const noInputsResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-required-input-with-default": "error",
                },
            }
        );

        expect(workflowFileResult.messages).toHaveLength(0);
        expect(noInputsResult.messages).toHaveLength(0);
    });

    it("reports required inputs with null default values and skips non-mapping input entries", async () => {
        const nullDefaultResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  token:",
                "    description: API token",
                "    required: true",
                "    default:",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-required-input-with-default": "error",
                },
            }
        );

        const nonMappingInputResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  token: literal",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-required-input-with-default": "error",
                },
            }
        );

        expect(nullDefaultResult.messages).toHaveLength(1);
        expect(nonMappingInputResult.messages).toHaveLength(0);
    });

    it("reports case-insensitive input collisions", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  Token:",
                "    description: token",
                "  token:",
                "    description: token override",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-case-insensitive-input-id-collision":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("accepts distinct input ids without case-insensitive collisions", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  token:",
                "    description: token",
                "  timeout:",
                "    description: timeout",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - name: Echo",
                "      run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-case-insensitive-input-id-collision":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("ignores case-collision checks outside action metadata and without inputs", async () => {
        const nonActionFileResult = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                configName: "all",
                filePath: ".github/workflows/ci.yml",
                rules: {
                    "github-actions/no-case-insensitive-input-id-collision":
                        "error",
                },
            }
        );

        const noInputsResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-case-insensitive-input-id-collision":
                        "error",
                },
            }
        );

        expect(nonActionFileResult.messages).toHaveLength(0);
        expect(noInputsResult.messages).toHaveLength(0);
    });

    it("ignores non-scalar input keys and non-mapping roots", async () => {
        const nonScalarInputKeyResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  ? [token]",
                "  : generated",
                "  timeout:",
                "    description: timeout",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-case-insensitive-input-id-collision":
                        "error",
                },
            }
        );

        const nonMappingRootResult = await lintWorkflow("- token", {
            configName: "actionMetadata",
            filePath: ".github/actions/example/action.yml",
            rules: {
                "github-actions/no-case-insensitive-input-id-collision":
                    "error",
            },
        });

        expect(nonScalarInputKeyResult.messages).toHaveLength(0);
        expect(nonMappingRootResult.messages).toHaveLength(0);
    });

    it("reports INPUT_* env access in composite runs", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  token:",
                "    description: token",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - run: echo $INPUT_TOKEN",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-composite-input-env-access": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("accepts composite inputs context references and non-composite actions", async () => {
        const compositeResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  token:",
                "    description: token",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - name: Echo",
                `      run: echo ${githubExpression("inputs.token")}`,
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-composite-input-env-access": "error",
                },
            }
        );
        const nodeRuntimeResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: node20",
                "  main: dist/index.js",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-composite-input-env-access": "error",
                },
            }
        );

        expect(compositeResult.messages).toHaveLength(0);
        expect(nodeRuntimeResult.messages).toHaveLength(0);
    });

    it("ignores composite INPUT env checks outside action metadata files and for lowercase env names", async () => {
        const workflowFileResult = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: echo $INPUT_TOKEN",
            ].join("\n"),
            {
                configName: "all",
                filePath: ".github/workflows/ci.yml",
                rules: {
                    "github-actions/no-composite-input-env-access": "error",
                },
            }
        );

        const lowercaseEnvResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - run: echo $input_token",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-composite-input-env-access": "error",
                },
            }
        );

        expect(workflowFileResult.messages).toHaveLength(0);
        expect(lowercaseEnvResult.messages).toHaveLength(0);
    });

    it("ignores composite INPUT env checks when root or runs mappings are missing", async () => {
        const nonMappingRootResult = await lintWorkflow("- item", {
            configName: "actionMetadata",
            filePath: ".github/actions/example/action.yml",
            rules: {
                "github-actions/no-composite-input-env-access": "error",
            },
        });

        const noRunsMappingResult = await lintWorkflow(
            ["name: Example", "description: Example action"].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-composite-input-env-access": "error",
                },
            }
        );

        expect(nonMappingRootResult.messages).toHaveLength(0);
        expect(noRunsMappingResult.messages).toHaveLength(0);
    });

    it("reports unknown composite input references", async () => {
        const unknownInputExpression = `${String.fromCodePoint(36, 123, 123)} inputs.missing }}`;

        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  token:",
                "    description: token",
                "runs:",
                "  using: composite",
                "  steps:",
                `    - run: echo ${unknownInputExpression}`,
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-unknown-input-reference-in-composite":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("accepts declared composite input references and ignores non-composite runtimes", async () => {
        const declaredInputExpression = `${String.fromCodePoint(36, 123, 123)} inputs.token }}`;

        const compositeResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  token:",
                "    description: token",
                "runs:",
                "  using: composite",
                "  steps:",
                `    - run: echo ${declaredInputExpression}`,
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-unknown-input-reference-in-composite":
                        "error",
                },
            }
        );

        const nonCompositeResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: node20",
                "  main: dist/index.js",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-unknown-input-reference-in-composite":
                        "error",
                },
            }
        );

        expect(compositeResult.messages).toHaveLength(0);
        expect(nonCompositeResult.messages).toHaveLength(0);
    });

    it("reports each distinct unknown composite input reference", async () => {
        const unknownOne = `${String.fromCodePoint(36, 123, 123)} inputs.missing_one }}`;
        const unknownTwo = `${String.fromCodePoint(36, 123, 123)} inputs.missing_two }}`;

        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
                "  steps:",
                `    - run: echo ${unknownOne}`,
                "      shell: bash",
                `    - run: echo ${unknownTwo}`,
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-unknown-input-reference-in-composite":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(2);
    });

    it("ignores unknown-input checks outside action metadata and when runs/root mappings are missing", async () => {
        const unknownInputExpression = `${String.fromCodePoint(36, 123, 123)} inputs.missing }}`;

        const nonActionFileResult = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                `      - run: echo ${unknownInputExpression}`,
            ].join("\n"),
            {
                configName: "all",
                filePath: ".github/workflows/ci.yml",
                rules: {
                    "github-actions/no-unknown-input-reference-in-composite":
                        "error",
                },
            }
        );

        const nonMappingRootResult = await lintWorkflow("- item", {
            configName: "actionMetadata",
            filePath: ".github/actions/example/action.yml",
            rules: {
                "github-actions/no-unknown-input-reference-in-composite":
                    "error",
            },
        });

        const noRunsResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  token:",
                "    description: token",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-unknown-input-reference-in-composite":
                        "error",
                },
            }
        );

        expect(nonActionFileResult.messages).toHaveLength(0);
        expect(nonMappingRootResult.messages).toHaveLength(0);
        expect(noRunsResult.messages).toHaveLength(0);
    });

    it("reports unused composite inputs", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  token:",
                "    description: token",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-unused-input-in-composite": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("accepts referenced composite inputs and only reports truly unused ones", async () => {
        const partiallyUsedResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  token:",
                "    description: token",
                "  environment:",
                "    description: environment",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - name: Use token",
                `      run: echo ${githubExpression("inputs.token")}`,
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-unused-input-in-composite": "error",
                },
            }
        );
        const fullyUsedResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  token:",
                "    description: token",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - name: Use token",
                `      run: echo ${githubExpression("inputs.token")}`,
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-unused-input-in-composite": "error",
                },
            }
        );

        expect(partiallyUsedResult.messages).toHaveLength(1);
        expect(partiallyUsedResult.messages[0]?.message).toContain(
            "environment"
        );
        expect(fullyUsedResult.messages).toHaveLength(0);
    });

    it("accepts hyphenated input references and ignores non-composite metadata", async () => {
        const referencedHyphenatedInputResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  deploy-env:",
                "    description: environment",
                "runs:",
                "  using: composite",
                "  steps:",
                `    - run: echo ${githubExpression("inputs.deploy-env")}`,
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-unused-input-in-composite": "error",
                },
            }
        );

        const nonCompositeResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  token:",
                "    description: token",
                "runs:",
                "  using: node20",
                "  main: dist/index.js",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-unused-input-in-composite": "error",
                },
            }
        );

        expect(referencedHyphenatedInputResult.messages).toHaveLength(0);
        expect(nonCompositeResult.messages).toHaveLength(0);
    });

    it("ignores unused-input checks outside action metadata files and when inputs or runs are missing", async () => {
        const workflowFileResult = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                `      - run: echo ${githubExpression("inputs.token")}`,
            ].join("\n"),
            {
                configName: "all",
                filePath: ".github/workflows/ci.yml",
                rules: {
                    "github-actions/no-unused-input-in-composite": "error",
                },
            }
        );

        const missingInputsResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-unused-input-in-composite": "error",
                },
            }
        );

        const missingRunsResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  token:",
                "    description: token",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-unused-input-in-composite": "error",
                },
            }
        );

        expect(workflowFileResult.messages).toHaveLength(0);
        expect(missingInputsResult.messages).toHaveLength(0);
        expect(missingRunsResult.messages).toHaveLength(0);
    });

    it("ignores unused-input checks when action metadata root is not a mapping", async () => {
        const result = await lintWorkflow("- token", {
            configName: "actionMetadata",
            filePath: ".github/actions/example/action.yml",
            rules: {
                "github-actions/no-unused-input-in-composite": "error",
            },
        });

        expect(result.messages).toHaveLength(0);
    });

    it("ignores non-scalar composite input keys when checking for unused inputs", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "inputs:",
                "  ? [token]",
                "  :",
                "    description: token",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-unused-input-in-composite": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports duplicate composite step ids", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - id: setup",
                "      run: echo setup",
                "      shell: bash",
                "    - id: setup",
                "      run: echo setup 2",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-duplicate-composite-step-id": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("accepts unique composite step ids and ignores non-composite runtimes", async () => {
        const compositeResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - id: setup",
                "      run: echo setup",
                "      shell: bash",
                "    - id: test",
                "      run: echo test",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-duplicate-composite-step-id": "error",
                },
            }
        );

        const nodeRuntimeResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: node20",
                "  main: dist/index.js",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-duplicate-composite-step-id": "error",
                },
            }
        );

        expect(compositeResult.messages).toHaveLength(0);
        expect(nodeRuntimeResult.messages).toHaveLength(0);
    });

    it("ignores duplicate-step-id checks when runs or steps are missing", async () => {
        const missingRunsResult = await lintWorkflow(
            ["name: Example", "description: Example action"].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-duplicate-composite-step-id": "error",
                },
            }
        );

        const missingStepsResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-duplicate-composite-step-id": "error",
                },
            }
        );

        expect(missingRunsResult.messages).toHaveLength(0);
        expect(missingStepsResult.messages).toHaveLength(0);
    });

    it("ignores non-mapping and id-less composite step entries for duplicate-id checks", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - echo-only",
                "    - run: echo one",
                "      shell: bash",
                "    - id: setup",
                "      run: echo setup",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-duplicate-composite-step-id": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports each repeated duplicate composite step-id occurrence", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - id: setup",
                "      run: echo setup",
                "      shell: bash",
                "    - id: setup",
                "      run: echo setup 2",
                "      shell: bash",
                "    - id: setup",
                "      run: echo setup 3",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/no-duplicate-composite-step-id": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(2);
    });

    it("requires names on composite steps", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - run: echo hi",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/require-composite-step-name": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("accepts composite steps that provide non-empty names", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - name: Setup",
                "      run: echo setup",
                "      shell: bash",
                "    - name: Test",
                "      run: echo test",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/require-composite-step-name": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("reports blank and non-scalar composite step names", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - name: '   '",
                "      run: echo blank",
                "      shell: bash",
                "    - name: {}",
                "      run: echo non-scalar",
                "      shell: bash",
                "    - name: Valid",
                "      run: echo valid",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/require-composite-step-name": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(2);
    });

    it("ignores composite-step-name checks when runs/steps are missing or runtime is not composite", async () => {
        const missingRunsResult = await lintWorkflow(
            ["name: Example", "description: Example action"].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/require-composite-step-name": "error",
                },
            }
        );

        const missingStepsResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/require-composite-step-name": "error",
                },
            }
        );

        const nonCompositeResult = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: node20",
                "  main: dist/index.js",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/require-composite-step-name": "error",
                },
            }
        );

        expect(missingRunsResult.messages).toHaveLength(0);
        expect(missingStepsResult.messages).toHaveLength(0);
        expect(nonCompositeResult.messages).toHaveLength(0);
    });

    it("ignores scalar step entries for composite-step-name checks", async () => {
        const result = await lintWorkflow(
            [
                "name: Example",
                "description: Example action",
                "runs:",
                "  using: composite",
                "  steps:",
                "    - echo-only",
                "    - name: Setup",
                "      run: echo setup",
                "      shell: bash",
            ].join("\n"),
            {
                configName: "actionMetadata",
                filePath: ".github/actions/example/action.yml",
                rules: {
                    "github-actions/require-composite-step-name": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });

    it("ignores require-composite-step-name outside action metadata files", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: echo hi",
            ].join("\n"),
            {
                configName: "all",
                filePath: ".github/workflows/ci.yml",
                rules: {
                    "github-actions/require-composite-step-name": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });
});
