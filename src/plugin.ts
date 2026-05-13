/**
 * @packageDocumentation
 * Public plugin entrypoint for eslint-plugin-github-actions-2.
 */
import type { ESLint, Linter, Rule } from "eslint";
import type { Except, UnknownArray } from "type-fest";

import {
    arrayFirst,
    isDefined,
    isEmpty,
    objectEntries,
    objectHasOwn,
} from "ts-extras";
import * as yamlParser from "yaml-eslint-parser";

import type { GithubActionsRuleDocs } from "./_internal/rule-docs.js";

import {
    githubActionsConfigMetadataByName,
    type GithubActionsConfigName,
    type GithubActionsConfigReference,
    githubActionsConfigReferenceToName,
} from "./_internal/github-actions-config-references.js";
import { githubActionsRules } from "./_internal/rules-registry.js";

/** ESLint severity used by generated preset rule maps. */
const ERROR_SEVERITY = "error" as const;
const PLUGIN_VERSION = "1.1.3";

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
type GithubActionsPluginContract = Except<
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

/** Narrow unknown docs payloads to this plugin's docs metadata shape. */
const isGithubActionsRuleDocs = (
    value: unknown
): value is GithubActionsRuleDocs =>
    typeof value === "object" && value !== null;

/** Determine whether a string is a valid config-reference token. */
const isGithubActionsConfigReference = (
    value: string
): value is GithubActionsConfigReference =>
    objectHasOwn(githubActionsConfigReferenceToName, value);

/** Normalize stored rule docs config references to a validated string array. */
const getRuleConfigReferences = (
    ruleName: GithubActionsRuleName,
    rule: Readonly<Rule.RuleModule>
): readonly GithubActionsConfigReference[] => {
    const docs = isGithubActionsRuleDocs(rule.meta?.docs)
        ? rule.meta.docs
        : undefined;
    const references = docs?.configs;

    if (!isDefined(references)) {
        return [];
    }

    const rawReferenceList: Readonly<UnknownArray> = Array.isArray(references)
        ? references
        : [references];

    if (isEmpty(rawReferenceList) || !isDefined(arrayFirst(rawReferenceList))) {
        return [];
    }

    const validatedReferences: GithubActionsConfigReference[] = [];

    for (const reference of rawReferenceList) {
        if (
            typeof reference !== "string" ||
            !isGithubActionsConfigReference(reference)
        ) {
            throw new TypeError(
                `Rule '${ruleName}' has an invalid config reference '${String(reference)}'.`
            );
        }

        validatedReferences.push(reference);
    }

    return validatedReferences;
};

/** Strongly typed ESLint rule view of the internal registry. */
const githubActionsEslintRules: NonNullable<ESLint.Plugin["rules"]> &
    typeof githubActionsRules = githubActionsRules;

/** Stable rule-entry list used by config derivation and docs tests. */
const githubActionsRuleEntries: readonly (readonly [
    GithubActionsRuleName,
    Rule.RuleModule,
])[] = objectEntries(githubActionsRules);

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
        codeScanning: [],
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

            if (!isDefined(configName)) {
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

/** Create one exported preset config from static preset metadata. */
const createGithubActionsPresetConfig = (
    configName: GithubActionsConfigName
): GithubActionsPresetConfig => {
    const metadata = githubActionsConfigMetadataByName[configName];

    return withGithubActionsPlugin(
        {
            files: [...metadata.files],
            name: metadata.presetName,
            rules: errorRulesFor(presetRuleNamesByConfig[configName]),
        },
        pluginForConfigs
    );
};

/** Create every exported flat-config preset from static metadata. */
const createGithubActionsConfigsDefinition = (): GithubActionsConfigs => ({
    actionMetadata: createGithubActionsPresetConfig("actionMetadata"),
    all: createGithubActionsPresetConfig("all"),
    codeScanning: createGithubActionsPresetConfig("codeScanning"),
    dependabot: createGithubActionsPresetConfig("dependabot"),
    recommended: createGithubActionsPresetConfig("recommended"),
    security: createGithubActionsPresetConfig("security"),
    strict: createGithubActionsPresetConfig("strict"),
    workflowTemplateProperties: createGithubActionsPresetConfig(
        "workflowTemplateProperties"
    ),
    workflowTemplates: createGithubActionsPresetConfig("workflowTemplates"),
});

/** Finalized typed view of all exported flat-config presets. */
const githubActionsConfigs: GithubActionsConfigs =
    createGithubActionsConfigsDefinition();

/** Main plugin object exported for ESLint consumption. */
const githubActionsPlugin: GithubActionsPluginContract = {
    configs: githubActionsConfigs,
    meta: {
        name: "eslint-plugin-github-actions-2",
        namespace: "github-actions",
        version: PLUGIN_VERSION,
    },
    processors: {},
    rules: githubActionsEslintRules,
};

/** Runtime type for the plugin object exported as default. */
export type GithubActionsPlugin = typeof githubActionsPlugin;

/** Default plugin export consumed by ESLint flat config. */
export default githubActionsPlugin;
