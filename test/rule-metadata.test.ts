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
    "require-dependabot-version",
]);

/** Rules that currently emit high-quality suggestions. */
const suggestionRuleNames = new Set([
    "no-path-separators-in-template-icon-name",
    "no-required-input-with-default",
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
        for (const [ruleName, rule] of Object.entries(
            githubActionsPlugin.rules
        )) {
            const meta = rule.meta;

            expect(meta, `${ruleName} should define meta`).toBeDefined();

            if (meta !== undefined && ruleHasConfigurableOptions(meta)) {
                expect(
                    meta.defaultOptions,
                    `${ruleName} should define defaultOptions because it exposes options`
                ).toBeDefined();
                expect(Array.isArray(meta.defaultOptions)).toBeTruthy();
            }
        }
    });

    it("marks every autofixing rule as fixable", () => {
        for (const [ruleName, rule] of Object.entries(
            githubActionsPlugin.rules
        )) {
            if (fixableRuleNames.has(ruleName)) {
                expect(
                    rule.meta?.fixable,
                    `${ruleName} should declare fixable=code`
                ).toBe("code");
            }
        }
    });

    it("marks every suggestion-producing rule with hasSuggestions", () => {
        for (const [ruleName, rule] of Object.entries(
            githubActionsPlugin.rules
        )) {
            if (suggestionRuleNames.has(ruleName)) {
                expect(
                    rule.meta?.hasSuggestions,
                    `${ruleName} should declare hasSuggestions=true`
                ).toBeTruthy();
            }
        }
    });
});
