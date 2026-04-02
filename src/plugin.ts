/**
 * @packageDocumentation
 * Public plugin entrypoint for eslint-plugin-github-actions-2.
 */
import type { ESLint, Linter, Rule } from "eslint";

import * as yamlParser from "yaml-eslint-parser";

import type { GithubActionsRuleDocs } from "./_internal/rule-docs.js";

import packageJson from "../package.json" with { type: "json" };
import {
    githubActionsConfigMetadataByName,
    type GithubActionsConfigName,
    githubActionsConfigNames,
    type GithubActionsConfigReference,
    githubActionsConfigReferenceToName,
} from "./_internal/github-actions-config-references.js";
import { githubActionsRules } from "./_internal/rules-registry.js";

/** ESLint severity used by generated preset rule maps. */
const ERROR_SEVERITY = "error" as const;

/** Runtime type for the plugin's generated config presets. */
export type GithubActionsConfigs = Record<
    GithubActionsConfigName,
    GithubActionsPresetConfig
>;

/** Flat config shape produced by this plugin. */
export type GithubActionsPresetConfig = Linter.Config & {
    rules: NonNullable<Linter.Config["rules"]>;
};

/** Fully-qualified ESLint rule ids exposed by this plugin. */
export type GithubActionsRuleId = `github-actions/${GithubActionsRuleName}`;

/** Unqualified rule names supported by eslint-plugin-github-actions-2. */
export type GithubActionsRuleName = keyof typeof githubActionsRules;

/** Fully assembled plugin contract used by the runtime default export. */
type GithubActionsPluginContract = Omit<
    ESLint.Plugin,
    "configs" | "meta" | "rules"
> & {
    configs: GithubActionsConfigs;
    meta: {
        name: string;
        namespace: string;
        version: string;
    };
    rules: NonNullable<ESLint.Plugin["rules"]>;
};

/** Rule-map type used when expanding preset memberships. */
type RulesConfig = GithubActionsPresetConfig["rules"];

/** Resolve package version from package.json data. */
function getPackageVersion(pkg: unknown): string {
    if (typeof pkg !== "object" || pkg === null) {
        return "0.0.0";
    }

    const version = Reflect.get(pkg, "version");

    return typeof version === "string" ? version : "0.0.0";
}

/** Determine whether a string is a valid config-reference token. */
const isGithubActionsConfigReference = (
    value: string
): value is GithubActionsConfigReference =>
    Object.hasOwn(githubActionsConfigReferenceToName, value);

/** Normalize stored rule docs config references to a validated string array. */
const getRuleConfigReferences = (
    ruleName: GithubActionsRuleName,
    rule: Readonly<Rule.RuleModule>
): readonly GithubActionsConfigReference[] => {
    const docs = rule.meta?.docs as GithubActionsRuleDocs | undefined;
    const references = docs?.configs;
    const referenceList = Array.isArray(references) ? references : [references];

    if (referenceList.length === 0 || referenceList[0] === undefined) {
        throw new TypeError(
            `Rule '${ruleName}' is missing docs.configs preset metadata.`
        );
    }

    for (const reference of referenceList) {
        if (
            typeof reference !== "string" ||
            !isGithubActionsConfigReference(reference)
        ) {
            throw new TypeError(
                `Rule '${ruleName}' has an invalid config reference '${String(reference)}'.`
            );
        }
    }

    return referenceList;
};

/** Strongly typed ESLint rule view of the internal registry. */
const githubActionsEslintRules: NonNullable<ESLint.Plugin["rules"]> &
    typeof githubActionsRules = githubActionsRules as NonNullable<
    ESLint.Plugin["rules"]
> &
    typeof githubActionsRules;

/** Stable rule-entry list used by config derivation and docs tests. */
const githubActionsRuleEntries: readonly (readonly [
    GithubActionsRuleName,
    Rule.RuleModule,
])[] = Object.entries(githubActionsRules) as readonly (readonly [
    GithubActionsRuleName,
    Rule.RuleModule,
])[];

/** Build a config-to-rule-name map from rule docs metadata. */
const createPresetRuleNamesByConfig = (): Record<
    GithubActionsConfigName,
    GithubActionsRuleName[]
> => {
    const presetRuleNamesByConfig: Record<
        GithubActionsConfigName,
        GithubActionsRuleName[]
    > = {
        actionMetadata: [],
        all: [],
        dependabot: [],
        recommended: [],
        security: [],
        strict: [],
        workflowTemplateProperties: [],
        workflowTemplates: [],
    };

    for (const [ruleName, rule] of githubActionsRuleEntries) {
        for (const reference of getRuleConfigReferences(ruleName, rule)) {
            const configName = githubActionsConfigReferenceToName[reference];

            if (configName === undefined) {
                continue;
            }

            presetRuleNamesByConfig[configName].push(ruleName);
        }
    }

    return presetRuleNamesByConfig;
};

/** Effective rule membership for every exported config preset. */
const presetRuleNamesByConfig: Readonly<
    Record<GithubActionsConfigName, readonly GithubActionsRuleName[]>
> = createPresetRuleNamesByConfig();

/** Build an ESLint rules map that enables each provided rule at error level. */
function errorRulesFor(
    ruleNames: readonly GithubActionsRuleName[]
): RulesConfig {
    const rules: RulesConfig = {};

    for (const ruleName of ruleNames) {
        rules[`github-actions/${ruleName}`] = ERROR_SEVERITY;
    }

    return rules;
}

/** Apply YAML parser and plugin registration to a preset config fragment. */
function withGithubActionsPlugin(
    config: Readonly<GithubActionsPresetConfig>,
    plugin: Readonly<ESLint.Plugin>
): GithubActionsPresetConfig {
    const existingLanguageOptions = config.languageOptions ?? {};
    const existingParserOptions = existingLanguageOptions["parserOptions"];

    return {
        ...config,
        languageOptions: {
            ...existingLanguageOptions,
            parser: existingLanguageOptions["parser"] ?? yamlParser,
            parserOptions:
                existingParserOptions !== null &&
                typeof existingParserOptions === "object" &&
                !Array.isArray(existingParserOptions)
                    ? { ...existingParserOptions }
                    : {},
        },
        plugins: {
            ...config.plugins,
            "github-actions": plugin,
        },
    };
}

/** Minimal plugin view used while assembling exported presets. */
const pluginForConfigs: ESLint.Plugin = {
    rules: githubActionsEslintRules,
};

/** Create every exported flat-config preset from static metadata. */
const createGithubActionsConfigsDefinition = (): GithubActionsConfigs => {
    const configs = {} as GithubActionsConfigs;

    for (const configName of githubActionsConfigNames) {
        const metadata = githubActionsConfigMetadataByName[configName];

        configs[configName] = withGithubActionsPlugin(
            {
                files: [...metadata.files],
                name: metadata.presetName,
                rules: errorRulesFor(presetRuleNamesByConfig[configName]),
            },
            pluginForConfigs
        );
    }

    return configs;
};

/** Finalized typed view of all exported flat-config presets. */
const githubActionsConfigs: GithubActionsConfigs =
    createGithubActionsConfigsDefinition();

/** Main plugin object exported for ESLint consumption. */
const githubActionsPlugin: GithubActionsPluginContract = {
    configs: githubActionsConfigs,
    meta: {
        name: "eslint-plugin-github-actions-2",
        namespace: "github-actions",
        version: getPackageVersion(packageJson),
    },
    processors: {},
    rules: githubActionsEslintRules,
};

/** Runtime type for the plugin object exported as default. */
export type GithubActionsPlugin = typeof githubActionsPlugin;

/** Default plugin export consumed by ESLint flat config. */
export default githubActionsPlugin;
