# require-dependency-review-permissions-contents-read

> **Rule catalog ID:** R092

## Targeted pattern scope

Workflows that use `actions/dependency-review-action`.

## What this rule reports

This rule reports jobs using the dependency review action that do not have effective `contents: read` via either workflow-level or job-level `permissions`.

## Why this rule exists

Dependency review only needs repository contents read access. Requiring that explicit least-privilege permission keeps security posture reviewable and prevents drift toward broader token scope.

## ❌ Incorrect

```yaml
on: [pull_request]
jobs:
  dependency-review:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/dependency-review-action@v4
```

## ✅ Correct

```yaml
on: [pull_request]
permissions:
  contents: read
jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/dependency-review-action@v4
```

```yaml
on: [pull_request]
jobs:
  dependency-review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/dependency-review-action@v4
```

## Additional examples

This rule complements `require-workflow-permissions` by enforcing the narrower security expectation specific to dependency review jobs without forcing that permission to live only at the workflow root.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.security];
```

## When not to use it

Disable this rule only if a repository-local wrapper around dependency review genuinely needs broader permissions and that design has already been reviewed.

## Further reading

- [Customizing your dependency review action configuration](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/customizing-your-dependency-review-action-configuration)
- [GitHub Actions workflow syntax: permissions](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#permissions)
