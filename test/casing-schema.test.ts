import { describe, expect, it } from "vitest";

import { lintWorkflow } from "./_shared/lint-workflow.js";

const casingRuleNames = [
    "action-name-casing",
    "input-id-case",
    "job-id-casing",
] as const;

describe.each(casingRuleNames)("%s option schema", (ruleName) => {
    it.each([
        "camelCase",
        "kebab-case",
        "PascalCase",
        "SCREAMING_SNAKE_CASE",
        "snake_case",
        "Train-Case",
    ])("accepts %s as a single style and boolean flag", async (style) => {
        expect.hasAssertions();

        for (const option of [
            style,
            { ignores: ["legacyName"], [style]: true },
        ]) {
            const result = await lintWorkflow("", {
                rules: { [`github-actions/${ruleName}`]: ["error", option] },
            });

            expect(result.messages).toHaveLength(0);
        }
    });

    it.each([
        { camelCase: "true" },
        { ignores: "legacyName" },
        { ignores: ["legacyName", "legacyName"] },
        { ignores: [123] },
        { unknownStyle: true },
        "unknownStyle",
    ])("rejects invalid option %j", async (option) => {
        expect.hasAssertions();

        await expect(
            lintWorkflow("", {
                rules: { [`github-actions/${ruleName}`]: ["error", option] },
            })
        ).rejects.toThrow("should");
    });
});

describe("title case schema boundary", () => {
    it("allows Title Case for workflow names", async () => {
        expect.hasAssertions();

        for (const option of ["Title Case", { "Title Case": true }]) {
            const result = lintWorkflow("", {
                rules: {
                    "github-actions/action-name-casing": ["error", option],
                },
            });

            await expect(result).resolves.toMatchObject({ messages: [] });
        }
    });

    it.each(["input-id-case", "job-id-casing"])(
        "rejects Title Case for %s",
        async (ruleName) => {
            expect.hasAssertions();

            for (const option of ["Title Case", { "Title Case": true }]) {
                await expect(
                    lintWorkflow("", {
                        rules: {
                            [`github-actions/${ruleName}`]: ["error", option],
                        },
                    })
                ).rejects.toThrow("should");
            }
        }
    );
});
