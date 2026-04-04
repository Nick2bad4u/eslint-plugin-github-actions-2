# action-name-casing

> **Rule catalog ID:** R009

## Targeted pattern scope

GitHub Actions workflow YAML files that declare a top-level `name`.

## What this rule reports

This rule reports workflow `name` values whose casing does not match the configured naming convention.

## Why this rule exists

Consistent workflow names make Actions tabs, status checks, and release dashboards easier to scan. Teams that standardize naming conventions can search and review workflow runs more quickly.

## ❌ Incorrect

```yaml
name: releasePipeline
```

## ✅ Correct

```yaml
name: Release Pipeline
```

```yaml
name: release-pipeline
```

_The second example is valid when the rule is configured for `kebab-case`._

## Behavior and migration notes

When the rule is configured with exactly one allowed casing, the autofixer rewrites the workflow `name` into that casing. If multiple casings are allowed at once, the rule stays report-only because there is no single unambiguous target format.

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
      "github-actions/action-name-casing": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.

## Further reading

- [GitHub Actions workflow syntax: `name`](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#name)
- [GitHub Actions docs: Using workflow run logs](https://docs.github.com/actions/monitoring-and-troubleshooting-workflows/using-workflow-run-logs)
