# Presets

The plugin exports seven flat-config presets:

- [`githubActions.configs.actionMetadata`](./action-metadata.md)
- [`githubActions.configs.workflowTemplateProperties`](./workflow-template-properties.md)
- [`githubActions.configs.workflowTemplates`](./workflow-templates.md)
- [`githubActions.configs.recommended`](./recommended.md)
- [`githubActions.configs.security`](./security.md)
- [`githubActions.configs.strict`](./strict.md)
- [`githubActions.configs.all`](./all.md)

These presets cover workflow YAML, action metadata (`action.yml` / `action.yaml`),
and workflow template package files (`workflow-templates/*.yml`, `*.yaml`, and
`*.properties.json`).

## How to choose

- Start with **recommended** for broad baseline quality and safety.
- Layer **security** for stronger supply-chain and permissions-focused checks.
- Use **strict** when you want high signal on operational consistency.
- Use **all** for complete rule coverage (best for internal policy repos).

Then review [getting started](../getting-started.md) and the full
[rule reference](../overview.md).

## Rule Matrix

Fix legend:
🔧 = autofixable
💡 = suggestions available
— = report only

Preset key legend:
🧩 — githubActions.configs.actionMetadata
🗂️ — githubActions.configs.workflowTemplateProperties
🧱 — githubActions.configs.workflowTemplates
🟡 — githubActions.configs.recommended
🛡️ — githubActions.configs.security
🔴 — githubActions.configs.strict
🟣 — githubActions.configs.all

| Rule | Fix | Preset key |
| --- | :-: | --- |
| <span class="sb-inline-rule-number">R009</span> [`action-name-casing`](../action-name-casing.md) | 🔧 | 🟣 🔴 |
| <span class="sb-inline-rule-number">R010</span> [`job-id-casing`](../job-id-casing.md) | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R011</span> [`max-jobs-per-action`](../max-jobs-per-action.md) | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R048</span> [`no-case-insensitive-input-id-collision`](../no-case-insensitive-input-id-collision.md) | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R049</span> [`no-composite-input-env-access`](../no-composite-input-env-access.md) | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R044</span> [`no-deprecated-node-runtime`](../no-deprecated-node-runtime.md) | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R051</span> [`no-duplicate-composite-step-id`](../no-duplicate-composite-step-id.md) | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R060</span> [`no-empty-template-file-pattern`](../no-empty-template-file-pattern.md) | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R012</span> [`no-external-job`](../no-external-job.md) | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R068</span> [`no-hardcoded-default-branch-in-template`](../no-hardcoded-default-branch-in-template.md) | — | 🧱 🟣 |
| <span class="sb-inline-rule-number">R063</span> [`no-icon-file-extension-in-template-icon-name`](../no-icon-file-extension-in-template-icon-name.md) | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R026</span> [`no-inherit-secrets`](../no-inherit-secrets.md) | — | 🟣 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R042</span> [`no-invalid-concurrency-context`](../no-invalid-concurrency-context.md) | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R019</span> [`no-invalid-key`](../no-invalid-key.md) | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R041</span> [`no-invalid-reusable-workflow-job-key`](../no-invalid-reusable-workflow-job-key.md) | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R059</span> [`no-invalid-template-file-pattern-regex`](../no-invalid-template-file-pattern-regex.md) | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R040</span> [`no-invalid-workflow-call-output-value`](../no-invalid-workflow-call-output-value.md) | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R064</span> [`no-path-separators-in-template-icon-name`](../no-path-separators-in-template-icon-name.md) | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R046</span> [`no-post-if-without-post`](../no-post-if-without-post.md) | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R030</span> [`no-pr-head-checkout-in-pull-request-target`](../no-pr-head-checkout-in-pull-request-target.md) | — | 🟣 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R045</span> [`no-pre-if-without-pre`](../no-pre-if-without-pre.md) | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R047</span> [`no-required-input-with-default`](../no-required-input-with-default.md) | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R027</span> [`no-secrets-in-if`](../no-secrets-in-if.md) | — | 🟣 🟡 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R036</span> [`no-self-hosted-runner-on-fork-pr-events`](../no-self-hosted-runner-on-fork-pr-events.md) | — | 🟣 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R062</span> [`no-subdirectory-template-file-pattern`](../no-subdirectory-template-file-pattern.md) | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R069</span> [`no-template-placeholder-in-non-template-workflow`](../no-template-placeholder-in-non-template-workflow.md) | — | 🟡 🔴 🟣 |
| <span class="sb-inline-rule-number">R013</span> [`no-top-level-env`](../no-top-level-env.md) | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R014</span> [`no-top-level-permissions`](../no-top-level-permissions.md) | — | 🟣 |
| <span class="sb-inline-rule-number">R061</span> [`no-universal-template-file-pattern`](../no-universal-template-file-pattern.md) | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R050</span> [`no-unknown-input-reference-in-composite`](../no-unknown-input-reference-in-composite.md) | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R037</span> [`no-unknown-job-output-reference`](../no-unknown-job-output-reference.md) | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R038</span> [`no-unknown-step-reference`](../no-unknown-step-reference.md) | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R029</span> [`no-untrusted-input-in-run`](../no-untrusted-input-in-run.md) | — | 🟣 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R053</span> [`no-unused-input-in-composite`](../no-unused-input-in-composite.md) | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R023</span> [`no-write-all-permissions`](../no-write-all-permissions.md) | — | 🟣 🟡 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R003</span> [`pin-action-shas`](../pin-action-shas.md) | — | 🟣 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R043</span> [`prefer-action-yml`](../prefer-action-yml.md) | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R015</span> [`prefer-fail-fast`](../prefer-fail-fast.md) | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R020</span> [`prefer-file-extension`](../prefer-file-extension.md) | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R033</span> [`prefer-inputs-context`](../prefer-inputs-context.md) | 🔧 | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R016</span> [`prefer-step-uses-style`](../prefer-step-uses-style.md) | — | 🟣 |
| <span class="sb-inline-rule-number">R066</span> [`prefer-template-yml-extension`](../prefer-template-yml-extension.md) | — | 🧱 🟣 |
| <span class="sb-inline-rule-number">R005</span> [`require-action-name`](../require-action-name.md) | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R006</span> [`require-action-run-name`](../require-action-run-name.md) | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R025</span> [`require-checkout-before-local-action`](../require-checkout-before-local-action.md) | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R052</span> [`require-composite-step-name`](../require-composite-step-name.md) | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R007</span> [`require-job-name`](../require-job-name.md) | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R008</span> [`require-job-step-name`](../require-job-step-name.md) | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R002</span> [`require-job-timeout-minutes`](../require-job-timeout-minutes.md) | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R035</span> [`require-merge-group-trigger`](../require-merge-group-trigger.md) | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R032</span> [`require-pull-request-target-branches`](../require-pull-request-target-branches.md) | — | 🟣 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R021</span> [`require-run-step-shell`](../require-run-step-shell.md) | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R057</span> [`require-template-categories`](../require-template-categories.md) | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R058</span> [`require-template-file-patterns`](../require-template-file-patterns.md) | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R065</span> [`require-template-icon-file-exists`](../require-template-icon-file-exists.md) | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R056</span> [`require-template-icon-name`](../require-template-icon-name.md) | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R067</span> [`require-template-workflow-name`](../require-template-workflow-name.md) | — | 🧱 🟣 |
| <span class="sb-inline-rule-number">R031</span> [`require-trigger-types`](../require-trigger-types.md) | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R034</span> [`require-workflow-call-input-type`](../require-workflow-call-input-type.md) | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R039</span> [`require-workflow-call-output-value`](../require-workflow-call-output-value.md) | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R004</span> [`require-workflow-concurrency`](../require-workflow-concurrency.md) | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R022</span> [`require-workflow-dispatch-input-type`](../require-workflow-dispatch-input-type.md) | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R024</span> [`require-workflow-interface-description`](../require-workflow-interface-description.md) | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R001</span> [`require-workflow-permissions`](../require-workflow-permissions.md) | — | 🟣 🟡 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R028</span> [`require-workflow-run-branches`](../require-workflow-run-branches.md) | — | 🟣 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R054</span> [`require-workflow-template-pair`](../require-workflow-template-pair.md) | — | 🧱 🟣 |
| <span class="sb-inline-rule-number">R055</span> [`require-workflow-template-properties-pair`](../require-workflow-template-properties-pair.md) | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R017</span> [`valid-timeout-minutes`](../valid-timeout-minutes.md) | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R018</span> [`valid-trigger-events`](../valid-trigger-events.md) | — | 🟣 🟡 🔴 |
