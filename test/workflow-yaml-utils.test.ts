import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { describe, expect, it } from "vitest";
import { parseForESLint } from "yaml-eslint-parser";

import {
    getMappingPair,
    getMappingValueAsMapping,
    getMappingValueAsSequence,
    getScalarNumberValue,
    getScalarStringValue,
    getWorkflowEventNames,
    getWorkflowJobs,
    getWorkflowRoot,
    isGithubExpressionScalar,
    isYamlMapping,
    isYamlScalar,
    isYamlSequence,
    isYamlWithMeta,
    unwrapYamlValue,
    WORKFLOW_FILE_GLOBS,
} from "../src/_internal/workflow-yaml.js";

const parseProgram = (yamlText: string): AST.YAMLProgram =>
    parseForESLint(yamlText).ast;

const githubExpression = (expression: string): string =>
    `\${{ ${expression} }}`;

const parseRootMapping = (yamlText: string): AST.YAMLMapping => {
    const program = parseProgram(yamlText);
    const root = unwrapYamlValue(program.body[0]?.content ?? null);

    if (root?.type !== "YAMLMapping") {
        throw new Error("Expected YAML root mapping.");
    }

    return root;
};

describe("workflow YAML helpers", () => {
    it("exports stable workflow file globs", () => {
        expect(WORKFLOW_FILE_GLOBS).toEqual([".github/workflows/*.{yml,yaml}"]);
    });

    it("unwraps YAMLWithMeta values and supports type guards", () => {
        const scalarNode = parseRootMapping("name: CI").pairs[0]?.value;

        expect(scalarNode).toBeTruthy();

        const wrappedNode = {
            type: "YAMLWithMeta",
            value: scalarNode as AST.YAMLContent,
        } as unknown as AST.YAMLWithMeta;

        expect(isYamlWithMeta(wrappedNode)).toBeTruthy();
        expect(unwrapYamlValue(wrappedNode)?.type).toBe("YAMLScalar");
        expect(unwrapYamlValue(null)).toBeNull();
        expect(unwrapYamlValue(undefined)).toBeNull();

        expect(isYamlScalar(wrappedNode)).toBeTruthy();
        expect(isYamlMapping(wrappedNode)).toBeFalsy();
        expect(isYamlSequence(wrappedNode)).toBeFalsy();
    });

    it("reads scalar values as strings or numbers where appropriate", () => {
        const root = parseRootMapping(
            [
                "name: Build",
                "retries: 3",
                "enabled: true",
                "empty:",
                "steps:",
                "  - run: echo hi",
            ].join("\n")
        );

        const nameNode = getMappingPair(root, "name")?.value;
        const retriesNode = getMappingPair(root, "retries")?.value;
        const enabledNode = getMappingPair(root, "enabled")?.value;
        const emptyNode = getMappingPair(root, "empty")?.value;
        const stepsNode = getMappingPair(root, "steps")?.value;

        expect(getScalarStringValue(nameNode)).toBe("Build");
        expect(getScalarStringValue(retriesNode)).toBe("3");
        expect(getScalarStringValue(enabledNode)).toBe("true");
        expect(getScalarStringValue(emptyNode)).toBeNull();
        expect(getScalarStringValue(stepsNode)).toBeNull();

        expect(getScalarNumberValue(retriesNode)).toBe(3);
        expect(getScalarNumberValue(nameNode)).toBeNull();
    });

    it("detects GitHub expression scalars with surrounding whitespace", () => {
        const root = parseRootMapping(
            [
                `expr: '  ${githubExpression("github.ref")}  '`,
                "plain: github.ref",
            ].join("\n")
        );

        expect(
            isGithubExpressionScalar(getMappingPair(root, "expr")?.value)
        ).toBeTruthy();
        expect(
            isGithubExpressionScalar(getMappingPair(root, "plain")?.value)
        ).toBeFalsy();
    });

    it("finds mapping pairs and narrows mapping or sequence values", () => {
        const root = parseRootMapping(
            [
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "list:",
                "  - one",
                "  - two",
                "flag: true",
            ].join("\n")
        );

        expect(getMappingPair(root, "jobs")).not.toBeNull();
        expect(getMappingPair(root, "missing")).toBeNull();

        expect(getMappingValueAsMapping(root, "jobs")?.type).toBe(
            "YAMLMapping"
        );
        expect(getMappingValueAsMapping(root, "flag")).toBeNull();

        expect(getMappingValueAsSequence(root, "list")?.type).toBe(
            "YAMLSequence"
        );
        expect(getMappingValueAsSequence(root, "jobs")).toBeNull();
    });

    it("resolves workflow root mappings from ESLint rule context", () => {
        const workflowContext = {
            sourceCode: {
                ast: parseProgram("name: CI"),
            },
        } as unknown as Rule.RuleContext;
        const nonMappingContext = {
            sourceCode: {
                ast: parseProgram("- push"),
            },
        } as unknown as Rule.RuleContext;

        expect(getWorkflowRoot(workflowContext)?.type).toBe("YAMLMapping");
        expect(getWorkflowRoot(nonMappingContext)).toBeNull();
    });

    it("collects workflow jobs and ignores non-mapping job entries", () => {
        const root = parseRootMapping(
            [
                "jobs:",
                "  build:",
                "    runs-on: ubuntu-latest",
                "  lint: true",
                "  deploy:",
                "    runs-on: ubuntu-latest",
            ].join("\n")
        );

        const jobs = getWorkflowJobs(root);

        expect(jobs).toHaveLength(2);
        expect(jobs.map((job) => job.id)).toEqual(["build", "deploy"]);
        expect(getWorkflowJobs(parseRootMapping("name: CI"))).toEqual([]);
    });

    it("collects workflow event names from scalar, sequence, and mapping forms", () => {
        const scalarRoot = parseRootMapping("on: push");
        const sequenceRoot = parseRootMapping(
            [
                "on:",
                "  - pull_request",
                "  - workflow_dispatch",
            ].join("\n")
        );
        const mappingRoot = parseRootMapping(
            [
                "on:",
                "  workflow_run:",
                "    workflows: ['CI']",
                "  push:",
            ].join("\n")
        );
        const missingOnRoot = parseRootMapping("name: CI");

        expect([...getWorkflowEventNames(scalarRoot)]).toEqual(["push"]);
        expect([...getWorkflowEventNames(sequenceRoot)]).toEqual([
            "pull_request",
            "workflow_dispatch",
        ]);
        expect(getWorkflowEventNames(mappingRoot)).toEqual(
            new Set(["push", "workflow_run"])
        );
        expect([...getWorkflowEventNames(missingOnRoot)]).toEqual([]);
    });
});
