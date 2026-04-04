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
    '      prefix-development: "[dependabot][dev][all]"',
    '      include: "scope"',
    "    labels:",
    '      - "dependabot"',
    '      - "dependencies"',
    "updates:",
    '  - package-ecosystem: "github-actions"',
    "    cooldown:",
    "      default-days: 3",
    '    directory: "/"',
    "    open-pull-requests-limit: 5",
    '    multi-ecosystem-group: "app"',
    '    patterns: ["*"]',
    '  - package-ecosystem: "npm"',
    "    cooldown:",
    "      default-days: 3",
    "    directories:",
    '      - "/"',
    '      - "/docs/docusaurus"',
    "    open-pull-requests-limit: 5",
    '    multi-ecosystem-group: "app"',
    '    patterns: ["*"]',
    '    versioning-strategy: "increase"',
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

    it("autofixes unused enable-beta-ecosystems settings by removing the key", async () => {
        const result = await lintWorkflow(
            [
                "version: 2",
                "enable-beta-ecosystems: true",
                "updates: []",
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                fix: true,
                rules: {
                    "github-actions/no-unused-dependabot-enable-beta-ecosystems":
                        "error",
                },
            }
        );

        expect(result.output).toBe(["version: 2", "updates: []"].join("\n"));
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

    it("autofixes missing or invalid Dependabot versions to version 2", async () => {
        const missingVersionResult = await lintWorkflow("updates: []", {
            configName: "dependabot",
            filePath: ".github/dependabot.yml",
            fix: true,
            rules: {
                "github-actions/require-dependabot-version": "error",
            },
        });
        const invalidVersionResult = await lintWorkflow(
            ["version: 1", "updates: []"].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                fix: true,
                rules: {
                    "github-actions/require-dependabot-version": "error",
                },
            }
        );

        expect(missingVersionResult.output).toBe(
            ["version: 2", "updates: []"].join("\n")
        );
        expect(invalidVersionResult.output).toBe(
            ["version: 2", "updates: []"].join("\n")
        );
    });

    it("requires cooldown and open-pull-requests-limit", async () => {
        const missingCooldownResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                "    open-pull-requests-limit: 5",
                "    schedule:",
                '      interval: "weekly"',
                '      time: "05:30"',
                '      timezone: "UTC"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-cooldown": "error",
                },
            }
        );
        const missingLimitResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                "    cooldown:",
                "      default-days: 3",
                '    directory: "/"',
                "    schedule:",
                '      interval: "weekly"',
                '      time: "05:30"',
                '      timezone: "UTC"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-open-pull-requests-limit":
                        "error",
                },
            }
        );

        expect(missingCooldownResult.messages).toHaveLength(1);
        expect(missingLimitResult.messages).toHaveLength(1);
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

    it("reports guaranteed overlapping directory selectors for the same ecosystem and target branch", async () => {
        const duplicateDirectoryResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                "    schedule:",
                '      interval: "weekly"',
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                "    schedule:",
                '      interval: "weekly"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/no-overlapping-dependabot-directories":
                        "error",
                },
            }
        );
        const globOverlapResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                "    directories:",
                '      - "/packages/*"',
                "    schedule:",
                '      interval: "weekly"',
                '  - package-ecosystem: "npm"',
                '    directory: "/packages/app"',
                "    schedule:",
                '      interval: "weekly"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/no-overlapping-dependabot-directories":
                        "error",
                },
            }
        );

        expect(duplicateDirectoryResult.messages).toHaveLength(1);
        expect(globOverlapResult.messages).toHaveLength(1);
    });

    it("ignores distinct directories and same-directory selectors split across other ecosystems or branches", async () => {
        const distinctDirectoriesResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                "    schedule:",
                '      interval: "weekly"',
                '  - package-ecosystem: "npm"',
                '    directory: "/docs/docusaurus"',
                "    schedule:",
                '      interval: "weekly"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/no-overlapping-dependabot-directories":
                        "error",
                },
            }
        );
        const differentBranchResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                '    target-branch: "main"',
                "    schedule:",
                '      interval: "weekly"',
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                '    target-branch: "release"',
                "    schedule:",
                '      interval: "weekly"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/no-overlapping-dependabot-directories":
                        "error",
                },
            }
        );
        const differentEcosystemResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                "    schedule:",
                '      interval: "weekly"',
                '  - package-ecosystem: "docker"',
                '    directory: "/"',
                "    schedule:",
                '      interval: "weekly"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/no-overlapping-dependabot-directories":
                        "error",
                },
            }
        );

        expect(distinctDirectoriesResult.messages).toHaveLength(0);
        expect(differentBranchResult.messages).toHaveLength(0);
        expect(differentEcosystemResult.messages).toHaveLength(0);
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

    it("requires commit-message include scope and prefix-development for supported ecosystems", async () => {
        const missingIncludeScopeResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                "    cooldown:",
                "      default-days: 3",
                '    directory: "/"',
                "    open-pull-requests-limit: 5",
                "    schedule:",
                '      interval: "weekly"',
                '      time: "05:30"',
                '      timezone: "UTC"',
                "    assignees:",
                '      - "octocat"',
                '    target-branch: "main"',
                "    commit-message:",
                '      prefix: "deps"',
                '      prefix-development: "deps-dev"',
                "    labels:",
                '      - "dependencies"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-commit-message-include-scope":
                        "error",
                },
            }
        );
        const missingPrefixDevelopmentResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                "    cooldown:",
                "      default-days: 3",
                '    directory: "/"',
                "    open-pull-requests-limit: 5",
                "    schedule:",
                '      interval: "weekly"',
                '      time: "05:30"',
                '      timezone: "UTC"',
                "    assignees:",
                '      - "octocat"',
                '    target-branch: "main"',
                "    commit-message:",
                '      prefix: "deps"',
                '      include: "scope"',
                "    labels:",
                '      - "dependencies"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-commit-message-prefix-development":
                        "error",
                },
            }
        );

        expect(missingIncludeScopeResult.messages).toHaveLength(1);
        expect(missingPrefixDevelopmentResult.messages).toHaveLength(1);
    });

    it("requires npm entries to declare versioning-strategy", async () => {
        const result = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "npm"',
                "    cooldown:",
                "      default-days: 3",
                '    directory: "/"',
                "    open-pull-requests-limit: 5",
                "    schedule:",
                '      interval: "weekly"',
                '      time: "05:30"',
                '      timezone: "UTC"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                rules: {
                    "github-actions/require-dependabot-versioning-strategy-for-npm":
                        "error",
                },
            }
        );

        expect(result.messages).toHaveLength(1);
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

    it("autofixes github-actions ecosystems to use directory root", async () => {
        const invalidDirectoryResult = await lintWorkflow(
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
                fix: true,
                rules: {
                    "github-actions/require-dependabot-github-actions-directory-root":
                        "error",
                },
            }
        );
        const directoriesResult = await lintWorkflow(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "github-actions"',
                "    directories:",
                '      - "/.github/workflows"',
                "    schedule:",
                '      interval: "weekly"',
                '      time: "05:30"',
                '      timezone: "UTC"',
            ].join("\n"),
            {
                configName: "dependabot",
                filePath: ".github/dependabot.yml",
                fix: true,
                rules: {
                    "github-actions/require-dependabot-github-actions-directory-root":
                        "error",
                },
            }
        );

        expect(invalidDirectoryResult.output).toBe(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "github-actions"',
                '    directory: "/"',
                "    schedule:",
                '      interval: "weekly"',
                '      time: "05:30"',
                '      timezone: "UTC"',
            ].join("\n")
        );
        expect(directoriesResult.output).toBe(
            [
                "version: 2",
                "updates:",
                '  - package-ecosystem: "github-actions"',
                '    directory: "/"',
                "    schedule:",
                '      interval: "weekly"',
                '      time: "05:30"',
                '      timezone: "UTC"',
            ].join("\n")
        );
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
