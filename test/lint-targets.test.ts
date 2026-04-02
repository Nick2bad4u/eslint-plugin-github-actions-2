import { describe, expect, it } from "vitest";

import {
    ACTION_METADATA_FILE_GLOBS,
    DEPENDABOT_FILE_GLOBS,
    getTemplateStem,
    isActionMetadataFile,
    isDependabotFile,
    isWorkflowTemplateFile,
    isWorkflowTemplatePropertiesFile,
    isWorkflowTemplateYamlFile,
    usesYamlExtension,
    WORKFLOW_TEMPLATE_FILE_GLOBS,
    WORKFLOW_TEMPLATE_PROPERTIES_FILE_GLOBS,
    WORKFLOW_TEMPLATE_YAML_FILE_GLOBS,
} from "../src/_internal/lint-targets.js";

describe("lint target helpers", () => {
    it("exports stable file-glob contracts", () => {
        expect(ACTION_METADATA_FILE_GLOBS).toEqual(["**/action.{yml,yaml}"]);
        expect(DEPENDABOT_FILE_GLOBS).toEqual([
            ".github/dependabot.{yml,yaml}",
        ]);
        expect(WORKFLOW_TEMPLATE_PROPERTIES_FILE_GLOBS).toEqual([
            "**/workflow-templates/*.properties.json",
        ]);
        expect(WORKFLOW_TEMPLATE_YAML_FILE_GLOBS).toEqual([
            "**/workflow-templates/*.{yml,yaml}",
        ]);
        expect(WORKFLOW_TEMPLATE_FILE_GLOBS).toEqual([
            "**/workflow-templates/*.{yml,yaml}",
            "**/workflow-templates/*.properties.json",
        ]);
    });

    it("detects action metadata files case-insensitively across path separators", () => {
        expect(
            isActionMetadataFile(".github/actions/setup-node/action.yml")
        ).toBeTruthy();
        expect(
            isActionMetadataFile(
                String.raw`C:\Repo\.GITHUB\ACTIONS\CACHE\ACTION.YAML`
            )
        ).toBeTruthy();
        expect(isActionMetadataFile(".github/workflows/ci.yml")).toBeFalsy();
        expect(isActionMetadataFile("action.yaml.backup")).toBeFalsy();
    });

    it("detects repository Dependabot configuration files", () => {
        expect(isDependabotFile(".github/dependabot.yml")).toBeTruthy();
        expect(
            isDependabotFile(String.raw`C:\Repo\.github\dependabot.yaml`)
        ).toBeTruthy();
        expect(isDependabotFile("dependabot.yml")).toBeFalsy();
        expect(
            isDependabotFile(".github/workflows/dependabot.yml")
        ).toBeFalsy();
    });

    it("detects workflow template properties files", () => {
        expect(
            isWorkflowTemplatePropertiesFile(
                ".github/workflow-templates/ci.properties.json"
            )
        ).toBeTruthy();
        expect(
            isWorkflowTemplatePropertiesFile(
                String.raw`C:\Repo\.github\workflow-templates\release.PROPERTIES.JSON`
            )
        ).toBeTruthy();
        expect(
            isWorkflowTemplatePropertiesFile("ci.properties.json")
        ).toBeFalsy();
        expect(
            isWorkflowTemplatePropertiesFile(
                ".github/workflow-templates/ci.yaml"
            )
        ).toBeFalsy();
    });

    it("detects workflow template YAML files", () => {
        expect(
            isWorkflowTemplateYamlFile(".github/workflow-templates/ci.yml")
        ).toBeTruthy();
        expect(
            isWorkflowTemplateYamlFile(
                String.raw`C:\Repo\.github\workflow-templates\release.YAML`
            )
        ).toBeTruthy();
        expect(
            isWorkflowTemplateYamlFile(
                ".github/workflow-templates/ci.properties.json"
            )
        ).toBeFalsy();
        expect(
            isWorkflowTemplateYamlFile(".github/workflows/ci.yml")
        ).toBeFalsy();
    });

    it("detects any workflow template surface via the combined helper", () => {
        expect(
            isWorkflowTemplateFile(".github/workflow-templates/ci.yml")
        ).toBeTruthy();
        expect(
            isWorkflowTemplateFile(
                ".github/workflow-templates/ci.properties.json"
            )
        ).toBeTruthy();
        expect(isWorkflowTemplateFile(".github/workflows/ci.yml")).toBeFalsy();
    });

    it("detects .yaml extensions", () => {
        expect(usesYamlExtension("action.yaml")).toBeTruthy();
        expect(usesYamlExtension("ACTION.YAML")).toBeTruthy();
        expect(usesYamlExtension("action.yml")).toBeFalsy();
        expect(usesYamlExtension("action.yaml.backup")).toBeFalsy();
    });

    it("derives template stems from known template suffixes", () => {
        expect(getTemplateStem("ci.properties.json")).toBe("ci");
        expect(getTemplateStem("release.yaml")).toBe("release");
        expect(getTemplateStem("release.yml")).toBe("release");
        expect(getTemplateStem("custom.template.txt")).toBe(
            "custom.template.txt"
        );
    });
});
