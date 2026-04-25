/**
 * @packageDocumentation
 * Central rule registry for eslint-plugin-github-actions-2.
 */
import type { Rule } from "eslint";

import actionNameCasing from "../rules/action-name-casing.js";
import jobIdCasing from "../rules/job-id-casing.js";
import maxJobsPerAction from "../rules/max-jobs-per-action.js";
import noCaseInsensitiveInputIdCollision from "../rules/no-case-insensitive-input-id-collision.js";
import noCodeqlAutobuildForJavaScriptTypeScript from "../rules/no-codeql-autobuild-for-javascript-typescript.js";
import noCodeqlJavascriptTypeScriptSplitLanguageMatrix from "../rules/no-codeql-javascript-typescript-split-language-matrix.js";
import noCompositeInputEnvAccess from "../rules/no-composite-input-env-access.js";
import noDeprecatedNodeRuntime from "../rules/no-deprecated-node-runtime.js";
import noDuplicateCompositeStepId from "../rules/no-duplicate-composite-step-id.js";
import noEmptyTemplateFilePattern from "../rules/no-empty-template-file-pattern.js";
import noExternalJob from "../rules/no-external-job.js";
import noHardcodedDefaultBranchInTemplate from "../rules/no-hardcoded-default-branch-in-template.js";
import noIconFileExtensionInTemplateIconName from "../rules/no-icon-file-extension-in-template-icon-name.js";
import noInheritSecrets from "../rules/no-inherit-secrets.js";
import noInvalidConcurrencyContext from "../rules/no-invalid-concurrency-context.js";
import noInvalidKey from "../rules/no-invalid-key.js";
import noInvalidReusableWorkflowJobKey from "../rules/no-invalid-reusable-workflow-job-key.js";
import noInvalidTemplateFilePatternRegex from "../rules/no-invalid-template-file-pattern-regex.js";
import noInvalidWorkflowCallOutputValue from "../rules/no-invalid-workflow-call-output-value.js";
import noOverlappingDependabotDirectories from "../rules/no-overlapping-dependabot-directories.js";
import noPathSeparatorsInTemplateIconName from "../rules/no-path-separators-in-template-icon-name.js";
import noPostIfWithoutPost from "../rules/no-post-if-without-post.js";
import noPrHeadCheckoutInPullRequestTarget from "../rules/no-pr-head-checkout-in-pull-request-target.js";
import noPreIfWithoutPre from "../rules/no-pre-if-without-pre.js";
import noRequiredInputWithDefault from "../rules/no-required-input-with-default.js";
import noSecretsInIf from "../rules/no-secrets-in-if.js";
import noSelfHostedRunnerOnForkPrEvents from "../rules/no-self-hosted-runner-on-fork-pr-events.js";
import noSubdirectoryTemplateFilePattern from "../rules/no-subdirectory-template-file-pattern.js";
import noTemplatePlaceholderInNonTemplateWorkflow from "../rules/no-template-placeholder-in-non-template-workflow.js";
import noTopLevelEnv from "../rules/no-top-level-env.js";
import noTopLevelPermissions from "../rules/no-top-level-permissions.js";
import noUniversalTemplateFilePattern from "../rules/no-universal-template-file-pattern.js";
import noUnknownDependabotMultiEcosystemGroup from "../rules/no-unknown-dependabot-multi-ecosystem-group.js";
import noUnknownInputReferenceInComposite from "../rules/no-unknown-input-reference-in-composite.js";
import noUnknownJobOutputReference from "../rules/no-unknown-job-output-reference.js";
import noUnknownStepReference from "../rules/no-unknown-step-reference.js";
import noUntrustedInputInRun from "../rules/no-untrusted-input-in-run.js";
import noUnusedDependabotEnableBetaEcosystems from "../rules/no-unused-dependabot-enable-beta-ecosystems.js";
import noUnusedInputInComposite from "../rules/no-unused-input-in-composite.js";
import noWriteAllPermissions from "../rules/no-write-all-permissions.js";
import pinActionShas from "../rules/pin-action-shas.js";
import preferActionYml from "../rules/prefer-action-yml.js";
import preferFailFast from "../rules/prefer-fail-fast.js";
import preferFileExtension from "../rules/prefer-file-extension.js";
import preferInputsContext from "../rules/prefer-inputs-context.js";
import preferStepUsesStyle from "../rules/prefer-step-uses-style.js";
import preferTemplateYmlExtension from "../rules/prefer-template-yml-extension.js";
import requireActionName from "../rules/require-action-name.js";
import requireActionRunName from "../rules/require-action-run-name.js";
import requireCheckoutBeforeLocalAction from "../rules/require-checkout-before-local-action.js";
import requireCodeqlActionsRead from "../rules/require-codeql-actions-read.js";
import requireCodeqlBranchFilters from "../rules/require-codeql-branch-filters.js";
import requireCodeqlCategoryWhenLanguageMatrix from "../rules/require-codeql-category-when-language-matrix.js";
import requireCodeqlPullRequestTrigger from "../rules/require-codeql-pull-request-trigger.js";
import requireCodeqlSchedule from "../rules/require-codeql-schedule.js";
import requireCodeqlSecurityEventsWrite from "../rules/require-codeql-security-events-write.js";
import requireCompositeStepName from "../rules/require-composite-step-name.js";
import requireDependabotAssignees from "../rules/require-dependabot-assignees.js";
import requireDependabotAutomationPermissions from "../rules/require-dependabot-automation-permissions.js";
import requireDependabotAutomationPullRequestTrigger from "../rules/require-dependabot-automation-pull-request-trigger.js";
import requireDependabotBotActorGuard from "../rules/require-dependabot-bot-actor-guard.js";
import requireDependabotCommitMessageIncludeScope from "../rules/require-dependabot-commit-message-include-scope.js";
import requireDependabotCommitMessagePrefixDevelopment from "../rules/require-dependabot-commit-message-prefix-development.js";
import requireDependabotCommitMessagePrefix from "../rules/require-dependabot-commit-message-prefix.js";
import requireDependabotCooldown from "../rules/require-dependabot-cooldown.js";
import requireDependabotDirectory from "../rules/require-dependabot-directory.js";
import requireDependabotGithubActionsDirectoryRoot from "../rules/require-dependabot-github-actions-directory-root.js";
import requireDependabotLabels from "../rules/require-dependabot-labels.js";
import requireDependabotOpenPullRequestsLimit from "../rules/require-dependabot-open-pull-requests-limit.js";
import requireDependabotPackageEcosystem from "../rules/require-dependabot-package-ecosystem.js";
import requireDependabotPatternsForMultiEcosystemGroup from "../rules/require-dependabot-patterns-for-multi-ecosystem-group.js";
import requireDependabotScheduleCronjob from "../rules/require-dependabot-schedule-cronjob.js";
import requireDependabotScheduleInterval from "../rules/require-dependabot-schedule-interval.js";
import requireDependabotScheduleTime from "../rules/require-dependabot-schedule-time.js";
import requireDependabotScheduleTimezone from "../rules/require-dependabot-schedule-timezone.js";
import requireDependabotTargetBranch from "../rules/require-dependabot-target-branch.js";
import requireDependabotUpdates from "../rules/require-dependabot-updates.js";
import requireDependabotVersion from "../rules/require-dependabot-version.js";
import requireDependabotVersioningStrategyForNpm from "../rules/require-dependabot-versioning-strategy-for-npm.js";
import requireDependencyReviewAction from "../rules/require-dependency-review-action.js";
import requireDependencyReviewFailOnSeverity from "../rules/require-dependency-review-fail-on-severity.js";
import requireDependencyReviewPermissionsContentsRead from "../rules/require-dependency-review-permissions-contents-read.js";
import requireDependencyReviewPullRequestTrigger from "../rules/require-dependency-review-pull-request-trigger.js";
import requireFetchMetadataGithubToken from "../rules/require-fetch-metadata-github-token.js";
import requireJobName from "../rules/require-job-name.js";
import requireJobStepName from "../rules/require-job-step-name.js";
import requireJobTimeoutMinutes from "../rules/require-job-timeout-minutes.js";
import requireMergeGroupTrigger from "../rules/require-merge-group-trigger.js";
import requirePullRequestTargetBranches from "../rules/require-pull-request-target-branches.js";
import requireRunStepShell from "../rules/require-run-step-shell.js";
import requireRunStepTimeout from "../rules/require-run-step-timeout.js";
import requireSarifUploadSecurityEventsWrite from "../rules/require-sarif-upload-security-events-write.js";
import requireScorecardResultsFormatSarif from "../rules/require-scorecard-results-format-sarif.js";
import requireScorecardUploadSarifStep from "../rules/require-scorecard-upload-sarif-step.js";
import requireSecretScanContentsRead from "../rules/require-secret-scan-contents-read.js";
import requireSecretScanFetchDepthZero from "../rules/require-secret-scan-fetch-depth-zero.js";
import requireSecretScanSchedule from "../rules/require-secret-scan-schedule.js";
import requireTemplateCategories from "../rules/require-template-categories.js";
import requireTemplateFilePatterns from "../rules/require-template-file-patterns.js";
import requireTemplateIconFileExists from "../rules/require-template-icon-file-exists.js";
import requireTemplateIconName from "../rules/require-template-icon-name.js";
import requireTemplateWorkflowName from "../rules/require-template-workflow-name.js";
import requireTriggerTypes from "../rules/require-trigger-types.js";
import requireTrufflehogVerifiedResultsMode from "../rules/require-trufflehog-verified-results-mode.js";
import requireWorkflowCallInputType from "../rules/require-workflow-call-input-type.js";
import requireWorkflowCallOutputValue from "../rules/require-workflow-call-output-value.js";
import requireWorkflowConcurrency from "../rules/require-workflow-concurrency.js";
import requireWorkflowDispatchInputType from "../rules/require-workflow-dispatch-input-type.js";
import requireWorkflowInterfaceDescription from "../rules/require-workflow-interface-description.js";
import requireWorkflowPermissions from "../rules/require-workflow-permissions.js";
import requireWorkflowRunBranches from "../rules/require-workflow-run-branches.js";
import requireWorkflowTemplatePair from "../rules/require-workflow-template-pair.js";
import requireWorkflowTemplatePropertiesPair from "../rules/require-workflow-template-properties-pair.js";
import validTimeoutMinutes from "../rules/valid-timeout-minutes.js";
import validTriggerEvents from "../rules/valid-trigger-events.js";

/** Strongly typed plugin rule registry keyed by unqualified rule name. */
const githubActionsRulesDefinition: {
    readonly "action-name-casing": typeof actionNameCasing;
    readonly "job-id-casing": typeof jobIdCasing;
    readonly "max-jobs-per-action": typeof maxJobsPerAction;
    readonly "no-case-insensitive-input-id-collision": typeof noCaseInsensitiveInputIdCollision;
    readonly "no-codeql-autobuild-for-javascript-typescript": typeof noCodeqlAutobuildForJavaScriptTypeScript;
    readonly "no-codeql-javascript-typescript-split-language-matrix": typeof noCodeqlJavascriptTypeScriptSplitLanguageMatrix;
    readonly "no-composite-input-env-access": typeof noCompositeInputEnvAccess;
    readonly "no-deprecated-node-runtime": typeof noDeprecatedNodeRuntime;
    readonly "no-duplicate-composite-step-id": typeof noDuplicateCompositeStepId;
    readonly "no-empty-template-file-pattern": typeof noEmptyTemplateFilePattern;
    readonly "no-external-job": typeof noExternalJob;
    readonly "no-hardcoded-default-branch-in-template": typeof noHardcodedDefaultBranchInTemplate;
    readonly "no-icon-file-extension-in-template-icon-name": typeof noIconFileExtensionInTemplateIconName;
    readonly "no-inherit-secrets": typeof noInheritSecrets;
    readonly "no-invalid-concurrency-context": typeof noInvalidConcurrencyContext;
    readonly "no-invalid-key": typeof noInvalidKey;
    readonly "no-invalid-reusable-workflow-job-key": typeof noInvalidReusableWorkflowJobKey;
    readonly "no-invalid-template-file-pattern-regex": typeof noInvalidTemplateFilePatternRegex;
    readonly "no-invalid-workflow-call-output-value": typeof noInvalidWorkflowCallOutputValue;
    readonly "no-overlapping-dependabot-directories": typeof noOverlappingDependabotDirectories;
    readonly "no-path-separators-in-template-icon-name": typeof noPathSeparatorsInTemplateIconName;
    readonly "no-post-if-without-post": typeof noPostIfWithoutPost;
    readonly "no-pr-head-checkout-in-pull-request-target": typeof noPrHeadCheckoutInPullRequestTarget;
    readonly "no-pre-if-without-pre": typeof noPreIfWithoutPre;
    readonly "no-required-input-with-default": typeof noRequiredInputWithDefault;
    readonly "no-secrets-in-if": typeof noSecretsInIf;
    readonly "no-self-hosted-runner-on-fork-pr-events": typeof noSelfHostedRunnerOnForkPrEvents;
    readonly "no-subdirectory-template-file-pattern": typeof noSubdirectoryTemplateFilePattern;
    readonly "no-template-placeholder-in-non-template-workflow": typeof noTemplatePlaceholderInNonTemplateWorkflow;
    readonly "no-top-level-env": typeof noTopLevelEnv;
    readonly "no-top-level-permissions": typeof noTopLevelPermissions;
    readonly "no-universal-template-file-pattern": typeof noUniversalTemplateFilePattern;
    readonly "no-unknown-dependabot-multi-ecosystem-group": typeof noUnknownDependabotMultiEcosystemGroup;
    readonly "no-unknown-input-reference-in-composite": typeof noUnknownInputReferenceInComposite;
    readonly "no-unknown-job-output-reference": typeof noUnknownJobOutputReference;
    readonly "no-unknown-step-reference": typeof noUnknownStepReference;
    readonly "no-untrusted-input-in-run": typeof noUntrustedInputInRun;
    readonly "no-unused-dependabot-enable-beta-ecosystems": typeof noUnusedDependabotEnableBetaEcosystems;
    readonly "no-unused-input-in-composite": typeof noUnusedInputInComposite;
    readonly "no-write-all-permissions": typeof noWriteAllPermissions;
    readonly "pin-action-shas": typeof pinActionShas;
    readonly "prefer-action-yml": typeof preferActionYml;
    readonly "prefer-fail-fast": typeof preferFailFast;
    readonly "prefer-file-extension": typeof preferFileExtension;
    readonly "prefer-inputs-context": typeof preferInputsContext;
    readonly "prefer-step-uses-style": typeof preferStepUsesStyle;
    readonly "prefer-template-yml-extension": typeof preferTemplateYmlExtension;
    readonly "require-action-name": typeof requireActionName;
    readonly "require-action-run-name": typeof requireActionRunName;
    readonly "require-checkout-before-local-action": typeof requireCheckoutBeforeLocalAction;
    readonly "require-codeql-actions-read": typeof requireCodeqlActionsRead;
    readonly "require-codeql-branch-filters": typeof requireCodeqlBranchFilters;
    readonly "require-codeql-category-when-language-matrix": typeof requireCodeqlCategoryWhenLanguageMatrix;
    readonly "require-codeql-pull-request-trigger": typeof requireCodeqlPullRequestTrigger;
    readonly "require-codeql-schedule": typeof requireCodeqlSchedule;
    readonly "require-codeql-security-events-write": typeof requireCodeqlSecurityEventsWrite;
    readonly "require-composite-step-name": typeof requireCompositeStepName;
    readonly "require-dependabot-assignees": typeof requireDependabotAssignees;
    readonly "require-dependabot-automation-permissions": typeof requireDependabotAutomationPermissions;
    readonly "require-dependabot-automation-pull-request-trigger": typeof requireDependabotAutomationPullRequestTrigger;
    readonly "require-dependabot-bot-actor-guard": typeof requireDependabotBotActorGuard;
    readonly "require-dependabot-commit-message-include-scope": typeof requireDependabotCommitMessageIncludeScope;
    readonly "require-dependabot-commit-message-prefix": typeof requireDependabotCommitMessagePrefix;
    readonly "require-dependabot-commit-message-prefix-development": typeof requireDependabotCommitMessagePrefixDevelopment;
    readonly "require-dependabot-cooldown": typeof requireDependabotCooldown;
    readonly "require-dependabot-directory": typeof requireDependabotDirectory;
    readonly "require-dependabot-github-actions-directory-root": typeof requireDependabotGithubActionsDirectoryRoot;
    readonly "require-dependabot-labels": typeof requireDependabotLabels;
    readonly "require-dependabot-open-pull-requests-limit": typeof requireDependabotOpenPullRequestsLimit;
    readonly "require-dependabot-package-ecosystem": typeof requireDependabotPackageEcosystem;
    readonly "require-dependabot-patterns-for-multi-ecosystem-group": typeof requireDependabotPatternsForMultiEcosystemGroup;
    readonly "require-dependabot-schedule-cronjob": typeof requireDependabotScheduleCronjob;
    readonly "require-dependabot-schedule-interval": typeof requireDependabotScheduleInterval;
    readonly "require-dependabot-schedule-time": typeof requireDependabotScheduleTime;
    readonly "require-dependabot-schedule-timezone": typeof requireDependabotScheduleTimezone;
    readonly "require-dependabot-target-branch": typeof requireDependabotTargetBranch;
    readonly "require-dependabot-updates": typeof requireDependabotUpdates;
    readonly "require-dependabot-version": typeof requireDependabotVersion;
    readonly "require-dependabot-versioning-strategy-for-npm": typeof requireDependabotVersioningStrategyForNpm;
    readonly "require-dependency-review-action": typeof requireDependencyReviewAction;
    readonly "require-dependency-review-fail-on-severity": typeof requireDependencyReviewFailOnSeverity;
    readonly "require-dependency-review-permissions-contents-read": typeof requireDependencyReviewPermissionsContentsRead;
    readonly "require-dependency-review-pull-request-trigger": typeof requireDependencyReviewPullRequestTrigger;
    readonly "require-fetch-metadata-github-token": typeof requireFetchMetadataGithubToken;
    readonly "require-job-name": typeof requireJobName;
    readonly "require-job-step-name": typeof requireJobStepName;
    readonly "require-job-timeout-minutes": typeof requireJobTimeoutMinutes;
    readonly "require-merge-group-trigger": typeof requireMergeGroupTrigger;
    readonly "require-pull-request-target-branches": typeof requirePullRequestTargetBranches;
    readonly "require-run-step-shell": typeof requireRunStepShell;
    readonly "require-run-step-timeout": typeof requireRunStepTimeout;
    readonly "require-sarif-upload-security-events-write": typeof requireSarifUploadSecurityEventsWrite;
    readonly "require-scorecard-results-format-sarif": typeof requireScorecardResultsFormatSarif;
    readonly "require-scorecard-upload-sarif-step": typeof requireScorecardUploadSarifStep;
    readonly "require-secret-scan-contents-read": typeof requireSecretScanContentsRead;
    readonly "require-secret-scan-fetch-depth-zero": typeof requireSecretScanFetchDepthZero;
    readonly "require-secret-scan-schedule": typeof requireSecretScanSchedule;
    readonly "require-template-categories": typeof requireTemplateCategories;
    readonly "require-template-file-patterns": typeof requireTemplateFilePatterns;
    readonly "require-template-icon-file-exists": typeof requireTemplateIconFileExists;
    readonly "require-template-icon-name": typeof requireTemplateIconName;
    readonly "require-template-workflow-name": typeof requireTemplateWorkflowName;
    readonly "require-trigger-types": typeof requireTriggerTypes;
    readonly "require-trufflehog-verified-results-mode": typeof requireTrufflehogVerifiedResultsMode;
    readonly "require-workflow-call-input-type": typeof requireWorkflowCallInputType;
    readonly "require-workflow-call-output-value": typeof requireWorkflowCallOutputValue;
    readonly "require-workflow-concurrency": typeof requireWorkflowConcurrency;
    readonly "require-workflow-dispatch-input-type": typeof requireWorkflowDispatchInputType;
    readonly "require-workflow-interface-description": typeof requireWorkflowInterfaceDescription;
    readonly "require-workflow-permissions": typeof requireWorkflowPermissions;
    readonly "require-workflow-run-branches": typeof requireWorkflowRunBranches;
    readonly "require-workflow-template-pair": typeof requireWorkflowTemplatePair;
    readonly "require-workflow-template-properties-pair": typeof requireWorkflowTemplatePropertiesPair;
    readonly "valid-timeout-minutes": typeof validTimeoutMinutes;
    readonly "valid-trigger-events": typeof validTriggerEvents;
} = {
    "action-name-casing": actionNameCasing,
    "job-id-casing": jobIdCasing,
    "max-jobs-per-action": maxJobsPerAction,
    "no-case-insensitive-input-id-collision": noCaseInsensitiveInputIdCollision,
    "no-codeql-autobuild-for-javascript-typescript":
        noCodeqlAutobuildForJavaScriptTypeScript,
    "no-codeql-javascript-typescript-split-language-matrix":
        noCodeqlJavascriptTypeScriptSplitLanguageMatrix,
    "no-composite-input-env-access": noCompositeInputEnvAccess,
    "no-deprecated-node-runtime": noDeprecatedNodeRuntime,
    "no-duplicate-composite-step-id": noDuplicateCompositeStepId,
    "no-empty-template-file-pattern": noEmptyTemplateFilePattern,
    "no-external-job": noExternalJob,
    "no-hardcoded-default-branch-in-template":
        noHardcodedDefaultBranchInTemplate,
    "no-icon-file-extension-in-template-icon-name":
        noIconFileExtensionInTemplateIconName,
    "no-inherit-secrets": noInheritSecrets,
    "no-invalid-concurrency-context": noInvalidConcurrencyContext,
    "no-invalid-key": noInvalidKey,
    "no-invalid-reusable-workflow-job-key": noInvalidReusableWorkflowJobKey,
    "no-invalid-template-file-pattern-regex": noInvalidTemplateFilePatternRegex,
    "no-invalid-workflow-call-output-value": noInvalidWorkflowCallOutputValue,
    "no-overlapping-dependabot-directories": noOverlappingDependabotDirectories,
    "no-path-separators-in-template-icon-name":
        noPathSeparatorsInTemplateIconName,
    "no-post-if-without-post": noPostIfWithoutPost,
    "no-pr-head-checkout-in-pull-request-target":
        noPrHeadCheckoutInPullRequestTarget,
    "no-pre-if-without-pre": noPreIfWithoutPre,
    "no-required-input-with-default": noRequiredInputWithDefault,
    "no-secrets-in-if": noSecretsInIf,
    "no-self-hosted-runner-on-fork-pr-events": noSelfHostedRunnerOnForkPrEvents,
    "no-subdirectory-template-file-pattern": noSubdirectoryTemplateFilePattern,
    "no-template-placeholder-in-non-template-workflow":
        noTemplatePlaceholderInNonTemplateWorkflow,
    "no-top-level-env": noTopLevelEnv,
    "no-top-level-permissions": noTopLevelPermissions,
    "no-universal-template-file-pattern": noUniversalTemplateFilePattern,
    "no-unknown-dependabot-multi-ecosystem-group":
        noUnknownDependabotMultiEcosystemGroup,
    "no-unknown-input-reference-in-composite":
        noUnknownInputReferenceInComposite,
    "no-unknown-job-output-reference": noUnknownJobOutputReference,
    "no-unknown-step-reference": noUnknownStepReference,
    "no-untrusted-input-in-run": noUntrustedInputInRun,
    "no-unused-dependabot-enable-beta-ecosystems":
        noUnusedDependabotEnableBetaEcosystems,
    "no-unused-input-in-composite": noUnusedInputInComposite,
    "no-write-all-permissions": noWriteAllPermissions,
    "pin-action-shas": pinActionShas,
    "prefer-action-yml": preferActionYml,
    "prefer-fail-fast": preferFailFast,
    "prefer-file-extension": preferFileExtension,
    "prefer-inputs-context": preferInputsContext,
    "prefer-step-uses-style": preferStepUsesStyle,
    "prefer-template-yml-extension": preferTemplateYmlExtension,
    "require-action-name": requireActionName,
    "require-action-run-name": requireActionRunName,
    "require-checkout-before-local-action": requireCheckoutBeforeLocalAction,
    "require-codeql-actions-read": requireCodeqlActionsRead,
    "require-codeql-branch-filters": requireCodeqlBranchFilters,
    "require-codeql-category-when-language-matrix":
        requireCodeqlCategoryWhenLanguageMatrix,
    "require-codeql-pull-request-trigger": requireCodeqlPullRequestTrigger,
    "require-codeql-schedule": requireCodeqlSchedule,
    "require-codeql-security-events-write": requireCodeqlSecurityEventsWrite,
    "require-composite-step-name": requireCompositeStepName,
    "require-dependabot-assignees": requireDependabotAssignees,
    "require-dependabot-automation-permissions":
        requireDependabotAutomationPermissions,
    "require-dependabot-automation-pull-request-trigger":
        requireDependabotAutomationPullRequestTrigger,
    "require-dependabot-bot-actor-guard": requireDependabotBotActorGuard,
    "require-dependabot-commit-message-include-scope":
        requireDependabotCommitMessageIncludeScope,
    "require-dependabot-commit-message-prefix":
        requireDependabotCommitMessagePrefix,
    "require-dependabot-commit-message-prefix-development":
        requireDependabotCommitMessagePrefixDevelopment,
    "require-dependabot-cooldown": requireDependabotCooldown,
    "require-dependabot-directory": requireDependabotDirectory,
    "require-dependabot-github-actions-directory-root":
        requireDependabotGithubActionsDirectoryRoot,
    "require-dependabot-labels": requireDependabotLabels,
    "require-dependabot-open-pull-requests-limit":
        requireDependabotOpenPullRequestsLimit,
    "require-dependabot-package-ecosystem": requireDependabotPackageEcosystem,
    "require-dependabot-patterns-for-multi-ecosystem-group":
        requireDependabotPatternsForMultiEcosystemGroup,
    "require-dependabot-schedule-cronjob": requireDependabotScheduleCronjob,
    "require-dependabot-schedule-interval": requireDependabotScheduleInterval,
    "require-dependabot-schedule-time": requireDependabotScheduleTime,
    "require-dependabot-schedule-timezone": requireDependabotScheduleTimezone,
    "require-dependabot-target-branch": requireDependabotTargetBranch,
    "require-dependabot-updates": requireDependabotUpdates,
    "require-dependabot-version": requireDependabotVersion,
    "require-dependabot-versioning-strategy-for-npm":
        requireDependabotVersioningStrategyForNpm,
    "require-dependency-review-action": requireDependencyReviewAction,
    "require-dependency-review-fail-on-severity":
        requireDependencyReviewFailOnSeverity,
    "require-dependency-review-permissions-contents-read":
        requireDependencyReviewPermissionsContentsRead,
    "require-dependency-review-pull-request-trigger":
        requireDependencyReviewPullRequestTrigger,
    "require-fetch-metadata-github-token": requireFetchMetadataGithubToken,
    "require-job-name": requireJobName,
    "require-job-step-name": requireJobStepName,
    "require-job-timeout-minutes": requireJobTimeoutMinutes,
    "require-merge-group-trigger": requireMergeGroupTrigger,
    "require-pull-request-target-branches": requirePullRequestTargetBranches,
    "require-run-step-shell": requireRunStepShell,
    "require-run-step-timeout": requireRunStepTimeout,
    "require-sarif-upload-security-events-write":
        requireSarifUploadSecurityEventsWrite,
    "require-scorecard-results-format-sarif":
        requireScorecardResultsFormatSarif,
    "require-scorecard-upload-sarif-step": requireScorecardUploadSarifStep,
    "require-secret-scan-contents-read": requireSecretScanContentsRead,
    "require-secret-scan-fetch-depth-zero": requireSecretScanFetchDepthZero,
    "require-secret-scan-schedule": requireSecretScanSchedule,
    "require-template-categories": requireTemplateCategories,
    "require-template-file-patterns": requireTemplateFilePatterns,
    "require-template-icon-file-exists": requireTemplateIconFileExists,
    "require-template-icon-name": requireTemplateIconName,
    "require-template-workflow-name": requireTemplateWorkflowName,
    "require-trigger-types": requireTriggerTypes,
    "require-trufflehog-verified-results-mode":
        requireTrufflehogVerifiedResultsMode,
    "require-workflow-call-input-type": requireWorkflowCallInputType,
    "require-workflow-call-output-value": requireWorkflowCallOutputValue,
    "require-workflow-concurrency": requireWorkflowConcurrency,
    "require-workflow-dispatch-input-type": requireWorkflowDispatchInputType,
    "require-workflow-interface-description":
        requireWorkflowInterfaceDescription,
    "require-workflow-permissions": requireWorkflowPermissions,
    "require-workflow-run-branches": requireWorkflowRunBranches,
    "require-workflow-template-pair": requireWorkflowTemplatePair,
    "require-workflow-template-properties-pair":
        requireWorkflowTemplatePropertiesPair,
    "valid-timeout-minutes": validTimeoutMinutes,
    "valid-trigger-events": validTriggerEvents,
} satisfies Record<string, Rule.RuleModule>;

/** Strongly typed plugin rule registry keyed by unqualified rule name. */
export const githubActionsRules: typeof githubActionsRulesDefinition =
    githubActionsRulesDefinition;
