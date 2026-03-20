# require-workflow-concurrency

> **Rule catalog ID:** R004

## Targeted pattern scope

Workflows that listen for `push`, `pull_request`, `pull_request_target`, `workflow_dispatch`, or `merge_group` by default.

## What this rule reports

This rule reports workflows that should define top-level `concurrency` but do not, as well as concurrency blocks that omit `group` or `cancel-in-progress`.

## Why this rule exists

Concurrency helps cancel superseded runs so repeated pushes and pull request updates do not create long backlogs of redundant workflow executions.

## ❌ Incorrect

```yaml
on:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
```

```yaml
concurrency:
  group: ci
```

## ✅ Correct

```yaml
on:
  pull_request:

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
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
      "github-actions/require-workflow-concurrency": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#concurrency](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#concurrency)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idconcurrency](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idconcurrency)
