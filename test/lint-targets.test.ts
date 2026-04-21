import { describe, expect, it } from "vitest";

import {
    ACTION_METADATA_FILE_GLOBS,
    DEPENDABOT_FILE_GLOBS,
    DEPENDENCY_REVIEW_WORKFLOW_FILE_GLOBS,
    getTemplateStem,
    isActionMetadataFile,
    isDependabotFile,
    isDependencyReviewWorkflowFile,
    isWorkflowFile,
    isWorkflowTemplateFile,
    isWorkflowTemplatePropertiesFile,
    isWorkflowTemplateYamlFile,
    usesYamlExtension,
    WORKFLOW_FILE_GLOBS,
    WORKFLOW_TEMPLATE_FILE_GLOBS,
    WORKFLOW_TEMPLATE_PROPERTIES_FILE_GLOBS,
    WORKFLOW_TEMPLATE_YAML_FILE_GLOBS,
} from "../src/_internal/lint-targets.js";

describe("lint target helpers", () => {
    it("exports stable file-glob contracts", () => {
        expect.hasAssertions();
        expect(ACTION_METADATA_FILE_GLOBS).toStrictEqual([
            "**/action.{yml,yaml}",
        ]);
        expect(DEPENDABOT_FILE_GLOBS).toStrictEqual([
            ".github/dependabot.{yml,yaml}",
        ]);
        expect(DEPENDENCY_REVIEW_WORKFLOW_FILE_GLOBS).toStrictEqual([
            ".github/workflows/dependency-review*.{yml,yaml}",
        ]);
        expect(WORKFLOW_FILE_GLOBS).toStrictEqual([
            ".github/workflows/*.{yml,yaml}",
        ]);
        expect(WORKFLOW_TEMPLATE_PROPERTIES_FILE_GLOBS).toStrictEqual([
            "**/workflow-templates/*.properties.json",
        ]);
        expect(WORKFLOW_TEMPLATE_YAML_FILE_GLOBS).toStrictEqual([
            "**/workflow-templates/*.{yml,yaml}",
        ]);
        expect(WORKFLOW_TEMPLATE_FILE_GLOBS).toStrictEqual([
            "**/workflow-templates/*.{yml,yaml}",
            "**/workflow-templates/*.properties.json",
        ]);
    });

    it("detects action metadata files case-insensitively across path separators", () => {
        expect.hasAssertions();
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
        expect.hasAssertions();
        expect(isDependabotFile(".github/dependabot.yml")).toBeTruthy();
        expect(
            isDependabotFile(String.raw`C:\Repo\.github\dependabot.yaml`)
        ).toBeTruthy();
        expect(isDependabotFile("dependabot.yml")).toBeFalsy();
        expect(
            isDependabotFile(".github/workflows/dependabot.yml")
        ).toBeFalsy();
    });

    it("detects dependency review workflow files", () => {
        expect.hasAssertions();
        expect(
            isDependencyReviewWorkflowFile(
                ".github/workflows/dependency-review.yml"
            )
        ).toBeTruthy();
        expect(
            isDependencyReviewWorkflowFile(
                ".github/workflows/dependency-review-security.yaml"
            )
        ).toBeTruthy();
        expect(
            isDependencyReviewWorkflowFile(".github/workflows/ci.yml")
        ).toBeFalsy();
    });

    it("detects standard workflow files while excluding dependabot and template paths", () => {
        expect.hasAssertions();
        expect(isWorkflowFile(".github/workflows/ci.yml")).toBeTruthy();
        expect(
            isWorkflowFile(String.raw`C:\Repo\.github\workflows\release.YAML`)
        ).toBeTruthy();
        expect(isWorkflowFile(".github/dependabot.yml")).toBeFalsy();
        expect(
            isWorkflowFile(".github/workflow-templates/deploy.yml")
        ).toBeFalsy();
    });

    it("detects workflow template properties files", () => {
        expect.hasAssertions();
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
        expect.hasAssertions();
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
        expect.hasAssertions();
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
        expect.hasAssertions();
        expect(usesYamlExtension("action.yaml")).toBeTruthy();
        expect(usesYamlExtension("ACTION.YAML")).toBeTruthy();
        expect(usesYamlExtension("action.yml")).toBeFalsy();
        expect(usesYamlExtension("action.yaml.backup")).toBeFalsy();
    });

    it("derives template stems from known template suffixes", () => {
        expect.hasAssertions();
        expect(getTemplateStem("ci.properties.json")).toBe("ci");
        expect(getTemplateStem("release.yaml")).toBe("release");
        expect(getTemplateStem("release.yml")).toBe("release");
        expect(getTemplateStem("custom.template.txt")).toBe(
            "custom.template.txt"
        );
    });
});
