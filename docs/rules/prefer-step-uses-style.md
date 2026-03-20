# prefer-step-uses-style

> **Rule catalog ID:** R016

## Targeted pattern scope

GitHub Actions workflow YAML files that use step-level `uses` references.

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

For larger repositories, this rule is often enabled together with one of the published presets so violations are caught in pull requests before workflow changes are merged.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions";

export default [
  {
    files: ["**/*.{yml,yaml}"],
    plugins: {
      "github-actions": githubActions,
    },
    rules: {
      "github-actions/prefer-step-uses-style": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsuses](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsuses)
- [https://docs.github.com/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions](https://docs.github.com/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)
