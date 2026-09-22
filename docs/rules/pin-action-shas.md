# pin-action-shas

> **Rule catalog ID:** R003

## Targeted pattern scope

External `uses:` actions in workflow `jobs.<job_id>.steps` and composite action `runs.steps`, plus workflow job-level reusable workflow references. Composite actions must be in an `action.yml` or `action.yaml` file and declare `runs.using: composite`.

## What this rule reports

This rule reports third-party `uses:` references that pin to mutable tags or branches instead of a full 40-character commit SHA.

The accepted SHA contains exactly 40 lowercase hexadecimal characters. Missing refs, short SHAs, tags, and branches are reported. Repository-local references beginning with `./` and Docker references beginning with `docker://` are excluded. This rule does not enforce Docker image digest pinning.

JavaScript and Docker action metadata, unrelated YAML fields, and YAML files outside the supported workflow and action metadata paths are ignored.

## Why this rule exists

GitHub recommends pinning actions and reusable workflows to immutable SHAs because tags and branches can be retargeted after review.

## ❌ Incorrect

```yaml
steps:
 - uses: actions/checkout@v4
```

```yaml
uses: owner/repo/.github/workflows/reuse.yml@main
```

## ✅ Correct

```yaml
steps:
 - uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332
```

## Additional examples

Composite action dependencies use the same policy:

```yaml
# action.yml
name: Set up tools
description: Prepare the build tools
runs:
 using: composite
 steps:
  - uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332
  - uses: ./.github/actions/setup
```

This rule is enabled by the `actionMetadata`, `security`, `strict`, and `all` presets. The action metadata preset checks composite action dependencies without requiring workflow configuration.

The rule has no options or automatic fix: choosing a trusted commit requires reviewing the action's repository and release history.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";
import * as yamlParser from "yaml-eslint-parser";

export default [
 githubActions.configs.actionMetadata,
 {
  files: ["**/*.{yml,yaml}"],
  languageOptions: {
   parser: yamlParser,
  },
  plugins: {
   "github-actions": githubActions,
  },
  rules: {
   "github-actions/pin-action-shas": "error",
  },
 },
];
```

## When not to use it

If your repository intentionally accepts release tags or branches, disable this rule and configure [`prefer-step-uses-style`](./prefer-step-uses-style.md) for step references. Its `"release"` mode accepts references such as `@v4` and `@v4.2.0`; it is a reference-style check, not strict semantic-version validation. Tags remain mutable, so enabling that alternative does not provide this rule's immutable pinning guarantee. It does not check job-level reusable workflow references.

## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsuses](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsuses)
- [https://docs.github.com/actions/using-workflows/reusing-workflows](https://docs.github.com/actions/using-workflows/reusing-workflows)
- [https://docs.github.com/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions](https://docs.github.com/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)
