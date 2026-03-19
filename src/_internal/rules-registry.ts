/**
 * @packageDocumentation
 * Central rule registry for eslint-plugin-github-actions.
 */
import type { Rule } from "eslint";

import actionNameCasing from "../rules/action-name-casing.js";
import jobIdCasing from "../rules/job-id-casing.js";
import maxJobsPerAction from "../rules/max-jobs-per-action.js";
import noExternalJob from "../rules/no-external-job.js";
import noInheritSecrets from "../rules/no-inherit-secrets.js";
import noInvalidConcurrencyContext from "../rules/no-invalid-concurrency-context.js";
import noInvalidKey from "../rules/no-invalid-key.js";
import noInvalidReusableWorkflowJobKey from "../rules/no-invalid-reusable-workflow-job-key.js";
import noInvalidWorkflowCallOutputValue from "../rules/no-invalid-workflow-call-output-value.js";
import noPrHeadCheckoutInPullRequestTarget from "../rules/no-pr-head-checkout-in-pull-request-target.js";
import noSecretsInIf from "../rules/no-secrets-in-if.js";
import noSelfHostedRunnerOnForkPrEvents from "../rules/no-self-hosted-runner-on-fork-pr-events.js";
import noTopLevelEnv from "../rules/no-top-level-env.js";
import noTopLevelPermissions from "../rules/no-top-level-permissions.js";
import noUnknownJobOutputReference from "../rules/no-unknown-job-output-reference.js";
import noUnknownStepReference from "../rules/no-unknown-step-reference.js";
import noUntrustedInputInRun from "../rules/no-untrusted-input-in-run.js";
import noWriteAllPermissions from "../rules/no-write-all-permissions.js";
import pinActionShas from "../rules/pin-action-shas.js";
import preferFailFast from "../rules/prefer-fail-fast.js";
import preferFileExtension from "../rules/prefer-file-extension.js";
import preferInputsContext from "../rules/prefer-inputs-context.js";
import preferStepUsesStyle from "../rules/prefer-step-uses-style.js";
import requireActionName from "../rules/require-action-name.js";
import requireActionRunName from "../rules/require-action-run-name.js";
import requireCheckoutBeforeLocalAction from "../rules/require-checkout-before-local-action.js";
import requireJobName from "../rules/require-job-name.js";
import requireJobStepName from "../rules/require-job-step-name.js";
import requireJobTimeoutMinutes from "../rules/require-job-timeout-minutes.js";
import requireMergeGroupTrigger from "../rules/require-merge-group-trigger.js";
import requirePullRequestTargetBranches from "../rules/require-pull-request-target-branches.js";
import requireRunStepShell from "../rules/require-run-step-shell.js";
import requireTriggerTypes from "../rules/require-trigger-types.js";
import requireWorkflowCallInputType from "../rules/require-workflow-call-input-type.js";
import requireWorkflowCallOutputValue from "../rules/require-workflow-call-output-value.js";
import requireWorkflowConcurrency from "../rules/require-workflow-concurrency.js";
import requireWorkflowDispatchInputType from "../rules/require-workflow-dispatch-input-type.js";
import requireWorkflowInterfaceDescription from "../rules/require-workflow-interface-description.js";
import requireWorkflowPermissions from "../rules/require-workflow-permissions.js";
import requireWorkflowRunBranches from "../rules/require-workflow-run-branches.js";
import validTimeoutMinutes from "../rules/valid-timeout-minutes.js";
import validTriggerEvents from "../rules/valid-trigger-events.js";

/** Strongly typed plugin rule registry keyed by unqualified rule name. */
const githubActionsRulesDefinition: {
    readonly "action-name-casing": typeof actionNameCasing;
    readonly "job-id-casing": typeof jobIdCasing;
    readonly "max-jobs-per-action": typeof maxJobsPerAction;
    readonly "no-external-job": typeof noExternalJob;
    readonly "no-inherit-secrets": typeof noInheritSecrets;
    readonly "no-invalid-concurrency-context": typeof noInvalidConcurrencyContext;
    readonly "no-invalid-key": typeof noInvalidKey;
    readonly "no-invalid-reusable-workflow-job-key": typeof noInvalidReusableWorkflowJobKey;
    readonly "no-invalid-workflow-call-output-value": typeof noInvalidWorkflowCallOutputValue;
    readonly "no-pr-head-checkout-in-pull-request-target": typeof noPrHeadCheckoutInPullRequestTarget;
    readonly "no-secrets-in-if": typeof noSecretsInIf;
    readonly "no-self-hosted-runner-on-fork-pr-events": typeof noSelfHostedRunnerOnForkPrEvents;
    readonly "no-top-level-env": typeof noTopLevelEnv;
    readonly "no-top-level-permissions": typeof noTopLevelPermissions;
    readonly "no-unknown-job-output-reference": typeof noUnknownJobOutputReference;
    readonly "no-unknown-step-reference": typeof noUnknownStepReference;
    readonly "no-untrusted-input-in-run": typeof noUntrustedInputInRun;
    readonly "no-write-all-permissions": typeof noWriteAllPermissions;
    readonly "pin-action-shas": typeof pinActionShas;
    readonly "prefer-fail-fast": typeof preferFailFast;
    readonly "prefer-file-extension": typeof preferFileExtension;
    readonly "prefer-inputs-context": typeof preferInputsContext;
    readonly "prefer-step-uses-style": typeof preferStepUsesStyle;
    readonly "require-action-name": typeof requireActionName;
    readonly "require-action-run-name": typeof requireActionRunName;
    readonly "require-checkout-before-local-action": typeof requireCheckoutBeforeLocalAction;
    readonly "require-job-name": typeof requireJobName;
    readonly "require-job-step-name": typeof requireJobStepName;
    readonly "require-job-timeout-minutes": typeof requireJobTimeoutMinutes;
    readonly "require-merge-group-trigger": typeof requireMergeGroupTrigger;
    readonly "require-pull-request-target-branches": typeof requirePullRequestTargetBranches;
    readonly "require-run-step-shell": typeof requireRunStepShell;
    readonly "require-trigger-types": typeof requireTriggerTypes;
    readonly "require-workflow-call-input-type": typeof requireWorkflowCallInputType;
    readonly "require-workflow-call-output-value": typeof requireWorkflowCallOutputValue;
    readonly "require-workflow-concurrency": typeof requireWorkflowConcurrency;
    readonly "require-workflow-dispatch-input-type": typeof requireWorkflowDispatchInputType;
    readonly "require-workflow-interface-description": typeof requireWorkflowInterfaceDescription;
    readonly "require-workflow-permissions": typeof requireWorkflowPermissions;
    readonly "require-workflow-run-branches": typeof requireWorkflowRunBranches;
    readonly "valid-timeout-minutes": typeof validTimeoutMinutes;
    readonly "valid-trigger-events": typeof validTriggerEvents;
} = {
    "action-name-casing": actionNameCasing,
    "job-id-casing": jobIdCasing,
    "max-jobs-per-action": maxJobsPerAction,
    "no-external-job": noExternalJob,
    "no-inherit-secrets": noInheritSecrets,
    "no-invalid-concurrency-context": noInvalidConcurrencyContext,
    "no-invalid-key": noInvalidKey,
    "no-invalid-reusable-workflow-job-key": noInvalidReusableWorkflowJobKey,
    "no-invalid-workflow-call-output-value": noInvalidWorkflowCallOutputValue,
    "no-pr-head-checkout-in-pull-request-target":
        noPrHeadCheckoutInPullRequestTarget,
    "no-secrets-in-if": noSecretsInIf,
    "no-self-hosted-runner-on-fork-pr-events": noSelfHostedRunnerOnForkPrEvents,
    "no-top-level-env": noTopLevelEnv,
    "no-top-level-permissions": noTopLevelPermissions,
    "no-unknown-job-output-reference": noUnknownJobOutputReference,
    "no-unknown-step-reference": noUnknownStepReference,
    "no-untrusted-input-in-run": noUntrustedInputInRun,
    "no-write-all-permissions": noWriteAllPermissions,
    "pin-action-shas": pinActionShas,
    "prefer-fail-fast": preferFailFast,
    "prefer-file-extension": preferFileExtension,
    "prefer-inputs-context": preferInputsContext,
    "prefer-step-uses-style": preferStepUsesStyle,
    "require-action-name": requireActionName,
    "require-action-run-name": requireActionRunName,
    "require-checkout-before-local-action": requireCheckoutBeforeLocalAction,
    "require-job-name": requireJobName,
    "require-job-step-name": requireJobStepName,
    "require-job-timeout-minutes": requireJobTimeoutMinutes,
    "require-merge-group-trigger": requireMergeGroupTrigger,
    "require-pull-request-target-branches": requirePullRequestTargetBranches,
    "require-run-step-shell": requireRunStepShell,
    "require-trigger-types": requireTriggerTypes,
    "require-workflow-call-input-type": requireWorkflowCallInputType,
    "require-workflow-call-output-value": requireWorkflowCallOutputValue,
    "require-workflow-concurrency": requireWorkflowConcurrency,
    "require-workflow-dispatch-input-type": requireWorkflowDispatchInputType,
    "require-workflow-interface-description":
        requireWorkflowInterfaceDescription,
    "require-workflow-permissions": requireWorkflowPermissions,
    "require-workflow-run-branches": requireWorkflowRunBranches,
    "valid-timeout-minutes": validTimeoutMinutes,
    "valid-trigger-events": validTriggerEvents,
} satisfies Record<string, Rule.RuleModule>;

/** Strongly typed plugin rule registry keyed by unqualified rule name. */
export const githubActionsRules: typeof githubActionsRulesDefinition =
    githubActionsRulesDefinition;
