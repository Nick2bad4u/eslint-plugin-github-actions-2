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
      "github-actions/action-name-casing": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#name](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#name)
- [https://docs.github.com/actions/monitoring-and-troubleshooting-workflows/using-workflow-run-logs](https://docs.github.com/actions/monitoring-and-troubleshooting-workflows/using-workflow-run-logs)
