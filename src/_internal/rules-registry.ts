/**
 * @packageDocumentation
 * Central rule registry for eslint-plugin-github-actions-2.
 */
import type { Rule } from "eslint";

import * as actionNameCasingModule from "../rules/action-name-casing.js";
import * as jobIdCasingModule from "../rules/job-id-casing.js";
import * as maxJobsPerActionModule from "../rules/max-jobs-per-action.js";
import * as noCaseInsensitiveInputIdCollisionModule from "../rules/no-case-insensitive-input-id-collision.js";
import * as noCodeqlAutobuildForJavaScriptTypeScriptModule from "../rules/no-codeql-autobuild-for-javascript-typescript.js";
import * as noCodeqlJavascriptTypeScriptSplitLanguageMatrixModule from "../rules/no-codeql-javascript-typescript-split-language-matrix.js";
import * as noCompositeInputEnvAccessModule from "../rules/no-composite-input-env-access.js";
import * as noDeprecatedNodeRuntimeModule from "../rules/no-deprecated-node-runtime.js";
import * as noDuplicateCompositeStepIdModule from "../rules/no-duplicate-composite-step-id.js";
import * as noEmptyTemplateFilePatternModule from "../rules/no-empty-template-file-pattern.js";
import * as noExternalJobModule from "../rules/no-external-job.js";
import * as noHardcodedDefaultBranchInTemplateModule from "../rules/no-hardcoded-default-branch-in-template.js";
import * as noIconFileExtensionInTemplateIconNameModule from "../rules/no-icon-file-extension-in-template-icon-name.js";
import * as noInheritSecretsModule from "../rules/no-inherit-secrets.js";
import * as noInvalidConcurrencyContextModule from "../rules/no-invalid-concurrency-context.js";
import * as noInvalidKeyModule from "../rules/no-invalid-key.js";
import * as noInvalidReusableWorkflowJobKeyModule from "../rules/no-invalid-reusable-workflow-job-key.js";
import * as noInvalidTemplateFilePatternRegexModule from "../rules/no-invalid-template-file-pattern-regex.js";
import * as noInvalidWorkflowCallOutputValueModule from "../rules/no-invalid-workflow-call-output-value.js";
import * as noOverlappingDependabotDirectoriesModule from "../rules/no-overlapping-dependabot-directories.js";
import * as noPathSeparatorsInTemplateIconNameModule from "../rules/no-path-separators-in-template-icon-name.js";
import * as noPostIfWithoutPostModule from "../rules/no-post-if-without-post.js";
import * as noPrHeadCheckoutInPullRequestTargetModule from "../rules/no-pr-head-checkout-in-pull-request-target.js";
import * as noPreIfWithoutPreModule from "../rules/no-pre-if-without-pre.js";
import * as noRequiredInputWithDefaultModule from "../rules/no-required-input-with-default.js";
import * as noSecretsInIfModule from "../rules/no-secrets-in-if.js";
import * as noSelfHostedRunnerOnForkPrEventsModule from "../rules/no-self-hosted-runner-on-fork-pr-events.js";
import * as noSubdirectoryTemplateFilePatternModule from "../rules/no-subdirectory-template-file-pattern.js";
import * as noTemplatePlaceholderInNonTemplateWorkflowModule from "../rules/no-template-placeholder-in-non-template-workflow.js";
import * as noTopLevelEnvModule from "../rules/no-top-level-env.js";
import * as noTopLevelPermissionsModule from "../rules/no-top-level-permissions.js";
import * as noUniversalTemplateFilePatternModule from "../rules/no-universal-template-file-pattern.js";
import * as noUnknownDependabotMultiEcosystemGroupModule from "../rules/no-unknown-dependabot-multi-ecosystem-group.js";
import * as noUnknownInputReferenceInCompositeModule from "../rules/no-unknown-input-reference-in-composite.js";
import * as noUnknownJobOutputReferenceModule from "../rules/no-unknown-job-output-reference.js";
import * as noUnknownStepReferenceModule from "../rules/no-unknown-step-reference.js";
import * as noUntrustedInputInRunModule from "../rules/no-untrusted-input-in-run.js";
import * as noUnusedDependabotEnableBetaEcosystemsModule from "../rules/no-unused-dependabot-enable-beta-ecosystems.js";
import * as noUnusedInputInCompositeModule from "../rules/no-unused-input-in-composite.js";
import * as noWriteAllPermissionsModule from "../rules/no-write-all-permissions.js";
import * as pinActionShasModule from "../rules/pin-action-shas.js";
import * as preferActionYmlModule from "../rules/prefer-action-yml.js";
import * as preferFailFastModule from "../rules/prefer-fail-fast.js";
import * as preferFileExtensionModule from "../rules/prefer-file-extension.js";
import * as preferInputsContextModule from "../rules/prefer-inputs-context.js";
import * as preferStepUsesStyleModule from "../rules/prefer-step-uses-style.js";
import * as preferTemplateYmlExtensionModule from "../rules/prefer-template-yml-extension.js";
import * as requireActionNameModule from "../rules/require-action-name.js";
import * as requireActionRunNameModule from "../rules/require-action-run-name.js";
import * as requireCheckoutBeforeLocalActionModule from "../rules/require-checkout-before-local-action.js";
import * as requireCodeqlActionsReadModule from "../rules/require-codeql-actions-read.js";
import * as requireCodeqlBranchFiltersModule from "../rules/require-codeql-branch-filters.js";
import * as requireCodeqlCategoryWhenLanguageMatrixModule from "../rules/require-codeql-category-when-language-matrix.js";
import * as requireCodeqlPullRequestTriggerModule from "../rules/require-codeql-pull-request-trigger.js";
import * as requireCodeqlScheduleModule from "../rules/require-codeql-schedule.js";
import * as requireCodeqlSecurityEventsWriteModule from "../rules/require-codeql-security-events-write.js";
import * as requireCompositeStepNameModule from "../rules/require-composite-step-name.js";
import * as requireDependabotAssigneesModule from "../rules/require-dependabot-assignees.js";
import * as requireDependabotAutomationPermissionsModule from "../rules/require-dependabot-automation-permissions.js";
import * as requireDependabotAutomationPullRequestTriggerModule from "../rules/require-dependabot-automation-pull-request-trigger.js";
import * as requireDependabotBotActorGuardModule from "../rules/require-dependabot-bot-actor-guard.js";
import * as requireDependabotCommitMessageIncludeScopeModule from "../rules/require-dependabot-commit-message-include-scope.js";
import * as requireDependabotCommitMessagePrefixDevelopmentModule from "../rules/require-dependabot-commit-message-prefix-development.js";
import * as requireDependabotCommitMessagePrefixModule from "../rules/require-dependabot-commit-message-prefix.js";
import * as requireDependabotCooldownModule from "../rules/require-dependabot-cooldown.js";
import * as requireDependabotDirectoryModule from "../rules/require-dependabot-directory.js";
import * as requireDependabotGithubActionsDirectoryRootModule from "../rules/require-dependabot-github-actions-directory-root.js";
import * as requireDependabotLabelsModule from "../rules/require-dependabot-labels.js";
import * as requireDependabotOpenPullRequestsLimitModule from "../rules/require-dependabot-open-pull-requests-limit.js";
import * as requireDependabotPackageEcosystemModule from "../rules/require-dependabot-package-ecosystem.js";
import * as requireDependabotPatternsForMultiEcosystemGroupModule from "../rules/require-dependabot-patterns-for-multi-ecosystem-group.js";
import * as requireDependabotScheduleCronjobModule from "../rules/require-dependabot-schedule-cronjob.js";
import * as requireDependabotScheduleIntervalModule from "../rules/require-dependabot-schedule-interval.js";
import * as requireDependabotScheduleTimeModule from "../rules/require-dependabot-schedule-time.js";
import * as requireDependabotScheduleTimezoneModule from "../rules/require-dependabot-schedule-timezone.js";
import * as requireDependabotTargetBranchModule from "../rules/require-dependabot-target-branch.js";
import * as requireDependabotUpdatesModule from "../rules/require-dependabot-updates.js";
import * as requireDependabotVersionModule from "../rules/require-dependabot-version.js";
import * as requireDependabotVersioningStrategyForNpmModule from "../rules/require-dependabot-versioning-strategy-for-npm.js";
import * as requireDependencyReviewActionModule from "../rules/require-dependency-review-action.js";
import * as requireDependencyReviewFailOnSeverityModule from "../rules/require-dependency-review-fail-on-severity.js";
import * as requireDependencyReviewPermissionsContentsReadModule from "../rules/require-dependency-review-permissions-contents-read.js";
import * as requireDependencyReviewPullRequestTriggerModule from "../rules/require-dependency-review-pull-request-trigger.js";
import * as requireFetchMetadataGithubTokenModule from "../rules/require-fetch-metadata-github-token.js";
import * as requireJobNameModule from "../rules/require-job-name.js";
import * as requireJobStepNameModule from "../rules/require-job-step-name.js";
import * as requireJobTimeoutMinutesModule from "../rules/require-job-timeout-minutes.js";
import * as requireMergeGroupTriggerModule from "../rules/require-merge-group-trigger.js";
import * as requirePullRequestTargetBranchesModule from "../rules/require-pull-request-target-branches.js";
import * as requireRunStepShellModule from "../rules/require-run-step-shell.js";
import * as requireRunStepTimeoutModule from "../rules/require-run-step-timeout.js";
import * as requireSarifUploadSecurityEventsWriteModule from "../rules/require-sarif-upload-security-events-write.js";
import * as requireScorecardResultsFormatSarifModule from "../rules/require-scorecard-results-format-sarif.js";
import * as requireScorecardUploadSarifStepModule from "../rules/require-scorecard-upload-sarif-step.js";
import * as requireSecretScanContentsReadModule from "../rules/require-secret-scan-contents-read.js";
import * as requireSecretScanFetchDepthZeroModule from "../rules/require-secret-scan-fetch-depth-zero.js";
import * as requireSecretScanScheduleModule from "../rules/require-secret-scan-schedule.js";
import * as requireTemplateCategoriesModule from "../rules/require-template-categories.js";
import * as requireTemplateFilePatternsModule from "../rules/require-template-file-patterns.js";
import * as requireTemplateIconFileExistsModule from "../rules/require-template-icon-file-exists.js";
import * as requireTemplateIconNameModule from "../rules/require-template-icon-name.js";
import * as requireTemplateWorkflowNameModule from "../rules/require-template-workflow-name.js";
import * as requireTriggerTypesModule from "../rules/require-trigger-types.js";
import * as requireTrufflehogVerifiedResultsModeModule from "../rules/require-trufflehog-verified-results-mode.js";
import * as requireWorkflowCallInputTypeModule from "../rules/require-workflow-call-input-type.js";
import * as requireWorkflowCallOutputValueModule from "../rules/require-workflow-call-output-value.js";
import * as requireWorkflowConcurrencyModule from "../rules/require-workflow-concurrency.js";
import * as requireWorkflowDispatchInputTypeModule from "../rules/require-workflow-dispatch-input-type.js";
import * as requireWorkflowInterfaceDescriptionModule from "../rules/require-workflow-interface-description.js";
import * as requireWorkflowPermissionsModule from "../rules/require-workflow-permissions.js";
import * as requireWorkflowRunBranchesModule from "../rules/require-workflow-run-branches.js";
import * as requireWorkflowTemplatePairModule from "../rules/require-workflow-template-pair.js";
import * as requireWorkflowTemplatePropertiesPairModule from "../rules/require-workflow-template-properties-pair.js";
import * as validTimeoutMinutesModule from "../rules/valid-timeout-minutes.js";
import * as validTriggerEventsModule from "../rules/valid-trigger-events.js";

const actionNameCasing: Rule.RuleModule = actionNameCasingModule.default;
const jobIdCasing: Rule.RuleModule = jobIdCasingModule.default;
const maxJobsPerAction: Rule.RuleModule = maxJobsPerActionModule.default;
const noCaseInsensitiveInputIdCollision: Rule.RuleModule =
    noCaseInsensitiveInputIdCollisionModule.default;
const noCodeqlAutobuildForJavaScriptTypeScript: Rule.RuleModule =
    noCodeqlAutobuildForJavaScriptTypeScriptModule.default;
const noCodeqlJavascriptTypeScriptSplitLanguageMatrix: Rule.RuleModule =
    noCodeqlJavascriptTypeScriptSplitLanguageMatrixModule.default;
const noCompositeInputEnvAccess: Rule.RuleModule =
    noCompositeInputEnvAccessModule.default;
const noDeprecatedNodeRuntime: Rule.RuleModule =
    noDeprecatedNodeRuntimeModule.default;
const noDuplicateCompositeStepId: Rule.RuleModule =
    noDuplicateCompositeStepIdModule.default;
const noEmptyTemplateFilePattern: Rule.RuleModule =
    noEmptyTemplateFilePatternModule.default;
const noExternalJob: Rule.RuleModule = noExternalJobModule.default;
const noHardcodedDefaultBranchInTemplate: Rule.RuleModule =
    noHardcodedDefaultBranchInTemplateModule.default;
const noIconFileExtensionInTemplateIconName: Rule.RuleModule =
    noIconFileExtensionInTemplateIconNameModule.default;
const noInheritSecrets: Rule.RuleModule = noInheritSecretsModule.default;
const noInvalidConcurrencyContext: Rule.RuleModule =
    noInvalidConcurrencyContextModule.default;
const noInvalidKey: Rule.RuleModule = noInvalidKeyModule.default;
const noInvalidReusableWorkflowJobKey: Rule.RuleModule =
    noInvalidReusableWorkflowJobKeyModule.default;
const noInvalidTemplateFilePatternRegex: Rule.RuleModule =
    noInvalidTemplateFilePatternRegexModule.default;
const noInvalidWorkflowCallOutputValue: Rule.RuleModule =
    noInvalidWorkflowCallOutputValueModule.default;
const noOverlappingDependabotDirectories: Rule.RuleModule =
    noOverlappingDependabotDirectoriesModule.default;
const noPathSeparatorsInTemplateIconName: Rule.RuleModule =
    noPathSeparatorsInTemplateIconNameModule.default;
const noPostIfWithoutPost: Rule.RuleModule = noPostIfWithoutPostModule.default;
const noPrHeadCheckoutInPullRequestTarget: Rule.RuleModule =
    noPrHeadCheckoutInPullRequestTargetModule.default;
const noPreIfWithoutPre: Rule.RuleModule = noPreIfWithoutPreModule.default;
const noRequiredInputWithDefault: Rule.RuleModule =
    noRequiredInputWithDefaultModule.default;
const noSecretsInIf: Rule.RuleModule = noSecretsInIfModule.default;
const noSelfHostedRunnerOnForkPrEvents: Rule.RuleModule =
    noSelfHostedRunnerOnForkPrEventsModule.default;
const noSubdirectoryTemplateFilePattern: Rule.RuleModule =
    noSubdirectoryTemplateFilePatternModule.default;
const noTemplatePlaceholderInNonTemplateWorkflow: Rule.RuleModule =
    noTemplatePlaceholderInNonTemplateWorkflowModule.default;
const noTopLevelEnv: Rule.RuleModule = noTopLevelEnvModule.default;
const noTopLevelPermissions: Rule.RuleModule =
    noTopLevelPermissionsModule.default;
const noUniversalTemplateFilePattern: Rule.RuleModule =
    noUniversalTemplateFilePatternModule.default;
const noUnknownDependabotMultiEcosystemGroup: Rule.RuleModule =
    noUnknownDependabotMultiEcosystemGroupModule.default;
const noUnknownInputReferenceInComposite: Rule.RuleModule =
    noUnknownInputReferenceInCompositeModule.default;
const noUnknownJobOutputReference: Rule.RuleModule =
    noUnknownJobOutputReferenceModule.default;
const noUnknownStepReference: Rule.RuleModule =
    noUnknownStepReferenceModule.default;
const noUntrustedInputInRun: Rule.RuleModule =
    noUntrustedInputInRunModule.default;
const noUnusedDependabotEnableBetaEcosystems: Rule.RuleModule =
    noUnusedDependabotEnableBetaEcosystemsModule.default;
const noUnusedInputInComposite: Rule.RuleModule =
    noUnusedInputInCompositeModule.default;
const noWriteAllPermissions: Rule.RuleModule =
    noWriteAllPermissionsModule.default;
const pinActionShas: Rule.RuleModule = pinActionShasModule.default;
const preferActionYml: Rule.RuleModule = preferActionYmlModule.default;
const preferFailFast: Rule.RuleModule = preferFailFastModule.default;
const preferFileExtension: Rule.RuleModule = preferFileExtensionModule.default;
const preferInputsContext: Rule.RuleModule = preferInputsContextModule.default;
const preferStepUsesStyle: Rule.RuleModule = preferStepUsesStyleModule.default;
const preferTemplateYmlExtension: Rule.RuleModule =
    preferTemplateYmlExtensionModule.default;
const requireActionName: Rule.RuleModule = requireActionNameModule.default;
const requireActionRunName: Rule.RuleModule =
    requireActionRunNameModule.default;
const requireCheckoutBeforeLocalAction: Rule.RuleModule =
    requireCheckoutBeforeLocalActionModule.default;
const requireCodeqlActionsRead: Rule.RuleModule =
    requireCodeqlActionsReadModule.default;
const requireCodeqlBranchFilters: Rule.RuleModule =
    requireCodeqlBranchFiltersModule.default;
const requireCodeqlCategoryWhenLanguageMatrix: Rule.RuleModule =
    requireCodeqlCategoryWhenLanguageMatrixModule.default;
const requireCodeqlPullRequestTrigger: Rule.RuleModule =
    requireCodeqlPullRequestTriggerModule.default;
const requireCodeqlSchedule: Rule.RuleModule =
    requireCodeqlScheduleModule.default;
const requireCodeqlSecurityEventsWrite: Rule.RuleModule =
    requireCodeqlSecurityEventsWriteModule.default;
const requireCompositeStepName: Rule.RuleModule =
    requireCompositeStepNameModule.default;
const requireDependabotAssignees: Rule.RuleModule =
    requireDependabotAssigneesModule.default;
const requireDependabotAutomationPermissions: Rule.RuleModule =
    requireDependabotAutomationPermissionsModule.default;
const requireDependabotAutomationPullRequestTrigger: Rule.RuleModule =
    requireDependabotAutomationPullRequestTriggerModule.default;
const requireDependabotBotActorGuard: Rule.RuleModule =
    requireDependabotBotActorGuardModule.default;
const requireDependabotCommitMessageIncludeScope: Rule.RuleModule =
    requireDependabotCommitMessageIncludeScopeModule.default;
const requireDependabotCommitMessagePrefixDevelopment: Rule.RuleModule =
    requireDependabotCommitMessagePrefixDevelopmentModule.default;
const requireDependabotCommitMessagePrefix: Rule.RuleModule =
    requireDependabotCommitMessagePrefixModule.default;
const requireDependabotCooldown: Rule.RuleModule =
    requireDependabotCooldownModule.default;
const requireDependabotDirectory: Rule.RuleModule =
    requireDependabotDirectoryModule.default;
const requireDependabotGithubActionsDirectoryRoot: Rule.RuleModule =
    requireDependabotGithubActionsDirectoryRootModule.default;
const requireDependabotLabels: Rule.RuleModule =
    requireDependabotLabelsModule.default;
const requireDependabotOpenPullRequestsLimit: Rule.RuleModule =
    requireDependabotOpenPullRequestsLimitModule.default;
const requireDependabotPackageEcosystem: Rule.RuleModule =
    requireDependabotPackageEcosystemModule.default;
const requireDependabotPatternsForMultiEcosystemGroup: Rule.RuleModule =
    requireDependabotPatternsForMultiEcosystemGroupModule.default;
const requireDependabotScheduleCronjob: Rule.RuleModule =
    requireDependabotScheduleCronjobModule.default;
const requireDependabotScheduleInterval: Rule.RuleModule =
    requireDependabotScheduleIntervalModule.default;
const requireDependabotScheduleTime: Rule.RuleModule =
    requireDependabotScheduleTimeModule.default;
const requireDependabotScheduleTimezone: Rule.RuleModule =
    requireDependabotScheduleTimezoneModule.default;
const requireDependabotTargetBranch: Rule.RuleModule =
    requireDependabotTargetBranchModule.default;
const requireDependabotUpdates: Rule.RuleModule =
    requireDependabotUpdatesModule.default;
const requireDependabotVersion: Rule.RuleModule =
    requireDependabotVersionModule.default;
const requireDependabotVersioningStrategyForNpm: Rule.RuleModule =
    requireDependabotVersioningStrategyForNpmModule.default;
const requireDependencyReviewAction: Rule.RuleModule =
    requireDependencyReviewActionModule.default;
const requireDependencyReviewFailOnSeverity: Rule.RuleModule =
    requireDependencyReviewFailOnSeverityModule.default;
const requireDependencyReviewPermissionsContentsRead: Rule.RuleModule =
    requireDependencyReviewPermissionsContentsReadModule.default;
const requireDependencyReviewPullRequestTrigger: Rule.RuleModule =
    requireDependencyReviewPullRequestTriggerModule.default;
const requireFetchMetadataGithubToken: Rule.RuleModule =
    requireFetchMetadataGithubTokenModule.default;
const requireJobName: Rule.RuleModule = requireJobNameModule.default;
const requireJobStepName: Rule.RuleModule = requireJobStepNameModule.default;
const requireJobTimeoutMinutes: Rule.RuleModule =
    requireJobTimeoutMinutesModule.default;
const requireMergeGroupTrigger: Rule.RuleModule =
    requireMergeGroupTriggerModule.default;
const requirePullRequestTargetBranches: Rule.RuleModule =
    requirePullRequestTargetBranchesModule.default;
const requireRunStepShell: Rule.RuleModule = requireRunStepShellModule.default;
const requireRunStepTimeout: Rule.RuleModule =
    requireRunStepTimeoutModule.default;
const requireSarifUploadSecurityEventsWrite: Rule.RuleModule =
    requireSarifUploadSecurityEventsWriteModule.default;
const requireScorecardResultsFormatSarif: Rule.RuleModule =
    requireScorecardResultsFormatSarifModule.default;
const requireScorecardUploadSarifStep: Rule.RuleModule =
    requireScorecardUploadSarifStepModule.default;
const requireSecretScanContentsRead: Rule.RuleModule =
    requireSecretScanContentsReadModule.default;
const requireSecretScanFetchDepthZero: Rule.RuleModule =
    requireSecretScanFetchDepthZeroModule.default;
const requireSecretScanSchedule: Rule.RuleModule =
    requireSecretScanScheduleModule.default;
const requireTemplateCategories: Rule.RuleModule =
    requireTemplateCategoriesModule.default;
const requireTemplateFilePatterns: Rule.RuleModule =
    requireTemplateFilePatternsModule.default;
const requireTemplateIconFileExists: Rule.RuleModule =
    requireTemplateIconFileExistsModule.default;
const requireTemplateIconName: Rule.RuleModule =
    requireTemplateIconNameModule.default;
const requireTemplateWorkflowName: Rule.RuleModule =
    requireTemplateWorkflowNameModule.default;
const requireTriggerTypes: Rule.RuleModule = requireTriggerTypesModule.default;
const requireTrufflehogVerifiedResultsMode: Rule.RuleModule =
    requireTrufflehogVerifiedResultsModeModule.default;
const requireWorkflowCallInputType: Rule.RuleModule =
    requireWorkflowCallInputTypeModule.default;
const requireWorkflowCallOutputValue: Rule.RuleModule =
    requireWorkflowCallOutputValueModule.default;
const requireWorkflowConcurrency: Rule.RuleModule =
    requireWorkflowConcurrencyModule.default;
const requireWorkflowDispatchInputType: Rule.RuleModule =
    requireWorkflowDispatchInputTypeModule.default;
const requireWorkflowInterfaceDescription: Rule.RuleModule =
    requireWorkflowInterfaceDescriptionModule.default;
const requireWorkflowPermissions: Rule.RuleModule =
    requireWorkflowPermissionsModule.default;
const requireWorkflowRunBranches: Rule.RuleModule =
    requireWorkflowRunBranchesModule.default;
const requireWorkflowTemplatePair: Rule.RuleModule =
    requireWorkflowTemplatePairModule.default;
const requireWorkflowTemplatePropertiesPair: Rule.RuleModule =
    requireWorkflowTemplatePropertiesPairModule.default;
const validTimeoutMinutes: Rule.RuleModule = validTimeoutMinutesModule.default;
const validTriggerEvents: Rule.RuleModule = validTriggerEventsModule.default;

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
