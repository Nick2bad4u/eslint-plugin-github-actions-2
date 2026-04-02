import { describe, expect, it } from "vitest";

import githubActionsPlugin from "../src/plugin.js";

describe("exported presets", () => {
    it("exports the expected preset names", () => {
        expect(
            Object.keys(githubActionsPlugin.configs).toSorted((left, right) =>
                left.localeCompare(right)
            )
        ).toEqual([
            "actionMetadata",
            "all",
            "dependabot",
            "recommended",
            "security",
            "strict",
            "workflowTemplateProperties",
            "workflowTemplates",
        ]);
    });

    it("scopes core workflow presets to workflow YAML files", () => {
        expect(githubActionsPlugin.configs.recommended.files).toEqual([
            ".github/workflows/*.{yml,yaml}",
        ]);
    });

    it("exports dedicated action metadata and workflow template scopes", () => {
        expect(githubActionsPlugin.configs.actionMetadata.files).toEqual([
            "**/action.{yml,yaml}",
        ]);
        expect(githubActionsPlugin.configs.dependabot.files).toEqual([
            ".github/dependabot.{yml,yaml}",
        ]);
        expect(
            githubActionsPlugin.configs.workflowTemplateProperties.files
        ).toEqual(["**/workflow-templates/*.properties.json"]);
        expect(githubActionsPlugin.configs.workflowTemplates.files).toEqual([
            "**/workflow-templates/*.{yml,yaml}",
            "**/workflow-templates/*.properties.json",
        ]);
    });

    it("wires rule membership by preset", () => {
        expect(
            Object.keys(githubActionsPlugin.configs.recommended.rules).toSorted(
                (left, right) => left.localeCompare(right)
            )
        ).toEqual([
            "github-actions/no-invalid-concurrency-context",
            "github-actions/no-invalid-key",
            "github-actions/no-invalid-reusable-workflow-job-key",
            "github-actions/no-invalid-workflow-call-output-value",
            "github-actions/no-secrets-in-if",
            "github-actions/no-template-placeholder-in-non-template-workflow",
            "github-actions/no-unknown-job-output-reference",
            "github-actions/no-write-all-permissions",
            "github-actions/prefer-file-extension",
            "github-actions/prefer-inputs-context",
            "github-actions/require-action-name",
            "github-actions/require-checkout-before-local-action",
            "github-actions/require-job-timeout-minutes",
            "github-actions/require-workflow-call-input-type",
            "github-actions/require-workflow-call-output-value",
            "github-actions/require-workflow-dispatch-input-type",
            "github-actions/require-workflow-permissions",
            "github-actions/valid-timeout-minutes",
            "github-actions/valid-trigger-events",
        ]);
        expect(
            Object.keys(githubActionsPlugin.configs.security.rules).toSorted(
                (left, right) => left.localeCompare(right)
            )
        ).toEqual([
            "github-actions/no-inherit-secrets",
            "github-actions/no-pr-head-checkout-in-pull-request-target",
            "github-actions/no-secrets-in-if",
            "github-actions/no-self-hosted-runner-on-fork-pr-events",
            "github-actions/no-untrusted-input-in-run",
            "github-actions/no-write-all-permissions",
            "github-actions/pin-action-shas",
            "github-actions/require-pull-request-target-branches",
            "github-actions/require-workflow-permissions",
            "github-actions/require-workflow-run-branches",
        ]);
        expect(
            Object.keys(githubActionsPlugin.configs.strict.rules).toSorted(
                (left, right) => left.localeCompare(right)
            )
        ).toEqual([
            "github-actions/action-name-casing",
            "github-actions/job-id-casing",
            "github-actions/max-jobs-per-action",
            "github-actions/no-external-job",
            "github-actions/no-inherit-secrets",
            "github-actions/no-invalid-concurrency-context",
            "github-actions/no-invalid-key",
            "github-actions/no-invalid-reusable-workflow-job-key",
            "github-actions/no-invalid-workflow-call-output-value",
            "github-actions/no-pr-head-checkout-in-pull-request-target",
            "github-actions/no-secrets-in-if",
            "github-actions/no-self-hosted-runner-on-fork-pr-events",
            "github-actions/no-template-placeholder-in-non-template-workflow",
            "github-actions/no-top-level-env",
            "github-actions/no-unknown-job-output-reference",
            "github-actions/no-unknown-step-reference",
            "github-actions/no-untrusted-input-in-run",
            "github-actions/no-write-all-permissions",
            "github-actions/pin-action-shas",
            "github-actions/prefer-fail-fast",
            "github-actions/prefer-file-extension",
            "github-actions/prefer-inputs-context",
            "github-actions/require-action-name",
            "github-actions/require-action-run-name",
            "github-actions/require-checkout-before-local-action",
            "github-actions/require-job-name",
            "github-actions/require-job-step-name",
            "github-actions/require-job-timeout-minutes",
            "github-actions/require-merge-group-trigger",
            "github-actions/require-pull-request-target-branches",
            "github-actions/require-run-step-shell",
            "github-actions/require-trigger-types",
            "github-actions/require-workflow-call-input-type",
            "github-actions/require-workflow-call-output-value",
            "github-actions/require-workflow-concurrency",
            "github-actions/require-workflow-dispatch-input-type",
            "github-actions/require-workflow-interface-description",
            "github-actions/require-workflow-permissions",
            "github-actions/require-workflow-run-branches",
            "github-actions/valid-timeout-minutes",
            "github-actions/valid-trigger-events",
        ]);

        expect(
            Object.keys(
                githubActionsPlugin.configs.actionMetadata.rules
            ).toSorted((left, right) => left.localeCompare(right))
        ).toEqual([
            "github-actions/no-case-insensitive-input-id-collision",
            "github-actions/no-composite-input-env-access",
            "github-actions/no-deprecated-node-runtime",
            "github-actions/no-duplicate-composite-step-id",
            "github-actions/no-post-if-without-post",
            "github-actions/no-pre-if-without-pre",
            "github-actions/no-required-input-with-default",
            "github-actions/no-unknown-input-reference-in-composite",
            "github-actions/no-unused-input-in-composite",
            "github-actions/prefer-action-yml",
            "github-actions/require-composite-step-name",
        ]);

        expect(
            Object.keys(githubActionsPlugin.configs.dependabot.rules).toSorted(
                (left, right) => left.localeCompare(right)
            )
        ).toEqual([
            "github-actions/no-unknown-dependabot-multi-ecosystem-group",
            "github-actions/no-unused-dependabot-enable-beta-ecosystems",
            "github-actions/require-dependabot-assignees",
            "github-actions/require-dependabot-commit-message-prefix",
            "github-actions/require-dependabot-directory",
            "github-actions/require-dependabot-github-actions-directory-root",
            "github-actions/require-dependabot-labels",
            "github-actions/require-dependabot-package-ecosystem",
            "github-actions/require-dependabot-patterns-for-multi-ecosystem-group",
            "github-actions/require-dependabot-schedule-cronjob",
            "github-actions/require-dependabot-schedule-interval",
            "github-actions/require-dependabot-schedule-time",
            "github-actions/require-dependabot-schedule-timezone",
            "github-actions/require-dependabot-target-branch",
            "github-actions/require-dependabot-updates",
            "github-actions/require-dependabot-version",
        ]);

        expect(
            Object.keys(
                githubActionsPlugin.configs.workflowTemplateProperties.rules
            ).toSorted((left, right) => left.localeCompare(right))
        ).toEqual([
            "github-actions/no-empty-template-file-pattern",
            "github-actions/no-icon-file-extension-in-template-icon-name",
            "github-actions/no-invalid-template-file-pattern-regex",
            "github-actions/no-path-separators-in-template-icon-name",
            "github-actions/no-subdirectory-template-file-pattern",
            "github-actions/no-universal-template-file-pattern",
            "github-actions/require-template-categories",
            "github-actions/require-template-file-patterns",
            "github-actions/require-template-icon-file-exists",
            "github-actions/require-template-icon-name",
            "github-actions/require-workflow-template-properties-pair",
        ]);

        expect(
            Object.keys(
                githubActionsPlugin.configs.workflowTemplates.rules
            ).toSorted((left, right) => left.localeCompare(right))
        ).toEqual([
            "github-actions/no-empty-template-file-pattern",
            "github-actions/no-hardcoded-default-branch-in-template",
            "github-actions/no-icon-file-extension-in-template-icon-name",
            "github-actions/no-invalid-template-file-pattern-regex",
            "github-actions/no-path-separators-in-template-icon-name",
            "github-actions/no-subdirectory-template-file-pattern",
            "github-actions/no-universal-template-file-pattern",
            "github-actions/prefer-template-yml-extension",
            "github-actions/require-template-categories",
            "github-actions/require-template-file-patterns",
            "github-actions/require-template-icon-file-exists",
            "github-actions/require-template-icon-name",
            "github-actions/require-template-workflow-name",
            "github-actions/require-workflow-template-pair",
            "github-actions/require-workflow-template-properties-pair",
        ]);
    });
});
