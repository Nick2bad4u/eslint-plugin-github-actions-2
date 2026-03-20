# require-checkout-before-local-action

> **Rule catalog ID:** R025

## Targeted pattern scope

GitHub Actions workflow YAML files that use repository-local step actions with `uses: ./...`.

## What this rule reports

This rule reports step-level local action references that appear before any `actions/checkout` step in the same job.

## Why this rule exists

GitHub's workflow syntax requires checking out the repository before using a local action path. Without that checkout step, the action directory does not exist in the workspace and the workflow will fail at runtime.

## ❌ Incorrect

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/actions/setup-project
```

## ✅ Correct

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: ./.github/actions/setup-project
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
      "github-actions/require-checkout-before-local-action": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsuses](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsuses)
