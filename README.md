# eslint-plugin-github-actions

[![npm license.](https://flat.badgen.net/npm/license/eslint-plugin-github-actions?color=purple)](https://github.com/Nick2bad4u/eslint-plugin-github-actions/blob/main/LICENSE) [![latest GitHub release.](https://flat.badgen.net/github/release/Nick2bad4u/eslint-plugin-github-actions?color=cyan)](https://github.com/Nick2bad4u/eslint-plugin-github-actions/releases) [![GitHub stars.](https://flat.badgen.net/github/stars/Nick2bad4u/eslint-plugin-github-actions?color=yellow)](https://github.com/Nick2bad4u/eslint-plugin-github-actions/stargazers)

ESLint plugin for GitHub Actions workflow quality, reliability, and security.

The current rules focus on `.github/workflows/*.{yml,yaml}` files and help teams:

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
npm install --save-dev eslint eslint-plugin-github-actions
```

## Quick start

```js
import githubActions from "eslint-plugin-github-actions";

export default [githubActions.configs.recommended];
```

Every exported preset already scopes itself to GitHub Actions workflow YAML files.

## Presets

| Preset                              | Purpose                                             |
| ----------------------------------- | --------------------------------------------------- |
| `githubActions.configs.recommended` | Balanced defaults for most repositories.            |
| `githubActions.configs.security`    | Security-focused checks like immutable SHA pinning. |
| `githubActions.configs.strict`      | Operational guardrails for mature workflow estates. |
| `githubActions.configs.all`         | Every rule published by the plugin.                 |

## Rules

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only
- `Preset key` legend:
  - [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) — `github-actions.configs.recommended`
  - [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/security) — `github-actions.configs.security`
  - [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) — `github-actions.configs.strict`
  - [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) — `github-actions.configs.all`

| Rule | Fix | Presets |
| --- | :-: | --- |
| [`action-name-casing`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/action-name-casing) | 🔧 | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`job-id-casing`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/job-id-casing) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`max-jobs-per-action`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/max-jobs-per-action) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`no-external-job`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/no-external-job) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`no-inherit-secrets`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/no-inherit-secrets) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`no-invalid-concurrency-context`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/no-invalid-concurrency-context) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`no-invalid-key`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/no-invalid-key) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`no-invalid-reusable-workflow-job-key`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/no-invalid-reusable-workflow-job-key) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`no-invalid-workflow-call-output-value`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/no-invalid-workflow-call-output-value) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`no-pr-head-checkout-in-pull-request-target`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/no-pr-head-checkout-in-pull-request-target) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`no-secrets-in-if`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/no-secrets-in-if) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`no-self-hosted-runner-on-fork-pr-events`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/no-self-hosted-runner-on-fork-pr-events) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`no-top-level-env`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/no-top-level-env) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`no-top-level-permissions`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/no-top-level-permissions) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) |
| [`no-unknown-job-output-reference`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/no-unknown-job-output-reference) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`no-unknown-step-reference`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/no-unknown-step-reference) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`no-untrusted-input-in-run`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/no-untrusted-input-in-run) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`no-write-all-permissions`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/no-write-all-permissions) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`pin-action-shas`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/pin-action-shas) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`prefer-fail-fast`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/prefer-fail-fast) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`prefer-file-extension`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/prefer-file-extension) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`prefer-inputs-context`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/prefer-inputs-context) | 🔧 | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`prefer-step-uses-style`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/prefer-step-uses-style) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) |
| [`require-action-name`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-action-name) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`require-action-run-name`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-action-run-name) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`require-checkout-before-local-action`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-checkout-before-local-action) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`require-job-name`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-job-name) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`require-job-step-name`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-job-step-name) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`require-job-timeout-minutes`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-job-timeout-minutes) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`require-merge-group-trigger`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-merge-group-trigger) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`require-pull-request-target-branches`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-pull-request-target-branches) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`require-run-step-shell`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-run-step-shell) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`require-trigger-types`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-trigger-types) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`require-workflow-call-input-type`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-workflow-call-input-type) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`require-workflow-call-output-value`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-workflow-call-output-value) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`require-workflow-concurrency`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-workflow-concurrency) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`require-workflow-dispatch-input-type`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-workflow-dispatch-input-type) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`require-workflow-interface-description`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-workflow-interface-description) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`require-workflow-permissions`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-workflow-permissions) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`require-workflow-run-branches`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/require-workflow-run-branches) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🛡️](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/security) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`valid-timeout-minutes`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/valid-timeout-minutes) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |
| [`valid-trigger-events`](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/valid-trigger-events) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/all) [🟡](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/presets/strict) |

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
- Site: <https://nick2bad4u.github.io/eslint-plugin-github-actions/docs/rules/overview>

## Status

`eslint-plugin-github-actions` now ships a broader first wave of workflow-focused rules covering naming, readability, reliability, policy, and security. The current scope remains GitHub Actions workflow YAML, with action-manifest and additional configuration rules planned next.
