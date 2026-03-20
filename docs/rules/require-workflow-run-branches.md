# require-workflow-run-branches

> **Rule catalog ID:** R028

## Targeted pattern scope

GitHub Actions workflow YAML files that use the `workflow_run` trigger.

## What this rule reports

This rule reports `on.workflow_run` triggers that do not declare a non-empty `branches` or `branches-ignore` filter.

## Why this rule exists

`workflow_run` is often used for follow-up workflows that have more privileges than the upstream workflow that triggered them. Requiring branch scoping keeps these follow-up workflows from reacting to every upstream branch indiscriminately and matches GitHub's documented trigger-filtering capabilities.

## ❌ Incorrect

```yaml
on:
  workflow_run:
    workflows: [CI]
    types: [completed]
```

## ✅ Correct

```yaml
on:
  workflow_run:
    workflows: [CI]
    types: [completed]
    branches:
      - main
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
      "github-actions/require-workflow-run-branches": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_runbranchesbranches-ignore](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_runbranchesbranches-ignore)
- [https://wellarchitected.github.com/library/application-security/recommendations/actions-security/](https://wellarchitected.github.com/library/application-security/recommendations/actions-security/)
