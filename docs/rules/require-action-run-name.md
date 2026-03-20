# require-action-run-name

> **Rule catalog ID:** R006

## Targeted pattern scope

GitHub Actions workflow YAML files.

## What this rule reports

This rule reports workflows that omit the top-level `run-name` field or set it to a non-string or empty value.

## Why this rule exists

A descriptive `run-name` helps distinguish workflow runs triggered from different branches, releases, or manual dispatches.

## ❌ Incorrect

```yaml
name: Release
on:
  workflow_dispatch:
```

## ✅ Correct

```yaml
name: Release
run-name: Release ${{ github.ref_name }}
on:
  workflow_dispatch:
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
      "github-actions/require-action-run-name": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#run-name](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#run-name)
- [https://docs.github.com/actions/using-workflows/manually-running-a-workflow](https://docs.github.com/actions/using-workflows/manually-running-a-workflow)
