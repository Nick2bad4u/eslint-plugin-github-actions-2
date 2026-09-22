/**
 * @packageDocumentation
 * YAML RuleTester integration for the public GitHub Actions plugin.
 */
import { RuleTester } from "@typescript-eslint/rule-tester";
import { afterAll, describe, it } from "vitest";
import * as yamlParser from "yaml-eslint-parser";

import githubActionsPlugin, {
    type GithubActionsRuleName,
} from "../../src/plugin.js";

RuleTester.afterAll = afterAll;
RuleTester.describe = (name, callback) => {
    describe(name, () => {
        callback();
    });
};
RuleTester.it = it;
RuleTester.itOnly = it.only;

/** Create a parser-agnostic tester configured for GitHub Actions YAML. */
export const createRuleTester = (): RuleTester =>
    new RuleTester({
        languageOptions: { parser: yamlParser },
    });

/** Resolve public rule registration and adapt the ESLint type boundary. */
export const getPluginRule = (
    ruleName: GithubActionsRuleName
): Parameters<RuleTester["run"]>[1] => {
    const rule = githubActionsPlugin.rules[ruleName];

    if (rule === undefined) {
        throw new Error(`Missing registered rule: ${ruleName}`);
    }

    // The plugin uses ESLint's RuleModule contract; RuleTester uses its equivalent typed contract.
    return rule as unknown as Parameters<RuleTester["run"]>[1];
};
