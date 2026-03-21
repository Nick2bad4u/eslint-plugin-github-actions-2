import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import * as path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

const temporaryDirectories: string[] = [];

const createTemporaryTemplateDirectory = (): string => {
    const temporaryRoot = path.join(process.cwd(), "temp");

    mkdirSync(temporaryRoot, {
        recursive: true,
    });

    const temporaryDirectory = mkdtempSync(
        path.join(temporaryRoot, "eslint-plugin-github-actions-2-templates-")
    );

    mkdirSync(path.join(temporaryDirectory, "workflow-templates"), {
        recursive: true,
    });

    temporaryDirectories.push(temporaryDirectory);

    return temporaryDirectory;
};

describe("workflow template rules", () => {
    // eslint-disable-next-line vitest/no-hooks -- shared temp-directory cleanup after each isolated test case
    afterEach(() => {
        for (const temporaryDirectory of temporaryDirectories.splice(0)) {
            rmSync(temporaryDirectory, {
                force: true,
                recursive: true,
            });
        }
    });

    it("requires template YAML files to have paired properties metadata", async () => {
        const temporaryDirectory = createTemporaryTemplateDirectory();
        const templateYamlPath = path.join(
            temporaryDirectory,
            "workflow-templates",
            "ci.yml"
        );

        const result = await lintWorkflow(
            [
                "name: CI Template",
                "on:",
                "  push:",
                "    branches: [$default-branch]",
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: echo hi",
            ].join("\n"),
            {
                configName: "workflowTemplates",
                filePath: templateYamlPath,
                rules: {
                    "github-actions/require-workflow-template-pair": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("requires properties files to have paired template YAML", async () => {
        const temporaryDirectory = createTemporaryTemplateDirectory();
        const templatePropertiesPath = path.join(
            temporaryDirectory,
            "workflow-templates",
            "ci.properties.json"
        );

        const result = await lintWorkflow(
            [
                "{",
                '  "name": "CI Template",',
                '  "description": "Template",',
                '  "iconName": "workflow",',
                '  "categories": ["JavaScript"],',
                '  "filePatterns": ["package.json$"]',
                "}",
            ].join("\n"),
            {
                configName: "workflowTemplateProperties",
                filePath: templatePropertiesPath,
                rules: {
                    "github-actions/require-workflow-template-properties-pair":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("validates filePatterns regex syntax", async () => {
        const result = await lintWorkflow(
            [
                "{",
                '  "name": "CI Template",',
                '  "description": "Template",',
                '  "iconName": "workflow",',
                '  "categories": ["JavaScript"],',
                '  "filePatterns": ["["]',
                "}",
            ].join("\n"),
            {
                configName: "workflowTemplateProperties",
                filePath: ".github/workflow-templates/ci.properties.json",
                rules: {
                    "github-actions/no-invalid-template-file-pattern-regex":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("reports empty and universal filePatterns", async () => {
        const emptyPatternResult = await lintWorkflow(
            [
                "{",
                '  "name": "CI Template",',
                '  "description": "Template",',
                '  "iconName": "workflow",',
                '  "categories": ["JavaScript"],',
                '  "filePatterns": ["  "]',
                "}",
            ].join("\n"),
            {
                configName: "workflowTemplateProperties",
                filePath: ".github/workflow-templates/ci.properties.json",
                rules: {
                    "github-actions/no-empty-template-file-pattern": "error",
                },
            }
        );
        const universalPatternResult = await lintWorkflow(
            [
                "{",
                '  "name": "CI Template",',
                '  "description": "Template",',
                '  "iconName": "workflow",',
                '  "categories": ["JavaScript"],',
                '  "filePatterns": [".*"]',
                "}",
            ].join("\n"),
            {
                configName: "workflowTemplateProperties",
                filePath: ".github/workflow-templates/ci.properties.json",
                rules: {
                    "github-actions/no-universal-template-file-pattern":
                        "error",
                },
            }
        );

        expect(emptyPatternResult.messages).toHaveLength(1);
        expect(universalPatternResult.messages).toHaveLength(1);
    });

    it("rejects subdirectory template file patterns", async () => {
        const result = await lintWorkflow(
            [
                "{",
                '  "name": "CI Template",',
                '  "description": "Template",',
                '  "iconName": "workflow",',
                '  "categories": ["JavaScript"],',
                String.raw`  "filePatterns": ["src/.*\.ts$"]`,
                "}",
            ].join("\n"),
            {
                configName: "workflowTemplateProperties",
                filePath: ".github/workflow-templates/ci.properties.json",
                rules: {
                    "github-actions/no-subdirectory-template-file-pattern":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("validates iconName formatting and local icon file existence", async () => {
        const temporaryDirectory = createTemporaryTemplateDirectory();
        const templatePropertiesPath = path.join(
            temporaryDirectory,
            "workflow-templates",
            "ci.properties.json"
        );

        const extensionResult = await lintWorkflow(
            [
                "{",
                '  "name": "CI Template",',
                '  "description": "Template",',
                '  "iconName": "workflow.svg",',
                '  "categories": ["JavaScript"],',
                '  "filePatterns": ["package.json$"]',
                "}",
            ].join("\n"),
            {
                configName: "workflowTemplateProperties",
                filePath: templatePropertiesPath,
                rules: {
                    "github-actions/no-icon-file-extension-in-template-icon-name":
                        "error",
                },
            }
        );
        const pathSeparatorResult = await lintWorkflow(
            [
                "{",
                '  "name": "CI Template",',
                '  "description": "Template",',
                '  "iconName": "icons/workflow",',
                '  "categories": ["JavaScript"],',
                '  "filePatterns": ["package.json$"]',
                "}",
            ].join("\n"),
            {
                configName: "workflowTemplateProperties",
                filePath: templatePropertiesPath,
                rules: {
                    "github-actions/no-path-separators-in-template-icon-name":
                        "error",
                },
            }
        );
        const missingIconResult = await lintWorkflow(
            [
                "{",
                '  "name": "CI Template",',
                '  "description": "Template",',
                '  "iconName": "workflow",',
                '  "categories": ["JavaScript"],',
                '  "filePatterns": ["package.json$"]',
                "}",
            ].join("\n"),
            {
                configName: "workflowTemplateProperties",
                filePath: templatePropertiesPath,
                rules: {
                    "github-actions/require-template-icon-file-exists": "error",
                },
            }
        );

        writeFileSync(
            path.join(temporaryDirectory, "workflow-templates", "workflow.svg"),
            "<svg></svg>",
            "utf8"
        );

        const existingIconResult = await lintWorkflow(
            [
                "{",
                '  "name": "CI Template",',
                '  "description": "Template",',
                '  "iconName": "workflow",',
                '  "categories": ["JavaScript"],',
                '  "filePatterns": ["package.json$"]',
                "}",
            ].join("\n"),
            {
                configName: "workflowTemplateProperties",
                filePath: templatePropertiesPath,
                rules: {
                    "github-actions/require-template-icon-file-exists": "error",
                },
            }
        );

        expect(extensionResult.messages).toHaveLength(1);
        expect(pathSeparatorResult.messages).toHaveLength(1);
        expect(missingIconResult.messages).toHaveLength(1);
        expect(existingIconResult.messages).toHaveLength(0);
    });

    it("requires iconName, categories, and filePatterns", async () => {
        const resultIconName = await lintWorkflow(
            ['{"name":"CI","description":"Template"}'].join("\n"),
            {
                configName: "workflowTemplateProperties",
                filePath: ".github/workflow-templates/ci.properties.json",
                rules: {
                    "github-actions/require-template-icon-name": "error",
                },
            }
        );
        const resultCategories = await lintWorkflow(
            ['{"name":"CI","description":"Template"}'].join("\n"),
            {
                configName: "workflowTemplateProperties",
                filePath: ".github/workflow-templates/ci.properties.json",
                rules: {
                    "github-actions/require-template-categories": "error",
                },
            }
        );
        const resultFilePatterns = await lintWorkflow(
            ['{"name":"CI","description":"Template"}'].join("\n"),
            {
                configName: "workflowTemplateProperties",
                filePath: ".github/workflow-templates/ci.properties.json",
                rules: {
                    "github-actions/require-template-file-patterns": "error",
                },
            }
        );

        expect(resultIconName.messages).toHaveLength(1);
        expect(resultCategories.messages).toHaveLength(1);
        expect(resultFilePatterns.messages).toHaveLength(1);
    });

    it("enforces template-specific YAML extension and name/branch conventions", async () => {
        const extensionResult = await lintWorkflow(
            [
                "name: CI Template",
                "on:",
                "  push:",
                "    branches: [main]",
            ].join("\n"),
            {
                configName: "workflowTemplates",
                filePath: ".github/workflow-templates/ci.yaml",
                rules: {
                    "github-actions/prefer-template-yml-extension": "error",
                },
            }
        );
        const missingNameResult = await lintWorkflow(
            [
                "on:",
                "  push:",
                "    branches: [$default-branch]",
            ].join("\n"),
            {
                configName: "workflowTemplates",
                filePath: ".github/workflow-templates/ci.yml",
                rules: {
                    "github-actions/require-template-workflow-name": "error",
                },
            }
        );
        const hardcodedDefaultBranchResult = await lintWorkflow(
            [
                "name: CI Template",
                "on:",
                "  push:",
                "    branches: [main]",
            ].join("\n"),
            {
                configName: "workflowTemplates",
                filePath: ".github/workflow-templates/ci.yml",
                rules: {
                    "github-actions/no-hardcoded-default-branch-in-template":
                        "error",
                },
            }
        );

        expect(extensionResult.messages).toHaveLength(1);
        expect(missingNameResult.messages).toHaveLength(1);
        expect(hardcodedDefaultBranchResult.messages).toHaveLength(1);
    });

    it("rejects template placeholder usage in non-template workflows", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "    branches: [$default-branch]",
                "jobs:",
                "  test:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - run: echo hi",
            ].join("\n"),
            {
                configName: "all",
                filePath: ".github/workflows/ci.yml",
                rules: {
                    "github-actions/no-template-placeholder-in-non-template-workflow":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });
});
