# no-top-level-permissions

> **Rule catalog ID:** R014

## Targeted pattern scope

GitHub Actions workflow YAML files that declare `permissions` at the top level.

## What this rule reports

This rule reports workflows that define top-level `permissions` instead of scoping token permissions per job.

## Why this rule exists

Some teams want every job to declare the exact token scope it needs so that permission review happens at the job boundary rather than once per workflow.

## ❌ Incorrect

```yaml
permissions:
  contents: read
```

## ✅ Correct

```yaml
jobs:
  build:
    name: Build
    permissions:
      contents: read
    runs-on: ubuntu-latest
```

## Additional examples

This is an intentionally opinionated opt-in rule for repositories that require every job to declare its token scope locally.

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
      "github-actions/no-top-level-permissions": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.

## Further reading

- [GitHub Actions workflow syntax: permissions](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#permissions)
- [GitHub Actions automatic token authentication guide](https://docs.github.com/actions/security-for-github-actions/security-guides/automatic-token-authentication)
