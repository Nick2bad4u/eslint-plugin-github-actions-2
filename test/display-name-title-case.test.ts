import { describe, expect, it } from "vitest";

import {
    convertDisplayNameToTitleCase,
    hasOpaqueDisplayNameSegment,
} from "../src/_internal/workflow-title-case.js";

describe(convertDisplayNameToTitleCase, () => {
    it.each([
        ["lint code and docs", "Lint Code and Docs"],
        ["check out source", "Check Out Source"],
        ["Lint The Code", "Lint the Code"],
        ["a guide to the code", "A Guide to the Code"],
        ["set up github cli", "Set Up GitHub CLI"],
        ["end-to-end tests", "End-to-End Tests"],
        ["don't panic", "Don't Panic"],
        ["Upload v4 artifacts", "Upload v4 Artifacts"],
        ["publish to npm", "Publish to npm"],
        ["  spaced   out  ", "  Spaced   Out  "],
        [`run \${{ '}}lowercase' }}`, `Run \${{ '}}lowercase' }}`],
        [`run \${{ 'it''s }} done' }} now`, `Run \${{ 'it''s }} done' }} Now`],
        [
            `run \${{ '}}' }} on \${{ matrix.os }}`,
            `Run \${{ '}}' }} on \${{ matrix.os }}`,
        ],
    ])("converts %j to %j", (input, expected) => {
        expect.hasAssertions();

        expect(convertDisplayNameToTitleCase(input)).toBe(expected);
    });

    it.each([
        `Validate Package on \${{ matrix.os }}`,
        `Test on Node \${{ matrix.node }} with ESLint \${{ matrix.eslint }}`,
        "Run `npm test`",
        "Build & Test (Linux)",
        "Set Up Node.js 22.x",
        "CodeQL Analysis",
        "MSBuild Release",
        `\${{ matrix.name }}`,
        "Deploy to AWS (CI)",
    ])("keeps %j unchanged", (input) => {
        expect.hasAssertions();

        expect(convertDisplayNameToTitleCase(input)).toBe(input);
    });

    it("never rewrites expression or code span contents", () => {
        expect.hasAssertions();

        expect(
            convertDisplayNameToTitleCase(
                `run \${{ inputs.task-name }} with \`npm run lint:fix\``
            )
        ).toBe(`Run \${{ inputs.task-name }} with \`npm run lint:fix\``);
    });

    it("treats an expression as the last word for small-word placement", () => {
        expect.hasAssertions();

        expect(
            convertDisplayNameToTitleCase(`Deploy To \${{ env.TARGET }}`)
        ).toBe(`Deploy to \${{ env.TARGET }}`);
    });

    it("treats unterminated expressions and code spans as text", () => {
        expect.hasAssertions();

        expect(convertDisplayNameToTitleCase("run `npm test")).toBe(
            "Run `npm Test"
        );
        expect(convertDisplayNameToTitleCase(`use \${{ matrix`)).toBe(
            `Use \${{ Matrix`
        );
    });

    it("only changes letter case", () => {
        expect.hasAssertions();

        const input = `build & deploy (prod): step 2/3 — \${{ x }} \`y\`!`;
        const output = convertDisplayNameToTitleCase(input);

        expect(output).toHaveLength(input.length);
        expect(output.toLowerCase()).toBe(input.toLowerCase());
    });
});

describe(hasOpaqueDisplayNameSegment, () => {
    it.each([
        [`Test on \${{ matrix.os }}`, true],
        ["Run `npm test`", true],
        ["Run `npm test", false],
        ["Plain Name", false],
    ])("detects opaque segments in %j", (input, expected) => {
        expect.hasAssertions();

        expect(hasOpaqueDisplayNameSegment(input)).toBe(expected);
    });
});
