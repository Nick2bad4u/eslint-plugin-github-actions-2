# prefer-step-uses-style

> **Rule catalog ID:** R016

## Targeted pattern scope

Step-level `uses` references in GitHub Actions workflows and composite `action.yml` or `action.yaml` metadata with `runs.using: composite`. Job-level reusable workflow references and non-composite action metadata are ignored.

## What this rule reports

This rule reports step `uses` references whose style does not match the configured preference, and it can also disallow repository-local or Docker-based `uses` references.

## Why this rule exists

Standardizing how steps reference actions makes workflow reviews easier. Teams that prefer immutable commit SHAs, release tags, or branch names can enforce that choice consistently.

## ❌ Incorrect

```yaml
jobs:
 build:
  name: Build
  runs-on: ubuntu-latest
  steps:
   - name: Checkout
     uses: actions/checkout@v4
```

## ✅ Correct

```yaml
jobs:
 build:
  name: Build
  runs-on: ubuntu-latest
  steps:
   - name: Checkout
     uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332
```

## Additional examples

The same options apply to composite action dependencies:

```yaml
# action.yaml, with the "release" option
name: Set up tools
description: Prepare the build tools
runs:
 using: composite
 steps:
  - uses: actions/checkout@v4
  - uses: actions/cache@v4.2.0
```

### Options

The default is `"commit"`, which requires a full 40-character lowercase hexadecimal SHA. A string option selects one allowed style: `"branch"`, `"commit"`, or `"release"`.

`"release"` recognizes a `v` prefix followed by digits and dots, including `v4` and `v4.2.0`. This is a style convention, not strict semantic-version validation. Other refs, including prerelease tags such as `v4.2.0-beta.1`, are classified as `"branch"`.

An object option allows multiple styles and explicit exceptions:

```ts
interface Options {
 branch?: boolean;
 commit?: boolean;
 release?: boolean;
 allowDocker?: boolean;
 allowRepository?: boolean;
 ignores?: string[];
}
```

All booleans default to `false`, and `ignores` defaults to an empty list. If no style is enabled, `"commit"` is used. `allowDocker` permits Docker references without checking whether they use image digests; `allowRepository` permits local `./` action paths. `ignores` skips exact reference strings.

For example, `{ commit: true, release: true, allowRepository: true }` accepts SHA pins, release-style tags, and local actions while disallowing branches and Docker references. No automatic fix is provided because changing a reference can change executed code.

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
   "github-actions/pin-action-shas": "off",
   "github-actions/prefer-step-uses-style": ["error", "release"],
  },
 },
];
```

The example permits release-style tags in workflow and composite steps. Disable `pin-action-shas` when selecting mutable styles because that security rule independently requires immutable SHAs. This style rule is enabled by the `all` preset and can be configured explicitly alongside `actionMetadata`.

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.

## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsuses](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsuses)
- [https://docs.github.com/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions](https://docs.github.com/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)
