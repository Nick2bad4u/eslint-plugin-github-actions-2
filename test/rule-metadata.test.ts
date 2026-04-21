import { describe, expect, it } from "vitest";

import githubActionsPlugin from "../src/plugin.js";

/** Rules that currently emit safe autofixes. */
const fixableRuleNames = new Set([
    "action-name-casing",
    "no-empty-template-file-pattern",
    "no-icon-file-extension-in-template-icon-name",
    "no-post-if-without-post",
    "no-pre-if-without-pre",
    "no-unused-dependabot-enable-beta-ecosystems",
    "prefer-inputs-context",
    "require-dependabot-github-actions-directory-root",
    "require-dependabot-version",
]);

/** Rules that currently emit high-quality suggestions. */
const suggestionRuleNames = new Set([
    "no-path-separators-in-template-icon-name",
    "no-required-input-with-default",
    "require-job-name",
    "require-job-step-name",
]);

/** Determine whether a rule accepts configurable options. */
const ruleHasConfigurableOptions = (
    meta: Readonly<
        NonNullable<(typeof githubActionsPlugin.rules)[string]["meta"]>
    >
): boolean => {
    const { schema } = meta;

    if (Array.isArray(schema)) {
        return schema.length > 0;
    }

    return schema !== undefined && schema !== false;
};

describe("rule metadata", () => {
    it("publishes normalized deprecation, frozen, and dialect metadata", () => {
        expect.hasAssertions();

        for (const [ruleName, rule] of Object.entries(
            githubActionsPlugin.rules
        )) {
            expect(rule.meta, `${ruleName} should define meta`).toBeDefined();
            expect(
                rule.meta?.deprecated,
                `${ruleName} should explicitly publish deprecated=false`
            ).toBeFalsy();
            expect(
                rule.meta?.languages,
                `${ruleName} should omit meta.languages until the plugin exposes a real ESLint language id`
            ).toBeUndefined();
            expect(
                rule.meta?.docs?.frozen,
                `${ruleName} should explicitly publish docs.frozen=false`
            ).toBeFalsy();
            expect(
                rule.meta?.docs?.dialects,
                `${ruleName} should publish at least one dialect label`
            ).toBeDefined();
            expect(rule.meta?.docs?.dialects).not.toHaveLength(0);
        }
    });

    it("publishes default options for every configurable rule", () => {
        expect.hasAssertions();

        for (const [ruleName, rule] of Object.entries(
            githubActionsPlugin.rules
        )) {
            const meta = rule.meta;
            const hasConfigurableOptions =
                meta !== undefined && ruleHasConfigurableOptions(meta);
            const hasDefaultOptions = meta?.defaultOptions !== undefined;

            expect(meta, `${ruleName} should define meta`).toBeDefined();
            expect(
                !hasConfigurableOptions || hasDefaultOptions,
                `${ruleName} should define defaultOptions because it exposes options`
            ).toBeTruthy();
            expect(
                !hasDefaultOptions || Array.isArray(meta?.defaultOptions),
                `${ruleName} defaultOptions should be an array when provided`
            ).toBeTruthy();
        }
    });

    it("marks every autofixing rule as fixable", () => {
        expect.hasAssertions();

        for (const [ruleName, rule] of Object.entries(
            githubActionsPlugin.rules
        )) {
            const shouldBeFixable = fixableRuleNames.has(ruleName);

            expect(
                !shouldBeFixable || rule.meta?.fixable === "code",
                `${ruleName} should declare fixable=code`
            ).toBeTruthy();
        }
    });

    it("marks every suggestion-producing rule with hasSuggestions", () => {
        expect.hasAssertions();

        for (const [ruleName, rule] of Object.entries(
            githubActionsPlugin.rules
        )) {
            const shouldHaveSuggestions = suggestionRuleNames.has(ruleName);

            expect(
                !shouldHaveSuggestions || rule.meta?.hasSuggestions,
                `${ruleName} should declare hasSuggestions=true`
            ).toBeTruthy();
        }
    });
});
