import { describe, expect, it } from "vitest";

import {
    createDisplayNameCasingPolicy,
    DEFAULT_DISPLAY_NAME_CASING,
} from "../src/_internal/display-name-casing.js";

describe(createDisplayNameCasingPolicy, () => {
    it.each([
        ["no options", []],
        ["an unsupported casing name", ["Sponge Case"]],
        ["a non-object option", [42]],
        ["a null option", [null]],
    ])("falls back to the default casing for %s", (_label, options) => {
        expect.hasAssertions();

        const policy = createDisplayNameCasingPolicy(options);

        expect(policy.allowedCasings).toStrictEqual([
            DEFAULT_DISPLAY_NAME_CASING,
        ]);
        expect(policy.allowedNamePattern).toBeUndefined();
        expect(policy.ignoredNames).toStrictEqual([]);
    });

    it("uses a supported casing name", () => {
        expect.hasAssertions();

        expect(
            createDisplayNameCasingPolicy(["kebab-case"]).allowedCasings
        ).toStrictEqual(["kebab-case"]);
    });
});
