# require-job-name

> **Rule catalog ID:** R007

## Targeted pattern scope

GitHub Actions workflow YAML files that declare jobs.

## What this rule reports

This rule reports jobs that omit `name` or set `name` to a non-string or empty value.

## Why this rule exists

Job names appear in workflow graphs and logs. Requiring them makes complex workflows easier to navigate, especially when job IDs are terse.

## ❌ Incorrect

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
```

## ✅ Correct

```yaml
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
```

## Behavior and migration notes

This rule provides a suggestion that uses the job ID as a fallback display name when `name` is missing or blank. That is useful for quick cleanup, but you should still review the suggestion and replace it with a more descriptive label when the job does more than the raw ID implies.

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
      "github-actions/require-job-name": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.

## Further reading

- [GitHub Actions workflow syntax: `jobs.<job_id>.name`](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idname)
- [GitHub Actions docs: Using jobs in a workflow](https://docs.github.com/actions/using-jobs/using-jobs-in-a-workflow)
