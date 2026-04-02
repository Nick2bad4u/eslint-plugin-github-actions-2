import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

const validDependabotConfig = [
    "version: 2",
    "multi-ecosystem-groups:",
    "  app:",
    "    schedule:",
    '      interval: "weekly"',
    '      time: "05:30"',
    '      timezone: "America/Detroit"',
    "    assignees:",
    '      - "Nick2bad4u"',
    '    target-branch: "main"',
    "    commit-message:",
    '      prefix: "[dependabot][all]"',
    "    labels:",
    '      - "dependabot"',
    '      - "dependencies"',
    "updates:",
    '  - package-ecosystem: "github-actions"',
    '    directory: "/"',
    '    multi-ecosystem-group: "app"',
    '    patterns: ["*"]',
    '  - package-ecosystem: "npm"',
    "    directories:",
    '      - "/"',
    '      - "/docs/docusaurus"',
    '    multi-ecosystem-group: "app"',
    '    patterns: ["*"]',
].join("\n");

describe("dependabot rules", () => {
    it("accepts a grouped Dependabot config that satisfies the dedicated preset", async () => {
        const result = await lintWorkflow(validDependabotConfig, {
            configName: "dependabot",
            filePath: ".github/dependabot.yml",
        });

        expect(result.messages).toHaveLength(0);
    });

    it("reports unused top-level enable-beta-ecosystems settings", async () => {
        const result = await lintWorkflow(
            [
                "version: 2",
                "enable-beta-ecosystems: true",
                "updates: []",
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/no-unused-dependabot-enable-beta-ecosystems":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("requires `version: 2` and a non-empty `updates` sequence", async () => {
        const missingVersionResult = await lintWorkflow("updates: []", {
            configName: "dependabot",
            filePath: ".github/dependabot.yml",
            rules: {
                "github-actions/require-dependabot-version": "error",
            },
        });
        const emptyUpdatesResult = await lintWorkflow(
            "version: 2\nupdates: []",
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-updates": "error",
                },
            }
        );

        expect(missingVersionResult.messages).toHaveLength(1);
        expect(emptyUpdatesResult.messages).toHaveLength(1);
    });

    it("requires `package-ecosystem` and `directory`/`directories` on every update entry", async () => {
        const missingEcosystemResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - directory: "/"',
                "    schedule:",
                '      interval: "weekly"',
                '      time: "05:30"',
                '      timezone: "UTC"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-package-ecosystem":
                        "error",
                },
            }
        );
        const missingDirectoryResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                "    schedule:",
                '      interval: "weekly"',
                '      time: "05:30"',
                '      timezone: "UTC"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-directory": "error",
                },
            }
        );

        expect(missingEcosystemResult.messages).toHaveLength(1);
        expect(missingDirectoryResult.messages).toHaveLength(1);
    });

    it("requires effective schedule interval, time, and timezone", async () => {
        const missingIntervalResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                "    schedule: {}",
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-schedule-interval":
                        "error",
                },
            }
        );
        const missingTimeResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                "    schedule:",
                '      interval: "weekly"',
                '      timezone: "UTC"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-schedule-time": "error",
                },
            }
        );
        const missingTimezoneResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                "    schedule:",
                '      interval: "weekly"',
                '      time: "05:30"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-schedule-timezone":
                        "error",
                },
            }
        );

        expect(missingIntervalResult.messages).toHaveLength(1);
        expect(missingTimeResult.messages).toHaveLength(1);
        expect(missingTimezoneResult.messages).toHaveLength(1);
    });

    it("requires valid grouped-update references and patterns", async () => {
        const unknownGroupResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                '    multi-ecosystem-group: "missing-group"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/no-unknown-dependabot-multi-ecosystem-group":
                        "error",
                },
            }
        );
        const missingPatternsResult = await lintWorkflow(
            [
                "version: 2",
                "multi-ecosystem-groups:",
                "  app:",
                "    schedule:",
                '      interval: "weekly"',
                "updates:",
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                '    multi-ecosystem-group: "app"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-patterns-for-multi-ecosystem-group":
                        "error",
                },
            }
        );

        expect(unknownGroupResult.messages).toHaveLength(1);
        expect(missingPatternsResult.messages).toHaveLength(1);
    });

    it("requires cron schedules to declare cronjob and non-cron schedules to omit it", async () => {
        const missingCronjobResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                "    schedule:",
                '      interval: "cron"',
                '      timezone: "UTC"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-schedule-cronjob":
                        "error",
                },
            }
        );
        const unexpectedCronjobResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                "    schedule:",
                '      interval: "weekly"',
                '      cronjob: "0 9 * * *"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-schedule-cronjob":
                        "error",
                },
            }
        );

        expect(missingCronjobResult.messages).toHaveLength(1);
        expect(unexpectedCronjobResult.messages).toHaveLength(1);
    });

    it("requires effective assignees, target-branch, commit-message prefix, and labels", async () => {
        const missingAssigneesResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                "    schedule:",
                '      interval: "weekly"',
                '      time: "05:30"',
                '      timezone: "UTC"',
                '    target-branch: "main"',
                "    commit-message:",
                '      prefix: "deps"',
                "    labels:",
                '      - "dependencies"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-assignees": "error",
                },
            }
        );
        const missingTargetBranchResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                "    schedule:",
                '      interval: "weekly"',
                '      time: "05:30"',
                '      timezone: "UTC"',
                "    assignees:",
                '      - "octocat"',
                "    commit-message:",
                '      prefix: "deps"',
                "    labels:",
                '      - "dependencies"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-target-branch": "error",
                },
            }
        );
        const missingCommitMessagePrefixResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                "    schedule:",
                '      interval: "weekly"',
                '      time: "05:30"',
                '      timezone: "UTC"',
                "    assignees:",
                '      - "octocat"',
                '    target-branch: "main"',
                "    labels:",
                '      - "dependencies"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-commit-message-prefix":
                        "error",
                },
            }
        );
        const missingLabelsResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                "    schedule:",
                '      interval: "weekly"',
                '      time: "05:30"',
                '      timezone: "UTC"',
                "    assignees:",
                '      - "octocat"',
                '    target-branch: "main"',
                "    commit-message:",
                '      prefix: "deps"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-labels": "error",
                },
            }
        );

        expect(missingAssigneesResult.messages).toHaveLength(1);
        expect(missingTargetBranchResult.messages).toHaveLength(1);
        expect(missingCommitMessagePrefixResult.messages).toHaveLength(1);
        expect(missingLabelsResult.messages).toHaveLength(1);
    });

    it("requires `github-actions` ecosystems to use `directory: /`", async () => {
        const result = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "github-actions"',
                '    directory: "/.github/workflows"',
                "    schedule:",
                '      interval: "weekly"',
                '      time: "05:30"',
                '      timezone: "UTC"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-github-actions-directory-root":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
    });

    it("ignores workflow files even when Dependabot rules are enabled explicitly", async () => {
        const result = await lintWorkflow(
            [
                "name: CI",
                "on:",
                "  push:",
                "jobs:",
                "  test:",
                "    runs-on: ubuntu-latest",
            ].join("\n"),
            {
                configName: "all",
                filePath: ".github/workflows/ci.yml",
                rules: {
                    "github-actions/require-dependabot-version": "error",
                },
            }
        );

        expect(result.messages).toHaveLength(0);
    });
});
