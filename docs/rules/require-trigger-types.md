# require-trigger-types

> **Rule catalog ID:** R031

## Targeted pattern scope

GitHub Actions workflow YAML files that use configurable multi-activity events without an explicit `types` filter.

## What this rule reports

This rule reports selected workflow events such as `issue_comment`, `pull_request_review`, `repository_dispatch`, `workflow_run`, `merge_group`, and similar multi-activity triggers when they omit `types`.

## Why this rule exists

GitHub documents that these events support multiple activity types and default to reacting to all supported activities when `types` is omitted. Requiring `types` keeps automation specific, easier to review, and less likely to run on unintended actions.

This rule intentionally targets event families where explicit activity scoping is especially useful, rather than requiring `types` for every possible trigger.

## ❌ Incorrect

```yaml
on:
  issue_comment:

jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - run: echo comment received
```

## ✅ Correct

```yaml
on:
  issue_comment:
    types:
      - created

jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - run: echo comment received
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
      "github-actions/require-trigger-types": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows](https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onevent_nametypes](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onevent_nametypes)
