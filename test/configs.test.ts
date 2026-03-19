import { describe, expect, it } from "vitest";

import githubActionsPlugin from "../src/plugin.js";

describe("exported presets", () => {
    it("exports the expected preset names", () => {
        expect(
            Object.keys(githubActionsPlugin.configs).toSorted((left, right) =>
                left.localeCompare(right)
            )
        ).toEqual([
            "all",
            "recommended",
            "security",
            "strict",
        ]);
    });

    it("scopes presets to workflow YAML files", () => {
        expect(githubActionsPlugin.configs.recommended.files).toEqual([
            ".github/workflows/*.{yml,yaml}",
        ]);
    });

    it("wires rule membership by preset", () => {
        expect(
            Object.keys(githubActionsPlugin.configs.recommended.rules).toSorted(
                (left, right) => left.localeCompare(right)
            )
        ).toEqual([
            "github-actions/require-job-timeout-minutes",
            "github-actions/require-workflow-permissions",
        ]);
        expect(
            Object.keys(githubActionsPlugin.configs.security.rules).toSorted(
                (left, right) => left.localeCompare(right)
            )
        ).toEqual([
            "github-actions/pin-action-shas",
            "github-actions/require-workflow-permissions",
        ]);
        expect(
            Object.keys(githubActionsPlugin.configs.strict.rules).toSorted(
                (left, right) => left.localeCompare(right)
            )
        ).toEqual([
            "github-actions/pin-action-shas",
            "github-actions/require-job-timeout-minutes",
            "github-actions/require-workflow-concurrency",
            "github-actions/require-workflow-permissions",
        ]);
    });
});
