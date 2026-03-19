# require-pull-request-target-branches

> **Rule catalog ID:** R032

## Targeted pattern scope

GitHub Actions workflow YAML files triggered by `pull_request_target`.

## What this rule reports

This rule reports `pull_request_target` triggers that do not scope the target base branches with `branches` or `branches-ignore`.

## Why this rule exists

`pull_request_target` runs in the base repository context and can access privileges that ordinary forked pull request workflows do not. Adding branch filters narrows where that privileged automation can run and reduces accidental exposure across every protected branch.

## ❌ Incorrect

```yaml
on:
  pull_request_target:
    types:
      - opened

jobs:
  comment:
    runs-on: ubuntu-latest
    steps:
      - run: echo privileged automation
```

## ✅ Correct

```yaml
on:
  pull_request_target:
    types:
      - opened
    branches:
      - main
      - releases/**

jobs:
  comment:
    runs-on: ubuntu-latest
    steps:
      - run: echo privileged automation
```

## Further reading

- <https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target>
- <https://docs.github.com/actions/reference/security/secure-use>
