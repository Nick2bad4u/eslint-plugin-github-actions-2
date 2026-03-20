# require-action-name

> **Rule catalog ID:** R005

## Targeted pattern scope

GitHub Actions workflow YAML files.

## What this rule reports

This rule reports workflows that omit the top-level `name` field or set it to a non-string or empty value.

## Why this rule exists

A workflow name is what most people see first in the Actions UI, run history, and status checks. Requiring it improves discoverability and reviewability.

## ❌ Incorrect

```yaml
on:
  push:
```

## ✅ Correct

```yaml
name: CI
on:
  push:
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
      "github-actions/require-action-name": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#name](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#name)
- [https://docs.github.com/actions/monitoring-and-troubleshooting-workflows/using-workflow-run-logs](https://docs.github.com/actions/monitoring-and-troubleshooting-workflows/using-workflow-run-logs)
