import type { AST } from "yaml-eslint-parser";

import { describe, expect, it } from "vitest";
import { parseForESLint } from "yaml-eslint-parser";

import {
    getDependencyReviewActionSteps,
    hasDependencyReviewAction,
    isDependencyReviewActionReference,
} from "../src/_internal/dependency-review-workflow.js";
import { unwrapYamlValue } from "../src/_internal/workflow-yaml.js";

const parseRootMapping = (yamlText: string): AST.YAMLMapping => {
    const root = unwrapYamlValue(
        parseForESLint(yamlText).ast.body[0]?.content ?? null
    );

    if (root?.type !== "YAMLMapping") {
        throw new Error("Expected YAML root mapping.");
    }

    return root;
};

describe("dependency review workflow helpers", () => {
    it("detects dependency review action references", () => {
        expect.hasAssertions();
        expect(
            isDependencyReviewActionReference(
                "actions/dependency-review-action@v4"
            )
        ).toBeTruthy();
        expect(
            isDependencyReviewActionReference("actions/checkout@v5")
        ).toBeFalsy();
    });

    it("collects workflow steps using the dependency review action", () => {
        expect.hasAssertions();

        const root = parseRootMapping(
            [
                "name: Dependency Review",
                "on: [pull_request]",
                "jobs:",
                "  dependency-review:",
                "    runs-on: ubuntu-latest",
                "    steps:",
                "      - uses: actions/checkout@v5",
                "      - uses: actions/dependency-review-action@v4",
            ].join("\n")
        );

        const steps = getDependencyReviewActionSteps(root);

        expect(steps).toHaveLength(1);
        expect(steps[0]?.job.id).toBe("dependency-review");
        expect(steps[0]?.usesReference).toBe(
            "actions/dependency-review-action@v4"
        );
        expect(hasDependencyReviewAction(root)).toBeTruthy();
    });
});
