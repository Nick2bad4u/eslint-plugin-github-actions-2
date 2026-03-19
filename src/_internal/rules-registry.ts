/**
 * @packageDocumentation
 * Central rule registry for eslint-plugin-github-actions.
 */
import type { Rule } from "eslint";

import pinActionShas from "../rules/pin-action-shas.js";
import requireJobTimeoutMinutes from "../rules/require-job-timeout-minutes.js";
import requireWorkflowConcurrency from "../rules/require-workflow-concurrency.js";
import requireWorkflowPermissions from "../rules/require-workflow-permissions.js";

/** Strongly typed plugin rule registry keyed by unqualified rule name. */
const githubActionsRulesDefinition: {
    readonly "pin-action-shas": typeof pinActionShas;
    readonly "require-job-timeout-minutes": typeof requireJobTimeoutMinutes;
    readonly "require-workflow-concurrency": typeof requireWorkflowConcurrency;
    readonly "require-workflow-permissions": typeof requireWorkflowPermissions;
} = {
    "pin-action-shas": pinActionShas,
    "require-job-timeout-minutes": requireJobTimeoutMinutes,
    "require-workflow-concurrency": requireWorkflowConcurrency,
    "require-workflow-permissions": requireWorkflowPermissions,
} satisfies Record<string, Rule.RuleModule>;

/** Strongly typed plugin rule registry keyed by unqualified rule name. */
export const githubActionsRules: typeof githubActionsRulesDefinition =
    githubActionsRulesDefinition;
