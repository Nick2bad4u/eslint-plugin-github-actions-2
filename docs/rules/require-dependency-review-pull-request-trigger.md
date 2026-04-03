# require-dependency-review-pull-request-trigger

> **Rule catalog ID:** R094

## Targeted pattern scope

Workflows that use `actions/dependency-review-action`.

## What this rule reports

This rule reports workflows using the dependency review action that do not listen for `pull_request`.

## Why this rule exists

Dependency review is designed to evaluate dependency changes introduced by pull requests. Requiring the `pull_request` trigger keeps the workflow aligned with that review surface.

## ❌ Incorrect

```yaml
on: [workflow_dispatch]
jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/dependency-review-action@v4
```

## ✅ Correct

```yaml
on: [pull_request]
jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/dependency-review-action@v4
```

## Additional examples

This rule does not prevent workflows from adding other triggers too. It only requires that `pull_request` be one of them when dependency review is present.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.security];
```

## When not to use it

Disable this rule if the repository runs dependency review exclusively through a reusable workflow or another workflow trigger strategy.

## Further reading

- [Customizing your dependency review action configuration](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/customizing-your-dependency-review-action-configuration)
