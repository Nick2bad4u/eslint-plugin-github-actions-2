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
        ).toBe(true);
        expect(
            isActionMetadataFile(
                String.raw`C:\Repo\.GITHUB\ACTIONS\CACHE\ACTION.YAML`
            )
        ).toBe(true);
        expect(isActionMetadataFile(".github/workflows/ci.yml")).toBe(false);
        expect(isActionMetadataFile("action.yaml.backup")).toBe(false);
    });

    it("detects repository Dependabot configuration files", () => {
        expect.hasAssertions();
        expect(isDependabotFile(".github/dependabot.yml")).toBe(true);
        expect(
            isDependabotFile(String.raw`C:\Repo\.github\dependabot.yaml`)
        ).toBe(true);
        expect(isDependabotFile("dependabot.yml")).toBe(false);
        expect(isDependabotFile(".github/workflows/dependabot.yml")).toBe(
            false
        );
    });

    it("detects dependency review workflow files", () => {
        expect.hasAssertions();
        expect(
            isDependencyReviewWorkflowFile(
                ".github/workflows/dependency-review.yml"
            )
        ).toBe(true);
        expect(
            isDependencyReviewWorkflowFile(
                ".github/workflows/dependency-review-security.yaml"
            )
        ).toBe(true);
        expect(isDependencyReviewWorkflowFile(".github/workflows/ci.yml")).toBe(
            false
        );
    });

    it("detects standard workflow files while excluding dependabot and template paths", () => {
        expect.hasAssertions();
        expect(isWorkflowFile(".github/workflows/ci.yml")).toBe(true);
        expect(
            isWorkflowFile(String.raw`C:\Repo\.github\workflows\release.YAML`)
        ).toBe(true);
        expect(isWorkflowFile(".github/dependabot.yml")).toBe(false);
        expect(isWorkflowFile(".github/workflow-templates/deploy.yml")).toBe(
            false
        );
    });

    it("detects workflow template properties files", () => {
        expect.hasAssertions();
        expect(
            isWorkflowTemplatePropertiesFile(
                ".github/workflow-templates/ci.properties.json"
            )
        ).toBe(true);
        expect(
            isWorkflowTemplatePropertiesFile(
                String.raw`C:\Repo\.github\workflow-templates\release.PROPERTIES.JSON`
            )
        ).toBe(true);
        expect(isWorkflowTemplatePropertiesFile("ci.properties.json")).toBe(
            false
        );
        expect(
            isWorkflowTemplatePropertiesFile(
                ".github/workflow-templates/ci.yaml"
            )
        ).toBe(false);
        expect(
            isWorkflowTemplatePropertiesFile(
                String.raw`C:\Repos\workflow-templates\.github\workflows\ci.properties.json`
            )
        ).toBe(false);
    });

    it("detects workflow template YAML files", () => {
        expect.hasAssertions();
        expect(
            isWorkflowTemplateYamlFile(".github/workflow-templates/ci.yml")
        ).toBe(true);
        expect(
            isWorkflowTemplateYamlFile(
                String.raw`C:\Repo\.github\workflow-templates\release.YAML`
            )
        ).toBe(true);
        expect(
            isWorkflowTemplateYamlFile(
                ".github/workflow-templates/ci.properties.json"
            )
        ).toBe(false);
        expect(isWorkflowTemplateYamlFile(".github/workflows/ci.yml")).toBe(
            false
        );
        expect(
            isWorkflowTemplateYamlFile(
                String.raw`C:\Repos\workflow-templates\.github\workflows\dependency-review.yml`
            )
        ).toBe(false);
        expect(
            isWorkflowTemplateYamlFile(
                ".github/workflow-templates/nested/ci.yml"
            )
        ).toBe(false);
    });

    it("detects any workflow template surface via the combined helper", () => {
        expect.hasAssertions();
        expect(
            isWorkflowTemplateFile(".github/workflow-templates/ci.yml")
        ).toBe(true);
        expect(
            isWorkflowTemplateFile(
                ".github/workflow-templates/ci.properties.json"
            )
        ).toBe(true);
        expect(isWorkflowTemplateFile(".github/workflows/ci.yml")).toBe(false);
    });

    it("detects .yaml extensions", () => {
        expect.hasAssertions();
        expect(usesYamlExtension("action.yaml")).toBe(true);
        expect(usesYamlExtension("ACTION.YAML")).toBe(true);
        expect(usesYamlExtension("action.yml")).toBe(false);
        expect(usesYamlExtension("action.yaml.backup")).toBe(false);
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
