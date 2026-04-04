/**
 * @packageDocumentation
 * Shared filename target helpers for action metadata and workflow templates.
 */
import { basename, extname } from "node:path";

/** Action metadata file globs. */
export const ACTION_METADATA_FILE_GLOBS: readonly string[] = [
    "**/action.{yml,yaml}",
];

/** Dependabot configuration file globs. */
export const DEPENDABOT_FILE_GLOBS: readonly string[] = [
    ".github/dependabot.{yml,yaml}",
];

/** Dependency review workflow file globs. */
export const DEPENDENCY_REVIEW_WORKFLOW_FILE_GLOBS: readonly string[] = [
    ".github/workflows/dependency-review*.{yml,yaml}",
];

/** Standard GitHub Actions workflow file globs. */
export const WORKFLOW_FILE_GLOBS: readonly string[] = [
    ".github/workflows/*.{yml,yaml}",
];

/** Workflow template metadata (`.properties.json`) file globs. */
export const WORKFLOW_TEMPLATE_PROPERTIES_FILE_GLOBS: readonly string[] = [
    "**/workflow-templates/*.properties.json",
];

/** Workflow template YAML file globs. */
export const WORKFLOW_TEMPLATE_YAML_FILE_GLOBS: readonly string[] = [
    "**/workflow-templates/*.{yml,yaml}",
];

/** Combined workflow template globs used by dedicated template presets. */
export const WORKFLOW_TEMPLATE_FILE_GLOBS: readonly string[] = [
    ...WORKFLOW_TEMPLATE_YAML_FILE_GLOBS,
    ...WORKFLOW_TEMPLATE_PROPERTIES_FILE_GLOBS,
];

/** Normalize file paths for stable cross-platform path checks. */
const normalizePathForMatching = (filePath: string): string =>
    filePath.replaceAll("\\", "/").toLowerCase();

/** Determine whether a filename is an action metadata file. */
export const isActionMetadataFile = (filePath: string): boolean => {
    const normalizedFilePath = normalizePathForMatching(filePath);

    return (
        normalizedFilePath.endsWith("/action.yml") ||
        normalizedFilePath.endsWith("/action.yaml")
    );
};

/** Determine whether a filename is the repository Dependabot config file. */
export const isDependabotFile = (filePath: string): boolean => {
    const normalizedFilePath = normalizePathForMatching(filePath);

    return (
        normalizedFilePath.endsWith("/.github/dependabot.yml") ||
        normalizedFilePath.endsWith("/.github/dependabot.yaml") ||
        normalizedFilePath === ".github/dependabot.yml" ||
        normalizedFilePath === ".github/dependabot.yaml"
    );
};

/** Determine whether a filename is a dependency review workflow file. */
export const isDependencyReviewWorkflowFile = (filePath: string): boolean => {
    const normalizedFilePath = normalizePathForMatching(filePath);

    return (
        (normalizedFilePath.includes("/.github/workflows/") ||
            normalizedFilePath.startsWith(".github/workflows/")) &&
        (normalizedFilePath.endsWith("dependency-review.yml") ||
            normalizedFilePath.endsWith("dependency-review.yaml") ||
            normalizedFilePath.includes("/dependency-review-") ||
            normalizedFilePath.includes("/dependency-review."))
    );
};

/**
 * Determine whether a filename is a standard workflow file under
 * `.github/workflows/`.
 */
export const isWorkflowFile = (filePath: string): boolean => {
    const normalizedFilePath = normalizePathForMatching(filePath);

    return (
        (normalizedFilePath.includes("/.github/workflows/") ||
            normalizedFilePath.startsWith(".github/workflows/")) &&
        (normalizedFilePath.endsWith(".yml") ||
            normalizedFilePath.endsWith(".yaml"))
    );
};

/** Determine whether a filename is a workflow template metadata file. */
export const isWorkflowTemplatePropertiesFile = (filePath: string): boolean =>
    normalizePathForMatching(filePath).includes("/workflow-templates/") &&
    normalizePathForMatching(filePath).endsWith(".properties.json");

/** Determine whether a filename is a workflow template YAML file. */
export const isWorkflowTemplateYamlFile = (filePath: string): boolean => {
    const normalizedFilePath = normalizePathForMatching(filePath);

    return (
        normalizedFilePath.includes("/workflow-templates/") &&
        (normalizedFilePath.endsWith(".yml") ||
            normalizedFilePath.endsWith(".yaml"))
    );
};

/** Determine whether a filename belongs to any workflow template surface. */
export const isWorkflowTemplateFile = (filePath: string): boolean =>
    isWorkflowTemplatePropertiesFile(filePath) ||
    isWorkflowTemplateYamlFile(filePath);

/** Determine whether the path uses `.yaml` (rather than `.yml`). */
export const usesYamlExtension = (filePath: string): boolean =>
    extname(filePath).toLowerCase() === ".yaml";

/** Return the template basename without extension suffixes. */
export const getTemplateStem = (filePath: string): string => {
    const fileName = basename(filePath);

    if (fileName.endsWith(".properties.json")) {
        return fileName.slice(0, -".properties.json".length);
    }

    if (fileName.endsWith(".yaml")) {
        return fileName.slice(0, -".yaml".length);
    }

    if (fileName.endsWith(".yml")) {
        return fileName.slice(0, -".yml".length);
    }

    return fileName;
};
