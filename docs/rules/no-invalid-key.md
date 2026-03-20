# no-invalid-key

> **Rule catalog ID:** R019

## Targeted pattern scope

GitHub Actions workflow YAML mappings at the top level and within common job substructures.

## What this rule reports

This rule reports unsupported keys in workflow mappings such as the top-level workflow object, jobs, steps, strategy blocks, containers, and services.

## Why this rule exists

Misspelled or misplaced workflow keys are easy to overlook in review and can silently break automation intent. Catching them early helps keep workflow files valid and easier to maintain.

This rule focuses on common GitHub Actions workflow structures, including top-level workflow keys, jobs, strategy blocks, containers, services, and individual steps.

## ❌ Incorrect

```yaml
name: CI
on:
  push:
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    strategy:
      retry: 2
    steps:
      - name: Test
        runs: npm test
```

## ✅ Correct

```yaml
name: CI
on:
  push:
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    strategy:
      fail-fast: true
    steps:
      - name: Test
        run: npm test
```

## Behavior and migration notes

This rule validates keys in the most common workflow mappings where misspellings usually become hard-to-debug failures. It does not try to validate free-form maps such as `env`, `with`, `outputs`, or `secrets`, where user-defined keys are expected.


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
      "github-actions/no-invalid-key": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax)
- [https://docs.github.com/actions/using-jobs/using-jobs-in-a-workflow](https://docs.github.com/actions/using-jobs/using-jobs-in-a-workflow)
