# Rule overview

`eslint-plugin-github-actions` currently targets GitHub Actions workflow YAML files under `.github/workflows/`.

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

## Current rules

- [`require-workflow-permissions`](./require-workflow-permissions.md)
- [`require-job-timeout-minutes`](./require-job-timeout-minutes.md)
- [`pin-action-shas`](./pin-action-shas.md)
- [`require-workflow-concurrency`](./require-workflow-concurrency.md)
- [`action-name-casing`](./action-name-casing.md)
- [`job-id-casing`](./job-id-casing.md)
- [`max-jobs-per-action`](./max-jobs-per-action.md)
- [`no-external-job`](./no-external-job.md)
- [`no-inherit-secrets`](./no-inherit-secrets.md)
- [`no-invalid-concurrency-context`](./no-invalid-concurrency-context.md)
- [`no-invalid-key`](./no-invalid-key.md)
- [`no-invalid-reusable-workflow-job-key`](./no-invalid-reusable-workflow-job-key.md)
- [`no-invalid-workflow-call-output-value`](./no-invalid-workflow-call-output-value.md)
- [`no-pr-head-checkout-in-pull-request-target`](./no-pr-head-checkout-in-pull-request-target.md)
- [`no-secrets-in-if`](./no-secrets-in-if.md)
- [`no-self-hosted-runner-on-fork-pr-events`](./no-self-hosted-runner-on-fork-pr-events.md)
- [`no-top-level-env`](./no-top-level-env.md)
- [`no-top-level-permissions`](./no-top-level-permissions.md)
- [`no-unknown-job-output-reference`](./no-unknown-job-output-reference.md)
- [`no-unknown-step-reference`](./no-unknown-step-reference.md)
- [`no-untrusted-input-in-run`](./no-untrusted-input-in-run.md)
- [`no-write-all-permissions`](./no-write-all-permissions.md)
- [`prefer-fail-fast`](./prefer-fail-fast.md)
- [`prefer-file-extension`](./prefer-file-extension.md)
- [`prefer-inputs-context`](./prefer-inputs-context.md)
- [`prefer-step-uses-style`](./prefer-step-uses-style.md)
- [`require-action-name`](./require-action-name.md)
- [`require-action-run-name`](./require-action-run-name.md)
- [`require-checkout-before-local-action`](./require-checkout-before-local-action.md)
- [`require-job-name`](./require-job-name.md)
- [`require-job-step-name`](./require-job-step-name.md)
- [`require-merge-group-trigger`](./require-merge-group-trigger.md)
- [`require-pull-request-target-branches`](./require-pull-request-target-branches.md)
- [`require-run-step-shell`](./require-run-step-shell.md)
- [`require-trigger-types`](./require-trigger-types.md)
- [`require-workflow-call-input-type`](./require-workflow-call-input-type.md)
- [`require-workflow-call-output-value`](./require-workflow-call-output-value.md)
- [`require-workflow-concurrency`](./require-workflow-concurrency.md)
- [`require-workflow-dispatch-input-type`](./require-workflow-dispatch-input-type.md)
- [`require-workflow-interface-description`](./require-workflow-interface-description.md)
- [`require-workflow-run-branches`](./require-workflow-run-branches.md)
- [`valid-timeout-minutes`](./valid-timeout-minutes.md)
- [`valid-trigger-events`](./valid-trigger-events.md)
