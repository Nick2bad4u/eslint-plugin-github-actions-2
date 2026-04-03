# require-dependency-review-action

> **Rule catalog ID:** R091

## Targeted pattern scope

Workflow files whose path indicates a dependency review workflow, such as `.github/workflows/dependency-review.yml`.

## What this rule reports

This rule reports dependency review workflow files that do not invoke `actions/dependency-review-action`.

## Why this rule exists

If a workflow is intended to perform dependency review, it should actually run the dependency review action. Otherwise the workflow name and file path advertise security coverage that the repository is not really getting.

## ❌ Incorrect

```yaml
name: "Dependency Review"
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
```

## ✅ Correct

```yaml
name: "Dependency Review"
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/dependency-review-action@v4
```

## Additional examples

This rule is file-path-driven, which keeps it precise without forcing every repository to adopt a global workflow-existence contract.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.security];
```

## When not to use it

Disable this rule if the repository intentionally uses a differently named workflow file or a reusable wrapper workflow for dependency review.

## Further reading

- [Customizing your dependency review action configuration](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/customizing-your-dependency-review-action-configuration)
