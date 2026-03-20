# max-jobs-per-action

> **Rule catalog ID:** R011

## Targeted pattern scope

GitHub Actions workflow YAML files that declare multiple jobs.

## What this rule reports

This rule reports workflows whose number of jobs exceeds the configured limit.

## Why this rule exists

Large workflow files become difficult to review, reason about, and evolve safely. Setting an upper bound nudges teams toward splitting unrelated concerns into smaller workflows.

## ❌ Incorrect

```yaml
jobs:
  one:
    name: One
    runs-on: ubuntu-latest
  two:
    name: Two
    runs-on: ubuntu-latest
  three:
    name: Three
    runs-on: ubuntu-latest
  four:
    name: Four
    runs-on: ubuntu-latest
```

## ✅ Correct

```yaml
jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
  test:
    name: Test
    runs-on: ubuntu-latest
  build:
    name: Build
    runs-on: ubuntu-latest
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
      "github-actions/max-jobs-per-action": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobs](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobs)
- [https://docs.github.com/actions/using-jobs/using-jobs-in-a-workflow](https://docs.github.com/actions/using-jobs/using-jobs-in-a-workflow)
