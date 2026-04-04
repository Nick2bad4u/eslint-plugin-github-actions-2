# require-job-step-name

> **Rule catalog ID:** R008

## Targeted pattern scope

GitHub Actions workflow YAML files that declare explicit job steps.

## What this rule reports

This rule reports steps that omit `name` or set `name` to a non-string or empty value.

## Why this rule exists

Step names make job logs readable and help reviewers understand the intent of a step without reading the shell command or action source.

## ❌ Incorrect

```yaml
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

## ✅ Correct

```yaml
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - name: Run tests
        run: npm test
```

## Behavior and migration notes

This rule provides suggestions when it can infer a meaningful step label from existing step content:

- for `uses:` steps, it suggests the action reference without the version suffix, and
- for `run:` steps, it suggests the first non-empty command line when that line is short enough to read well in logs.

Those suggestions are intentionally reviewable rather than automatically applied because human-friendly step names often need a little more context than the raw command or action reference.

## Additional examples

For larger repositories, this rule is often enabled together with one of the published presets so violations are caught in pull requests before workflow changes are merged.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [
  {
    files: ["**/*.{yml,yaml}"],
    plugins: {
      "github-actions": githubActions,
    },
    rules: {
      "github-actions/require-job-step-name": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.

## Further reading

- [GitHub Actions workflow syntax: `jobs.<job_id>.steps`](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idsteps)
- [GitHub Actions docs: Using workflow run logs](https://docs.github.com/actions/monitoring-and-troubleshooting-workflows/using-workflow-run-logs)
