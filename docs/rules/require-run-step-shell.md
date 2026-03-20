# require-run-step-shell

> **Rule catalog ID:** R021

## Targeted pattern scope

GitHub Actions workflow YAML files with `run` steps.

## What this rule reports

This rule reports `run` steps that do not declare `shell` themselves and do not inherit one from `defaults.run.shell`. It also reports empty or non-string `shell` values when they are declared on a step or in defaults.

## Why this rule exists

GitHub Actions uses different implicit shells depending on the runner and execution context. Making the shell explicit keeps inline scripts predictable, documents intent for reviewers, and avoids surprises such as `sh` behavior where authors expected `bash` or `pwsh`.

## ❌ Incorrect

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Install
        run: npm ci
```

## ✅ Correct

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Install
        shell: bash
        run: npm ci
```

## Additional examples

```yaml
defaults:
  run:
    shell: bash

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Install
        run: npm ci
```

For larger repositories, this rule is often enabled together with one of the
published presets so violations are caught in pull requests before workflow
changes are merged.

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
      "github-actions/require-run-step-shell": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.

## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsshell](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsshell)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#defaultsrunshell](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#defaultsrunshell)
- [https://github.com/rhysd/actionlint/issues/374](https://github.com/rhysd/actionlint/issues/374)
