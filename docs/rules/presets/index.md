---
sidebar_position: 0
---

# Presets

The plugin exports nine flat-config presets:

- [`githubActions.configs.actionMetadata`](./action-metadata.md)
- [`githubActions.configs.codeScanning`](./code-scanning.md)
- [`githubActions.configs.dependabot`](./dependabot.md)
- [`githubActions.configs.workflowTemplateProperties`](./workflow-template-properties.md)
- [`githubActions.configs.workflowTemplates`](./workflow-templates.md)
- [`githubActions.configs.recommended`](./recommended.md)
- [`githubActions.configs.security`](./security.md)
- [`githubActions.configs.strict`](./strict.md)
- [`githubActions.configs.all`](./all.md)

These presets cover workflow YAML, action metadata (`action.yml` / `action.yaml`),
repository Dependabot configuration (`.github/dependabot.yml`), and workflow
template package files (`workflow-templates/*.yml`, `*.yaml`, and
`*.properties.json`).

## How to choose

- Start with **recommended** for broad baseline quality and safety.
- Layer **security** for stronger supply-chain and permissions-focused checks.
- Use **codeScanning** for CodeQL, dependency review, SARIF upload, and related code-scanning workflows.
- Use **strict** when you want high signal on operational consistency.
- Use **all** for complete rule coverage (best for internal policy repos).
- Use **dependabot** when you want a dedicated policy surface for dependency update automation.

Then review [getting started](../getting-started.md) and the full
[rule reference](../overview.md).

## Rule Matrix

Fix legend:

- 🔧 = autofixable
- 💡 = suggestions available
- — = report only

Preset key legend:

- [🧩](./action-metadata.md) — [`githubActions.configs.actionMetadata`](./action-metadata.md)
- [🔎](./code-scanning.md) — [`githubActions.configs.codeScanning`](./code-scanning.md)
- [🤖](./dependabot.md) — [`githubActions.configs.dependabot`](./dependabot.md)
- [🗂️](./workflow-template-properties.md) — [`githubActions.configs.workflowTemplateProperties`](./workflow-template-properties.md)
- [🧱](./workflow-templates.md) — [`githubActions.configs.workflowTemplates`](./workflow-templates.md)
- [🟡](./recommended.md) — [`githubActions.configs.recommended`](./recommended.md)
- [🛡️](./security.md) — [`githubActions.configs.security`](./security.md)
- [🔴](./strict.md) — [`githubActions.configs.strict`](./strict.md)
- [🟣](./all.md) — [`githubActions.configs.all`](./all.md)

| Rule | Fix | Preset key |
| --- | :-: | --- |
| <span class="sb-inline-rule-number">R009</span> [`action-name-casing`](../action-name-casing.md) | 🔧 | [🟣](./all.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R010</span> [`job-id-casing`](../job-id-casing.md) | — | [🟣](./all.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R011</span> [`max-jobs-per-action`](../max-jobs-per-action.md) | — | [🟣](./all.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R048</span> [`no-case-insensitive-input-id-collision`](../no-case-insensitive-input-id-collision.md) | — | [🧩](./action-metadata.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R097</span> [`no-codeql-autobuild-for-javascript-typescript`](../no-codeql-autobuild-for-javascript-typescript.md) | — | [🟣](./all.md) [🔎](./code-scanning.md) |
| <span class="sb-inline-rule-number">R096</span> [`no-codeql-javascript-typescript-split-language-matrix`](../no-codeql-javascript-typescript-split-language-matrix.md) | — | [🟣](./all.md) [🔎](./code-scanning.md) |
| <span class="sb-inline-rule-number">R049</span> [`no-composite-input-env-access`](../no-composite-input-env-access.md) | — | [🧩](./action-metadata.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R044</span> [`no-deprecated-node-runtime`](../no-deprecated-node-runtime.md) | — | [🧩](./action-metadata.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R051</span> [`no-duplicate-composite-step-id`](../no-duplicate-composite-step-id.md) | — | [🧩](./action-metadata.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R060</span> [`no-empty-template-file-pattern`](../no-empty-template-file-pattern.md) | 🔧 | [🗂️](./workflow-template-properties.md) [🧱](./workflow-templates.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R012</span> [`no-external-job`](../no-external-job.md) | — | [🟣](./all.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R068</span> [`no-hardcoded-default-branch-in-template`](../no-hardcoded-default-branch-in-template.md) | — | [🧱](./workflow-templates.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R063</span> [`no-icon-file-extension-in-template-icon-name`](../no-icon-file-extension-in-template-icon-name.md) | 🔧 | [🗂️](./workflow-template-properties.md) [🧱](./workflow-templates.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R026</span> [`no-inherit-secrets`](../no-inherit-secrets.md) | — | [🟣](./all.md) [🛡️](./security.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R042</span> [`no-invalid-concurrency-context`](../no-invalid-concurrency-context.md) | — | [🟣](./all.md) [🟡](./recommended.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R019</span> [`no-invalid-key`](../no-invalid-key.md) | — | [🟣](./all.md) [🟡](./recommended.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R041</span> [`no-invalid-reusable-workflow-job-key`](../no-invalid-reusable-workflow-job-key.md) | — | [🟣](./all.md) [🟡](./recommended.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R059</span> [`no-invalid-template-file-pattern-regex`](../no-invalid-template-file-pattern-regex.md) | — | [🗂️](./workflow-template-properties.md) [🧱](./workflow-templates.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R040</span> [`no-invalid-workflow-call-output-value`](../no-invalid-workflow-call-output-value.md) | — | [🟣](./all.md) [🟡](./recommended.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R095</span> [`no-overlapping-dependabot-directories`](../no-overlapping-dependabot-directories.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R064</span> [`no-path-separators-in-template-icon-name`](../no-path-separators-in-template-icon-name.md) | 💡 | [🗂️](./workflow-template-properties.md) [🧱](./workflow-templates.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R046</span> [`no-post-if-without-post`](../no-post-if-without-post.md) | 🔧 | [🧩](./action-metadata.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R030</span> [`no-pr-head-checkout-in-pull-request-target`](../no-pr-head-checkout-in-pull-request-target.md) | — | [🟣](./all.md) [🛡️](./security.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R045</span> [`no-pre-if-without-pre`](../no-pre-if-without-pre.md) | 🔧 | [🧩](./action-metadata.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R047</span> [`no-required-input-with-default`](../no-required-input-with-default.md) | 💡 | [🧩](./action-metadata.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R027</span> [`no-secrets-in-if`](../no-secrets-in-if.md) | — | [🟣](./all.md) [🟡](./recommended.md) [🛡️](./security.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R036</span> [`no-self-hosted-runner-on-fork-pr-events`](../no-self-hosted-runner-on-fork-pr-events.md) | — | [🟣](./all.md) [🛡️](./security.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R062</span> [`no-subdirectory-template-file-pattern`](../no-subdirectory-template-file-pattern.md) | — | [🗂️](./workflow-template-properties.md) [🧱](./workflow-templates.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R069</span> [`no-template-placeholder-in-non-template-workflow`](../no-template-placeholder-in-non-template-workflow.md) | — | [🟡](./recommended.md) [🔴](./strict.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R013</span> [`no-top-level-env`](../no-top-level-env.md) | — | [🟣](./all.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R014</span> [`no-top-level-permissions`](../no-top-level-permissions.md) | — | [🟣](./all.md) |
| <span class="sb-inline-rule-number">R061</span> [`no-universal-template-file-pattern`](../no-universal-template-file-pattern.md) | — | [🗂️](./workflow-template-properties.md) [🧱](./workflow-templates.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R081</span> [`no-unknown-dependabot-multi-ecosystem-group`](../no-unknown-dependabot-multi-ecosystem-group.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R050</span> [`no-unknown-input-reference-in-composite`](../no-unknown-input-reference-in-composite.md) | — | [🧩](./action-metadata.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R037</span> [`no-unknown-job-output-reference`](../no-unknown-job-output-reference.md) | — | [🟣](./all.md) [🟡](./recommended.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R038</span> [`no-unknown-step-reference`](../no-unknown-step-reference.md) | — | [🟣](./all.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R029</span> [`no-untrusted-input-in-run`](../no-untrusted-input-in-run.md) | — | [🟣](./all.md) [🛡️](./security.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R085</span> [`no-unused-dependabot-enable-beta-ecosystems`](../no-unused-dependabot-enable-beta-ecosystems.md) | 🔧 | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R053</span> [`no-unused-input-in-composite`](../no-unused-input-in-composite.md) | — | [🧩](./action-metadata.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R023</span> [`no-write-all-permissions`](../no-write-all-permissions.md) | — | [🟣](./all.md) [🟡](./recommended.md) [🛡️](./security.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R003</span> [`pin-action-shas`](../pin-action-shas.md) | — | [🟣](./all.md) [🛡️](./security.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R043</span> [`prefer-action-yml`](../prefer-action-yml.md) | — | [🧩](./action-metadata.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R015</span> [`prefer-fail-fast`](../prefer-fail-fast.md) | — | [🟣](./all.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R020</span> [`prefer-file-extension`](../prefer-file-extension.md) | — | [🟣](./all.md) [🟡](./recommended.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R033</span> [`prefer-inputs-context`](../prefer-inputs-context.md) | 🔧 | [🟣](./all.md) [🟡](./recommended.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R016</span> [`prefer-step-uses-style`](../prefer-step-uses-style.md) | — | [🟣](./all.md) |
| <span class="sb-inline-rule-number">R066</span> [`prefer-template-yml-extension`](../prefer-template-yml-extension.md) | — | [🧱](./workflow-templates.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R005</span> [`require-action-name`](../require-action-name.md) | — | [🟣](./all.md) [🟡](./recommended.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R006</span> [`require-action-run-name`](../require-action-run-name.md) | — | [🟣](./all.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R025</span> [`require-checkout-before-local-action`](../require-checkout-before-local-action.md) | — | [🟣](./all.md) [🟡](./recommended.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R099</span> [`require-codeql-actions-read`](../require-codeql-actions-read.md) | — | [🟣](./all.md) [🔎](./code-scanning.md) |
| <span class="sb-inline-rule-number">R113</span> [`require-codeql-branch-filters`](../require-codeql-branch-filters.md) | — | [🟣](./all.md) [🔎](./code-scanning.md) |
| <span class="sb-inline-rule-number">R114</span> [`require-codeql-category-when-language-matrix`](../require-codeql-category-when-language-matrix.md) | — | [🟣](./all.md) [🔎](./code-scanning.md) |
| <span class="sb-inline-rule-number">R100</span> [`require-codeql-pull-request-trigger`](../require-codeql-pull-request-trigger.md) | — | [🟣](./all.md) [🔎](./code-scanning.md) |
| <span class="sb-inline-rule-number">R101</span> [`require-codeql-schedule`](../require-codeql-schedule.md) | — | [🟣](./all.md) [🔎](./code-scanning.md) |
| <span class="sb-inline-rule-number">R098</span> [`require-codeql-security-events-write`](../require-codeql-security-events-write.md) | — | [🟣](./all.md) [🔎](./code-scanning.md) [🛡️](./security.md) |
| <span class="sb-inline-rule-number">R052</span> [`require-composite-step-name`](../require-composite-step-name.md) | — | [🧩](./action-metadata.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R077</span> [`require-dependabot-assignees`](../require-dependabot-assignees.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R111</span> [`require-dependabot-automation-permissions`](../require-dependabot-automation-permissions.md) | — | [🟣](./all.md) [🛡️](./security.md) |
| <span class="sb-inline-rule-number">R112</span> [`require-dependabot-automation-pull-request-trigger`](../require-dependabot-automation-pull-request-trigger.md) | — | [🟣](./all.md) [🛡️](./security.md) |
| <span class="sb-inline-rule-number">R109</span> [`require-dependabot-bot-actor-guard`](../require-dependabot-bot-actor-guard.md) | — | [🟣](./all.md) [🛡️](./security.md) |
| <span class="sb-inline-rule-number">R089</span> [`require-dependabot-commit-message-include-scope`](../require-dependabot-commit-message-include-scope.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R079</span> [`require-dependabot-commit-message-prefix`](../require-dependabot-commit-message-prefix.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R090</span> [`require-dependabot-commit-message-prefix-development`](../require-dependabot-commit-message-prefix-development.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R086</span> [`require-dependabot-cooldown`](../require-dependabot-cooldown.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R073</span> [`require-dependabot-directory`](../require-dependabot-directory.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R084</span> [`require-dependabot-github-actions-directory-root`](../require-dependabot-github-actions-directory-root.md) | 🔧 | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R080</span> [`require-dependabot-labels`](../require-dependabot-labels.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R087</span> [`require-dependabot-open-pull-requests-limit`](../require-dependabot-open-pull-requests-limit.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R072</span> [`require-dependabot-package-ecosystem`](../require-dependabot-package-ecosystem.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R082</span> [`require-dependabot-patterns-for-multi-ecosystem-group`](../require-dependabot-patterns-for-multi-ecosystem-group.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R083</span> [`require-dependabot-schedule-cronjob`](../require-dependabot-schedule-cronjob.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R074</span> [`require-dependabot-schedule-interval`](../require-dependabot-schedule-interval.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R075</span> [`require-dependabot-schedule-time`](../require-dependabot-schedule-time.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R076</span> [`require-dependabot-schedule-timezone`](../require-dependabot-schedule-timezone.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R078</span> [`require-dependabot-target-branch`](../require-dependabot-target-branch.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R071</span> [`require-dependabot-updates`](../require-dependabot-updates.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R070</span> [`require-dependabot-version`](../require-dependabot-version.md) | 🔧 | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R088</span> [`require-dependabot-versioning-strategy-for-npm`](../require-dependabot-versioning-strategy-for-npm.md) | — | [🟣](./all.md) [🤖](./dependabot.md) |
| <span class="sb-inline-rule-number">R091</span> [`require-dependency-review-action`](../require-dependency-review-action.md) | — | [🟣](./all.md) [🔎](./code-scanning.md) [🛡️](./security.md) |
| <span class="sb-inline-rule-number">R093</span> [`require-dependency-review-fail-on-severity`](../require-dependency-review-fail-on-severity.md) | — | [🟣](./all.md) [🔎](./code-scanning.md) [🛡️](./security.md) |
| <span class="sb-inline-rule-number">R092</span> [`require-dependency-review-permissions-contents-read`](../require-dependency-review-permissions-contents-read.md) | — | [🟣](./all.md) [🔎](./code-scanning.md) [🛡️](./security.md) |
| <span class="sb-inline-rule-number">R094</span> [`require-dependency-review-pull-request-trigger`](../require-dependency-review-pull-request-trigger.md) | — | [🟣](./all.md) [🔎](./code-scanning.md) [🛡️](./security.md) |
| <span class="sb-inline-rule-number">R110</span> [`require-fetch-metadata-github-token`](../require-fetch-metadata-github-token.md) | — | [🟣](./all.md) [🛡️](./security.md) |
| <span class="sb-inline-rule-number">R007</span> [`require-job-name`](../require-job-name.md) | 💡 | [🟣](./all.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R008</span> [`require-job-step-name`](../require-job-step-name.md) | 💡 | [🟣](./all.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R002</span> [`require-job-timeout-minutes`](../require-job-timeout-minutes.md) | — | [🟣](./all.md) [🟡](./recommended.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R035</span> [`require-merge-group-trigger`](../require-merge-group-trigger.md) | — | [🟣](./all.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R032</span> [`require-pull-request-target-branches`](../require-pull-request-target-branches.md) | — | [🟣](./all.md) [🛡️](./security.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R021</span> [`require-run-step-shell`](../require-run-step-shell.md) | — | [🟣](./all.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R102</span> [`require-sarif-upload-security-events-write`](../require-sarif-upload-security-events-write.md) | — | [🟣](./all.md) [🔎](./code-scanning.md) [🛡️](./security.md) |
| <span class="sb-inline-rule-number">R103</span> [`require-scorecard-results-format-sarif`](../require-scorecard-results-format-sarif.md) | — | [🟣](./all.md) [🔎](./code-scanning.md) |
| <span class="sb-inline-rule-number">R104</span> [`require-scorecard-upload-sarif-step`](../require-scorecard-upload-sarif-step.md) | — | [🟣](./all.md) [🔎](./code-scanning.md) |
| <span class="sb-inline-rule-number">R107</span> [`require-secret-scan-contents-read`](../require-secret-scan-contents-read.md) | — | [🟣](./all.md) [🛡️](./security.md) |
| <span class="sb-inline-rule-number">R105</span> [`require-secret-scan-fetch-depth-zero`](../require-secret-scan-fetch-depth-zero.md) | — | [🟣](./all.md) [🛡️](./security.md) |
| <span class="sb-inline-rule-number">R106</span> [`require-secret-scan-schedule`](../require-secret-scan-schedule.md) | — | [🟣](./all.md) [🛡️](./security.md) |
| <span class="sb-inline-rule-number">R057</span> [`require-template-categories`](../require-template-categories.md) | — | [🗂️](./workflow-template-properties.md) [🧱](./workflow-templates.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R058</span> [`require-template-file-patterns`](../require-template-file-patterns.md) | — | [🗂️](./workflow-template-properties.md) [🧱](./workflow-templates.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R065</span> [`require-template-icon-file-exists`](../require-template-icon-file-exists.md) | — | [🗂️](./workflow-template-properties.md) [🧱](./workflow-templates.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R056</span> [`require-template-icon-name`](../require-template-icon-name.md) | — | [🗂️](./workflow-template-properties.md) [🧱](./workflow-templates.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R067</span> [`require-template-workflow-name`](../require-template-workflow-name.md) | — | [🧱](./workflow-templates.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R031</span> [`require-trigger-types`](../require-trigger-types.md) | — | [🟣](./all.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R108</span> [`require-trufflehog-verified-results-mode`](../require-trufflehog-verified-results-mode.md) | — | [🟣](./all.md) [🛡️](./security.md) |
| <span class="sb-inline-rule-number">R034</span> [`require-workflow-call-input-type`](../require-workflow-call-input-type.md) | — | [🟣](./all.md) [🟡](./recommended.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R039</span> [`require-workflow-call-output-value`](../require-workflow-call-output-value.md) | — | [🟣](./all.md) [🟡](./recommended.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R004</span> [`require-workflow-concurrency`](../require-workflow-concurrency.md) | — | [🟣](./all.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R022</span> [`require-workflow-dispatch-input-type`](../require-workflow-dispatch-input-type.md) | — | [🟣](./all.md) [🟡](./recommended.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R024</span> [`require-workflow-interface-description`](../require-workflow-interface-description.md) | — | [🟣](./all.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R001</span> [`require-workflow-permissions`](../require-workflow-permissions.md) | — | [🟣](./all.md) [🟡](./recommended.md) [🛡️](./security.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R028</span> [`require-workflow-run-branches`](../require-workflow-run-branches.md) | — | [🟣](./all.md) [🛡️](./security.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R054</span> [`require-workflow-template-pair`](../require-workflow-template-pair.md) | — | [🧱](./workflow-templates.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R055</span> [`require-workflow-template-properties-pair`](../require-workflow-template-properties-pair.md) | — | [🗂️](./workflow-template-properties.md) [🧱](./workflow-templates.md) [🟣](./all.md) |
| <span class="sb-inline-rule-number">R017</span> [`valid-timeout-minutes`](../valid-timeout-minutes.md) | — | [🟣](./all.md) [🟡](./recommended.md) [🔴](./strict.md) |
| <span class="sb-inline-rule-number">R018</span> [`valid-trigger-events`](../valid-trigger-events.md) | — | [🟣](./all.md) [🟡](./recommended.md) [🔴](./strict.md) |
