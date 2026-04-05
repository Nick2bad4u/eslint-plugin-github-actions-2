---
sidebar_position: 8
---

# `githubActions.configs.strict`

Opinionated operational guardrails for mature workflow estates.

## Included rules

Fix legend:

- 🔧 = autofixable
- 💡 = suggestions available
- — = report only

| Rule | Fix |
| --- | :-: |
| <span class="sb-inline-rule-number">R009</span> [`action-name-casing`](../action-name-casing.md) | 🔧 |
| <span class="sb-inline-rule-number">R010</span> [`job-id-casing`](../job-id-casing.md) | — |
| <span class="sb-inline-rule-number">R011</span> [`max-jobs-per-action`](../max-jobs-per-action.md) | — |
| <span class="sb-inline-rule-number">R012</span> [`no-external-job`](../no-external-job.md) | — |
| <span class="sb-inline-rule-number">R026</span> [`no-inherit-secrets`](../no-inherit-secrets.md) | — |
| <span class="sb-inline-rule-number">R042</span> [`no-invalid-concurrency-context`](../no-invalid-concurrency-context.md) | — |
| <span class="sb-inline-rule-number">R019</span> [`no-invalid-key`](../no-invalid-key.md) | — |
| <span class="sb-inline-rule-number">R041</span> [`no-invalid-reusable-workflow-job-key`](../no-invalid-reusable-workflow-job-key.md) | — |
| <span class="sb-inline-rule-number">R040</span> [`no-invalid-workflow-call-output-value`](../no-invalid-workflow-call-output-value.md) | — |
| <span class="sb-inline-rule-number">R030</span> [`no-pr-head-checkout-in-pull-request-target`](../no-pr-head-checkout-in-pull-request-target.md) | — |
| <span class="sb-inline-rule-number">R027</span> [`no-secrets-in-if`](../no-secrets-in-if.md) | — |
| <span class="sb-inline-rule-number">R036</span> [`no-self-hosted-runner-on-fork-pr-events`](../no-self-hosted-runner-on-fork-pr-events.md) | — |
| <span class="sb-inline-rule-number">R069</span> [`no-template-placeholder-in-non-template-workflow`](../no-template-placeholder-in-non-template-workflow.md) | — |
| <span class="sb-inline-rule-number">R013</span> [`no-top-level-env`](../no-top-level-env.md) | — |
| <span class="sb-inline-rule-number">R037</span> [`no-unknown-job-output-reference`](../no-unknown-job-output-reference.md) | — |
| <span class="sb-inline-rule-number">R038</span> [`no-unknown-step-reference`](../no-unknown-step-reference.md) | — |
| <span class="sb-inline-rule-number">R029</span> [`no-untrusted-input-in-run`](../no-untrusted-input-in-run.md) | — |
| <span class="sb-inline-rule-number">R023</span> [`no-write-all-permissions`](../no-write-all-permissions.md) | — |
| <span class="sb-inline-rule-number">R003</span> [`pin-action-shas`](../pin-action-shas.md) | — |
| <span class="sb-inline-rule-number">R015</span> [`prefer-fail-fast`](../prefer-fail-fast.md) | — |
| <span class="sb-inline-rule-number">R020</span> [`prefer-file-extension`](../prefer-file-extension.md) | — |
| <span class="sb-inline-rule-number">R033</span> [`prefer-inputs-context`](../prefer-inputs-context.md) | 🔧 |
| <span class="sb-inline-rule-number">R005</span> [`require-action-name`](../require-action-name.md) | — |
| <span class="sb-inline-rule-number">R006</span> [`require-action-run-name`](../require-action-run-name.md) | — |
| <span class="sb-inline-rule-number">R025</span> [`require-checkout-before-local-action`](../require-checkout-before-local-action.md) | — |
| <span class="sb-inline-rule-number">R007</span> [`require-job-name`](../require-job-name.md) | 💡 |
| <span class="sb-inline-rule-number">R008</span> [`require-job-step-name`](../require-job-step-name.md) | 💡 |
| <span class="sb-inline-rule-number">R002</span> [`require-job-timeout-minutes`](../require-job-timeout-minutes.md) | — |
| <span class="sb-inline-rule-number">R035</span> [`require-merge-group-trigger`](../require-merge-group-trigger.md) | — |
| <span class="sb-inline-rule-number">R032</span> [`require-pull-request-target-branches`](../require-pull-request-target-branches.md) | — |
| <span class="sb-inline-rule-number">R021</span> [`require-run-step-shell`](../require-run-step-shell.md) | — |
| <span class="sb-inline-rule-number">R031</span> [`require-trigger-types`](../require-trigger-types.md) | — |
| <span class="sb-inline-rule-number">R034</span> [`require-workflow-call-input-type`](../require-workflow-call-input-type.md) | — |
| <span class="sb-inline-rule-number">R039</span> [`require-workflow-call-output-value`](../require-workflow-call-output-value.md) | — |
| <span class="sb-inline-rule-number">R004</span> [`require-workflow-concurrency`](../require-workflow-concurrency.md) | — |
| <span class="sb-inline-rule-number">R022</span> [`require-workflow-dispatch-input-type`](../require-workflow-dispatch-input-type.md) | — |
| <span class="sb-inline-rule-number">R024</span> [`require-workflow-interface-description`](../require-workflow-interface-description.md) | — |
| <span class="sb-inline-rule-number">R001</span> [`require-workflow-permissions`](../require-workflow-permissions.md) | — |
| <span class="sb-inline-rule-number">R028</span> [`require-workflow-run-branches`](../require-workflow-run-branches.md) | — |
| <span class="sb-inline-rule-number">R017</span> [`valid-timeout-minutes`](../valid-timeout-minutes.md) | — |
| <span class="sb-inline-rule-number">R018</span> [`valid-trigger-events`](../valid-trigger-events.md) | — |
