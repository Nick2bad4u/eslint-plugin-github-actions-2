import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { describe, expect, it } from "vitest";
import { parseForESLint } from "yaml-eslint-parser";

import {
    getDependabotRoot,
    getDependabotUpdateEntries,
    getDependabotUpdateLabel,
    getEffectiveDependabotUpdateMapping,
    getEffectiveDependabotUpdateValue,
    getNonEmptyStringSequenceEntries,
} from "../src/_internal/dependabot-yaml.js";
import {
    getScalarStringValue,
    unwrapYamlValue,
} from "../src/_internal/workflow-yaml.js";

const parseProgram = (yamlText: string): AST.YAMLProgram =>
    parseForESLint(yamlText).ast;

const parseRootMapping = (yamlText: string): AST.YAMLMapping => {
    const root = unwrapYamlValue(
        parseProgram(yamlText).body[0]?.content ?? null
    );

    if (root?.type !== "YAMLMapping") {
        throw new Error("Expected YAML root mapping.");
    }

    return root;
};

describe("dependabot YAML helpers", () => {
    it("resolves root mappings only for Dependabot files", () => {
        const dependabotContext = {
            filename: ".github/dependabot.yml",
            sourceCode: {
                ast: parseProgram("version: 2"),
            },
        } as unknown as Rule.RuleContext;
        const workflowContext = {
            filename: ".github/workflows/ci.yml",
            sourceCode: {
                ast: parseProgram("version: 2"),
            },
        } as unknown as Rule.RuleContext;

        expect(getDependabotRoot(dependabotContext)?.type).toBe("YAMLMapping");
        expect(getDependabotRoot(workflowContext)).toBeNull();
    });

    it("collects update entries and resolves multi-ecosystem group fallback", () => {
        const root = parseRootMapping(
            [
                "version: 2",
                "multi-ecosystem-groups:",
                "  app:",
                "    schedule:",
                '      interval: "weekly"',
                '      time: "05:30"',
                '      timezone: "UTC"',
                "    labels:",
                '      - "dependencies"',
                "updates:",
                '  - package-ecosystem: "npm"',
                '    directory: "/"',
                '    multi-ecosystem-group: "app"',
            ].join("\n")
        );

        const [update] = getDependabotUpdateEntries(root);

        expect(update).toBeTruthy();
        expect(update?.packageEcosystem).toBe("npm");
        expect(update?.multiEcosystemGroup).toBe("app");
        expect(getDependabotUpdateLabel(update!)).toBe("updates[1] (npm)");

        const scheduleMapping = getEffectiveDependabotUpdateMapping(
            root,
            update!,
            "schedule"
        );
        const labelsValue = getEffectiveDependabotUpdateValue(
            root,
            update!,
            "labels"
        );

        expect(
            getScalarStringValue(scheduleMapping?.pairs[0]?.value)?.trim()
        ).toBe("weekly");
        expect(getNonEmptyStringSequenceEntries(labelsValue)).toEqual([
            {
                node: expect.anything(),
                value: "dependencies",
            },
        ]);
    });

    it("filters empty sequence values when collecting non-empty strings", () => {
        const root = parseRootMapping(
            [
                "labels:",
                '  - "dependencies"',
                '  - "  "',
                "  - 42",
            ].join("\n")
        );

        expect(
            getNonEmptyStringSequenceEntries(root.pairs[0]?.value).map(
                (entry) => entry.value
            )
        ).toEqual(["dependencies", "42"]);
    });
});
