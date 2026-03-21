# eslint-plugin-github-actions-2

[![npm license.](https://flat.badgen.net/npm/license/eslint-plugin-github-actions-2?color=purple)](https://github.com/Nick2bad4u/eslint-plugin-github-actions-2/blob/main/LICENSE) [![latest GitHub release.](https://flat.badgen.net/github/release/Nick2bad4u/eslint-plugin-github-actions-2?color=cyan)](https://github.com/Nick2bad4u/eslint-plugin-github-actions-2/releases) [![GitHub stars.](https://flat.badgen.net/github/stars/Nick2bad4u/eslint-plugin-github-actions-2?color=yellow)](https://github.com/Nick2bad4u/eslint-plugin-github-actions-2/stargazers)

ESLint plugin for GitHub Actions workflow quality, reliability, and security.

The plugin now covers:

- workflow YAML files (`.github/workflows/*.{yml,yaml}`)
- action metadata files (`**/action.yml`, `**/action.yaml`)
- workflow template packages (`**/workflow-templates/*.{yml,yaml}` and `**/workflow-templates/*.properties.json`)

Rules help teams:

- standardize workflow names and job identifiers
- require descriptive workflow, job, and step names
- make `run` steps and manual workflow inputs more explicit
- declare explicit token `permissions`
- reject unsupported workflow keys in common workflow structures
- validate and bound `timeout-minutes` values
- pin third-party `uses:` references to immutable SHAs
- configure top-level `concurrency` for duplicate-run control
- catch invalid trigger events, oversized workflow files, and inconsistent workflow filename extensions
- require explicit shells for `run` steps and explicit `workflow_dispatch` input types

## Installation

```sh
npm install --save-dev eslint eslint-plugin-github-actions-2
```

## Quick start

```js
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.recommended];
```

Every exported preset already scopes itself to the intended GitHub Actions file surfaces.

## Presets

| Preset                                             | Purpose                                             |
| -------------------------------------------------- | --------------------------------------------------- |
| `githubActions.configs.actionMetadata`             | Action metadata hygiene and correctness checks.     |
| `githubActions.configs.workflowTemplateProperties` | Workflow-template metadata quality checks.          |
| `githubActions.configs.workflowTemplates`          | Combined workflow-template YAML + metadata checks.  |
| `githubActions.configs.recommended`                | Balanced defaults for most repositories.            |
| `githubActions.configs.security`                   | Security-focused checks like immutable SHA pinning. |
| `githubActions.configs.strict`                     | Operational guardrails for mature workflow estates. |
| `githubActions.configs.all`                        | Every rule published by the plugin.                 |

## Rules

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only
- `Preset key` legend:
  - [🧩](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/action-metadata) — `github-actions.configs.actionMetadata`
  - [🗂️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-template-properties) — `github-actions.configs.workflowTemplateProperties`
  - [🧱](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-templates) — `github-actions.configs.workflowTemplates`
  - [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) — `github-actions.configs.recommended`
  - [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/security) — `github-actions.configs.security`
  - [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) — `github-actions.configs.strict`
  - [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) — `github-actions.configs.all`

| Rule | Fix | Presets |
| --- | :-: | --- |
| [`action-name-casing`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/action-name-casing) | 🔧 | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`job-id-casing`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/job-id-casing) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`max-jobs-per-action`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/max-jobs-per-action) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`no-case-insensitive-input-id-collision`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-case-insensitive-input-id-collision) | — | [🧩](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/action-metadata) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`no-composite-input-env-access`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-composite-input-env-access) | — | [🧩](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/action-metadata) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`no-deprecated-node-runtime`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-deprecated-node-runtime) | — | [🧩](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/action-metadata) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`no-duplicate-composite-step-id`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-duplicate-composite-step-id) | — | [🧩](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/action-metadata) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`no-empty-template-file-pattern`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-empty-template-file-pattern) | — | [🗂️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-template-properties) [🧱](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-templates) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`no-external-job`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-external-job) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`no-hardcoded-default-branch-in-template`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-hardcoded-default-branch-in-template) | — | [🧱](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-templates) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`no-icon-file-extension-in-template-icon-name`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-icon-file-extension-in-template-icon-name) | — | [🗂️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-template-properties) [🧱](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-templates) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`no-inherit-secrets`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-inherit-secrets) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`no-invalid-concurrency-context`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-invalid-concurrency-context) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`no-invalid-key`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-invalid-key) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`no-invalid-reusable-workflow-job-key`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-invalid-reusable-workflow-job-key) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`no-invalid-template-file-pattern-regex`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-invalid-template-file-pattern-regex) | — | [🗂️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-template-properties) [🧱](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-templates) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`no-invalid-workflow-call-output-value`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-invalid-workflow-call-output-value) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`no-path-separators-in-template-icon-name`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-path-separators-in-template-icon-name) | — | [🗂️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-template-properties) [🧱](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-templates) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`no-post-if-without-post`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-post-if-without-post) | — | [🧩](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/action-metadata) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`no-pr-head-checkout-in-pull-request-target`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-pr-head-checkout-in-pull-request-target) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`no-pre-if-without-pre`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-pre-if-without-pre) | — | [🧩](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/action-metadata) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`no-required-input-with-default`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-required-input-with-default) | — | [🧩](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/action-metadata) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`no-secrets-in-if`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-secrets-in-if) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`no-self-hosted-runner-on-fork-pr-events`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-self-hosted-runner-on-fork-pr-events) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`no-subdirectory-template-file-pattern`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-subdirectory-template-file-pattern) | — | [🗂️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-template-properties) [🧱](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-templates) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`no-template-placeholder-in-non-template-workflow`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-template-placeholder-in-non-template-workflow) | — | [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`no-top-level-env`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-top-level-env) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`no-top-level-permissions`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-top-level-permissions) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`no-universal-template-file-pattern`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-universal-template-file-pattern) | — | [🗂️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-template-properties) [🧱](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-templates) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`no-unknown-input-reference-in-composite`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-unknown-input-reference-in-composite) | — | [🧩](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/action-metadata) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`no-unknown-job-output-reference`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-unknown-job-output-reference) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`no-unknown-step-reference`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-unknown-step-reference) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`no-untrusted-input-in-run`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-untrusted-input-in-run) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`no-unused-input-in-composite`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-unused-input-in-composite) | — | [🧩](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/action-metadata) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`no-write-all-permissions`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-write-all-permissions) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`pin-action-shas`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/pin-action-shas) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`prefer-action-yml`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/prefer-action-yml) | — | [🧩](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/action-metadata) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`prefer-fail-fast`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/prefer-fail-fast) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`prefer-file-extension`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/prefer-file-extension) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`prefer-inputs-context`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/prefer-inputs-context) | 🔧 | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`prefer-step-uses-style`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/prefer-step-uses-style) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`prefer-template-yml-extension`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/prefer-template-yml-extension) | — | [🧱](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-templates) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`require-action-name`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-action-name) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`require-action-run-name`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-action-run-name) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`require-checkout-before-local-action`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-checkout-before-local-action) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`require-composite-step-name`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-composite-step-name) | — | [🧩](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/action-metadata) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`require-job-name`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-job-name) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`require-job-step-name`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-job-step-name) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`require-job-timeout-minutes`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-job-timeout-minutes) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`require-merge-group-trigger`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-merge-group-trigger) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`require-pull-request-target-branches`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-pull-request-target-branches) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`require-run-step-shell`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-run-step-shell) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`require-template-categories`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-template-categories) | — | [🗂️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-template-properties) [🧱](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-templates) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`require-template-file-patterns`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-template-file-patterns) | — | [🗂️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-template-properties) [🧱](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-templates) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`require-template-icon-file-exists`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-template-icon-file-exists) | — | [🗂️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-template-properties) [🧱](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-templates) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`require-template-icon-name`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-template-icon-name) | — | [🗂️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-template-properties) [🧱](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-templates) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`require-template-workflow-name`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-template-workflow-name) | — | [🧱](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-templates) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`require-trigger-types`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-trigger-types) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`require-workflow-call-input-type`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-workflow-call-input-type) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`require-workflow-call-output-value`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-workflow-call-output-value) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`require-workflow-concurrency`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-workflow-concurrency) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`require-workflow-dispatch-input-type`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-workflow-dispatch-input-type) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`require-workflow-interface-description`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-workflow-interface-description) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`require-workflow-permissions`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-workflow-permissions) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`require-workflow-run-branches`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-workflow-run-branches) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`require-workflow-template-pair`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-workflow-template-pair) | — | [🧱](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-templates) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`require-workflow-template-properties-pair`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-workflow-template-properties-pair) | — | [🗂️](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-template-properties) [🧱](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/workflow-templates) [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) |
| [`valid-timeout-minutes`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/valid-timeout-minutes) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |
| [`valid-trigger-events`](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/valid-trigger-events) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/presets/strict) |

## Example

```yaml
name: ci

on:
  pull_request:
  push:
    branches:
      - main

permissions:
  contents: read

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332
      - run: npm test
```

## Documentation

- Rule docs: `docs/rules/`
- Site: <https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/overview>

## Status

`eslint-plugin-github-actions-2` ships workflow, action metadata, and workflow-template linting surfaces with policy, reliability, and security coverage.
