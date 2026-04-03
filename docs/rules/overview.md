# Rule overview

`eslint-plugin-github-actions-2` targets GitHub Actions workflow YAML files, action metadata files (`action.yml` / `action.yaml`), repository Dependabot configuration files (`.github/dependabot.yml`), and workflow-template package files under `workflow-templates/`.

New to the plugin? Start with [Getting started](./getting-started.md). Need
config guidance? See the [preset reference](./presets/index.md). Looking for a
specific check? Jump to [Current rules](#current-rules).

## Included rule categories

- **Security**: explicit least-privilege permissions and immutable SHA pinning
- **Reliability**: bounded job timeouts
- **Operations**: workflow concurrency controls and valid concurrency expression contexts
- **Naming and readability**: workflow names, job IDs, job names, and step names
- **Execution clarity**: explicit run-step shells, typed workflow interfaces, canonical manual-dispatch input access, and valid step-context references
- **Workflow interface quality**: documented manual-dispatch and reusable workflow interfaces plus valid reusable output values and job-output mappings
- **Reusable workflow hygiene**: explicit checkout ordering, narrowly scoped secret passing, and valid reusable-workflow caller job keys
- **Workflow safety**: safer conditional secret handling, untrusted-script handling, scoped workflow chaining, safer privileged PR automation, fork-triggered self-hosted runner hardening, and scoped privileged PR targets
- **Trigger precision**: explicit activity-type scoping for broad multi-activity events and merge-queue-aware pull request validation
- **Dependency automation**: required Dependabot keys, explicit schedules, PR routing, labels, ownership, and commit-title conventions

## Current rules

- [`require-workflow-permissions`](./require-workflow-permissions.md)
- [`require-job-timeout-minutes`](./require-job-timeout-minutes.md)
- [`pin-action-shas`](./pin-action-shas.md)
- [`require-workflow-concurrency`](./require-workflow-concurrency.md)
- [`action-name-casing`](./action-name-casing.md)
- [`job-id-casing`](./job-id-casing.md)
- [`max-jobs-per-action`](./max-jobs-per-action.md)
- [`no-case-insensitive-input-id-collision`](./no-case-insensitive-input-id-collision.md)
- [`no-composite-input-env-access`](./no-composite-input-env-access.md)
- [`no-deprecated-node-runtime`](./no-deprecated-node-runtime.md)
- [`no-duplicate-composite-step-id`](./no-duplicate-composite-step-id.md)
- [`no-empty-template-file-pattern`](./no-empty-template-file-pattern.md)
- [`no-external-job`](./no-external-job.md)
- [`no-hardcoded-default-branch-in-template`](./no-hardcoded-default-branch-in-template.md)
- [`no-icon-file-extension-in-template-icon-name`](./no-icon-file-extension-in-template-icon-name.md)
- [`no-inherit-secrets`](./no-inherit-secrets.md)
- [`no-invalid-concurrency-context`](./no-invalid-concurrency-context.md)
- [`no-invalid-key`](./no-invalid-key.md)
- [`no-invalid-reusable-workflow-job-key`](./no-invalid-reusable-workflow-job-key.md)
- [`no-invalid-template-file-pattern-regex`](./no-invalid-template-file-pattern-regex.md)
- [`no-invalid-workflow-call-output-value`](./no-invalid-workflow-call-output-value.md)
- [`no-overlapping-dependabot-directories`](./no-overlapping-dependabot-directories.md)
- [`no-path-separators-in-template-icon-name`](./no-path-separators-in-template-icon-name.md)
- [`no-post-if-without-post`](./no-post-if-without-post.md)
- [`no-pr-head-checkout-in-pull-request-target`](./no-pr-head-checkout-in-pull-request-target.md)
- [`no-pre-if-without-pre`](./no-pre-if-without-pre.md)
- [`no-required-input-with-default`](./no-required-input-with-default.md)
- [`no-secrets-in-if`](./no-secrets-in-if.md)
- [`no-self-hosted-runner-on-fork-pr-events`](./no-self-hosted-runner-on-fork-pr-events.md)
- [`no-subdirectory-template-file-pattern`](./no-subdirectory-template-file-pattern.md)
- [`no-template-placeholder-in-non-template-workflow`](./no-template-placeholder-in-non-template-workflow.md)
- [`no-top-level-env`](./no-top-level-env.md)
- [`no-top-level-permissions`](./no-top-level-permissions.md)
- [`no-unused-dependabot-enable-beta-ecosystems`](./no-unused-dependabot-enable-beta-ecosystems.md)
- [`no-unknown-dependabot-multi-ecosystem-group`](./no-unknown-dependabot-multi-ecosystem-group.md)
- [`no-universal-template-file-pattern`](./no-universal-template-file-pattern.md)
- [`no-unknown-input-reference-in-composite`](./no-unknown-input-reference-in-composite.md)
- [`no-unknown-job-output-reference`](./no-unknown-job-output-reference.md)
- [`no-unknown-step-reference`](./no-unknown-step-reference.md)
- [`no-unused-input-in-composite`](./no-unused-input-in-composite.md)
- [`no-untrusted-input-in-run`](./no-untrusted-input-in-run.md)
- [`no-write-all-permissions`](./no-write-all-permissions.md)
- [`prefer-fail-fast`](./prefer-fail-fast.md)
- [`prefer-action-yml`](./prefer-action-yml.md)
- [`prefer-file-extension`](./prefer-file-extension.md)
- [`prefer-inputs-context`](./prefer-inputs-context.md)
- [`prefer-step-uses-style`](./prefer-step-uses-style.md)
- [`prefer-template-yml-extension`](./prefer-template-yml-extension.md)
- [`require-action-name`](./require-action-name.md)
- [`require-action-run-name`](./require-action-run-name.md)
- [`require-checkout-before-local-action`](./require-checkout-before-local-action.md)
- [`require-composite-step-name`](./require-composite-step-name.md)
- [`require-dependabot-assignees`](./require-dependabot-assignees.md)
- [`require-dependabot-commit-message-include-scope`](./require-dependabot-commit-message-include-scope.md)
- [`require-dependabot-commit-message-prefix`](./require-dependabot-commit-message-prefix.md)
- [`require-dependabot-commit-message-prefix-development`](./require-dependabot-commit-message-prefix-development.md)
- [`require-dependabot-cooldown`](./require-dependabot-cooldown.md)
- [`require-dependabot-directory`](./require-dependabot-directory.md)
- [`require-dependabot-github-actions-directory-root`](./require-dependabot-github-actions-directory-root.md)
- [`require-dependabot-labels`](./require-dependabot-labels.md)
- [`require-dependabot-open-pull-requests-limit`](./require-dependabot-open-pull-requests-limit.md)
- [`require-dependabot-package-ecosystem`](./require-dependabot-package-ecosystem.md)
- [`require-dependabot-patterns-for-multi-ecosystem-group`](./require-dependabot-patterns-for-multi-ecosystem-group.md)
- [`require-dependabot-schedule-cronjob`](./require-dependabot-schedule-cronjob.md)
- [`require-dependabot-schedule-interval`](./require-dependabot-schedule-interval.md)
- [`require-dependabot-schedule-time`](./require-dependabot-schedule-time.md)
- [`require-dependabot-schedule-timezone`](./require-dependabot-schedule-timezone.md)
- [`require-dependabot-target-branch`](./require-dependabot-target-branch.md)
- [`require-dependabot-updates`](./require-dependabot-updates.md)
- [`require-dependabot-version`](./require-dependabot-version.md)
- [`require-dependabot-versioning-strategy-for-npm`](./require-dependabot-versioning-strategy-for-npm.md)
- [`require-dependency-review-action`](./require-dependency-review-action.md)
- [`require-dependency-review-fail-on-severity`](./require-dependency-review-fail-on-severity.md)
- [`require-dependency-review-permissions-contents-read`](./require-dependency-review-permissions-contents-read.md)
- [`require-dependency-review-pull-request-trigger`](./require-dependency-review-pull-request-trigger.md)
- [`require-job-name`](./require-job-name.md)
- [`require-job-step-name`](./require-job-step-name.md)
- [`require-merge-group-trigger`](./require-merge-group-trigger.md)
- [`require-pull-request-target-branches`](./require-pull-request-target-branches.md)
- [`require-run-step-shell`](./require-run-step-shell.md)
- [`require-template-categories`](./require-template-categories.md)
- [`require-template-file-patterns`](./require-template-file-patterns.md)
- [`require-template-icon-file-exists`](./require-template-icon-file-exists.md)
- [`require-template-icon-name`](./require-template-icon-name.md)
- [`require-template-workflow-name`](./require-template-workflow-name.md)
- [`require-trigger-types`](./require-trigger-types.md)
- [`require-workflow-call-input-type`](./require-workflow-call-input-type.md)
- [`require-workflow-call-output-value`](./require-workflow-call-output-value.md)
- [`require-workflow-dispatch-input-type`](./require-workflow-dispatch-input-type.md)
- [`require-workflow-interface-description`](./require-workflow-interface-description.md)
- [`require-workflow-run-branches`](./require-workflow-run-branches.md)
- [`require-workflow-template-pair`](./require-workflow-template-pair.md)
- [`require-workflow-template-properties-pair`](./require-workflow-template-properties-pair.md)
- [`valid-timeout-minutes`](./valid-timeout-minutes.md)
- [`valid-trigger-events`](./valid-trigger-events.md)
