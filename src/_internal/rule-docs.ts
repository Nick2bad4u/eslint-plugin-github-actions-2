/**
 * @packageDocumentation
 * Shared docs metadata shape carried by GitHub Actions rules.
 */
import type { Rule } from "eslint";

import type { GithubActionsConfigReference } from "./github-actions-config-references.js";

/** Custom docs metadata stored alongside each ESLint rule definition. */
export type GithubActionsRuleDocs = Rule.RuleMetaData["docs"] & {
    readonly configs?:
        | GithubActionsConfigReference
        | readonly GithubActionsConfigReference[];
    readonly recommended: boolean;
    readonly requiresTypeChecking: boolean;
    readonly ruleId: `R${number}`;
    readonly ruleNumber: number;
    readonly url: string;
};
