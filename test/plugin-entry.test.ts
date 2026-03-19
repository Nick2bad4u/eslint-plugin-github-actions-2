import { describe, expect, it } from "vitest";

import githubActionsPlugin from "../src/plugin.js";

describe("plugin entry", () => {
    it("exports GitHub Actions plugin metadata", () => {
        expect(githubActionsPlugin.meta).toMatchObject({
            name: "eslint-plugin-github-actions",
            namespace: "github-actions",
        });
    });

    it("exports the expected rule names", () => {
        expect(
            Object.keys(githubActionsPlugin.rules).toSorted((left, right) =>
                left.localeCompare(right)
            )
        ).toEqual([
            "pin-action-shas",
            "require-job-timeout-minutes",
            "require-workflow-concurrency",
            "require-workflow-permissions",
        ]);
    });
});
