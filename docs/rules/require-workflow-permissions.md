# require-workflow-permissions

> **Rule catalog ID:** R001

## Targeted pattern scope

GitHub Actions workflow YAML files that define one or more jobs.

## What this rule reports

This rule reports workflows that omit explicit token `permissions` entirely, or jobs that omit `permissions` when the workflow does not define them globally.

## Why this rule exists

GitHub recommends using least-privilege `GITHUB_TOKEN` permissions instead of relying on broader defaults. Declaring `permissions` explicitly makes token scope reviewable and repeatable.

## ❌ Incorrect

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

## ✅ Correct

```yaml
permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
```

```yaml
jobs:
  build:
    permissions:
      contents: read
    runs-on: ubuntu-latest
```

## Additional examples

For larger repositories, this rule works well as a baseline requirement for explicit token scope. If your team prefers every job to declare permissions locally, layer the opt-in `no-top-level-permissions` rule on top.

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
      "github-actions/require-workflow-permissions": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.

## Further reading

- [GitHub Actions workflow syntax: permissions](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#permissions)
- [GitHub Actions automatic token authentication guide](https://docs.github.com/actions/security-for-github-actions/security-guides/automatic-token-authentication)
