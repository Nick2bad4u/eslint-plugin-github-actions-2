/**
 * @packageDocumentation
 * Canonical preset names and docs references used by eslint-plugin-github-actions-2.
 */
import {
    ACTION_METADATA_FILE_GLOBS,
    DEPENDABOT_FILE_GLOBS,
    WORKFLOW_TEMPLATE_FILE_GLOBS,
    WORKFLOW_TEMPLATE_PROPERTIES_FILE_GLOBS,
} from "./lint-targets.js";
import { WORKFLOW_FILE_GLOBS } from "./workflow-yaml.js";

/** Ordered preset names exposed through `plugin.configs`. */
export const githubActionsConfigNames = [
    "actionMetadata",
    "codeScanning",
    "dependabot",
    "workflowTemplateProperties",
    "workflowTemplates",
    "recommended",
    "security",
    "strict",
    "all",
] as const;

/** Supported flat-config preset names exported by the plugin. */
export type GithubActionsConfigName = (typeof githubActionsConfigNames)[number];

/** String references used in rule docs metadata and generated docs tables. */
export const githubActionsConfigReferenceToName: Readonly<
    Record<string, GithubActionsConfigName>
> = {
    "github-actions.configs.actionMetadata": "actionMetadata",
    "github-actions.configs.all": "all",
    "github-actions.configs.codeScanning": "codeScanning",
    "github-actions.configs.dependabot": "dependabot",
    "github-actions.configs.recommended": "recommended",
    "github-actions.configs.security": "security",
    "github-actions.configs.strict": "strict",
    "github-actions.configs.workflowTemplateProperties":
        "workflowTemplateProperties",
    "github-actions.configs.workflowTemplates": "workflowTemplates",
} as const satisfies Record<string, GithubActionsConfigName>;

/** Valid config reference strings accepted in rule metadata. */
export type GithubActionsConfigReference =
    keyof typeof githubActionsConfigReferenceToName;

/** Display metadata for each preset used in README and docs surfaces. */
export const githubActionsConfigMetadataByName: Readonly<
    Record<
        GithubActionsConfigName,
        {
            description: string;
            files: readonly string[];
            icon: string;
            presetName: string;
        }
    >
> = {
    actionMetadata: {
        description:
            "Linting defaults for GitHub Action metadata files (`action.yml` / `action.yaml`).",
        files: ACTION_METADATA_FILE_GLOBS,
        icon: "🧩",
        presetName: "github-actions:action-metadata",
    },
    all: {
        description:
            "Enables the complete bundled rule set across workflows, action metadata, workflow templates, and Dependabot configuration, while leaving explicitly opt-in policy rules manual.",
        files: [
            ...WORKFLOW_FILE_GLOBS,
            ...ACTION_METADATA_FILE_GLOBS,
            ...DEPENDABOT_FILE_GLOBS,
            ...WORKFLOW_TEMPLATE_FILE_GLOBS,
        ],
        icon: "🟣",
        presetName: "github-actions:all",
    },
    codeScanning: {
        description:
            "Workflow security defaults for CodeQL, SARIF uploads, dependency review, and related code-scanning integrations.",
        files: WORKFLOW_FILE_GLOBS,
        icon: "🔎",
        presetName: "github-actions:code-scanning",
    },
    dependabot: {
        description:
            "Linting defaults for repository Dependabot configuration files (`.github/dependabot.yml`).",
        files: DEPENDABOT_FILE_GLOBS,
        icon: "🤖",
        presetName: "github-actions:dependabot",
    },
    recommended: {
        description:
            "Balanced defaults for most repositories authoring GitHub Actions workflows.",
        files: WORKFLOW_FILE_GLOBS,
        icon: "🟡",
        presetName: "github-actions:recommended",
    },
    security: {
        description:
            "Security-focused workflow hardening checks for action usage and token scope.",
        files: WORKFLOW_FILE_GLOBS,
        icon: "🛡️",
        presetName: "github-actions:security",
    },
    strict: {
        description:
            "Opinionated operational guardrails for mature workflow estates.",
        files: WORKFLOW_FILE_GLOBS,
        icon: "🔴",
        presetName: "github-actions:strict",
    },
    workflowTemplateProperties: {
        description:
            "Linting defaults for workflow-template metadata files (`*.properties.json`).",
        files: WORKFLOW_TEMPLATE_PROPERTIES_FILE_GLOBS,
        icon: "🗂️",
        presetName: "github-actions:workflow-template-properties",
    },
    workflowTemplates: {
        description:
            "Workflow template package linting for both template YAML and metadata files.",
        files: WORKFLOW_TEMPLATE_FILE_GLOBS,
        icon: "🧱",
        presetName: "github-actions:workflow-templates",
    },
} as const;
