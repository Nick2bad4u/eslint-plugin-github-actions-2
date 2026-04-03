# require-dependency-review-fail-on-severity

> **Rule catalog ID:** R093

## Targeted pattern scope

Workflow steps that use `actions/dependency-review-action`.

## What this rule reports

This rule reports dependency review action steps that omit `with.fail-on-severity`.

## Why this rule exists

Without an explicit severity threshold, the repository's vulnerability blocking posture is implicit. Requiring `fail-on-severity` makes that policy visible and reviewable in the workflow file.

## ❌ Incorrect

```yaml
jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/dependency-review-action@v4
```

## ✅ Correct

```yaml
jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/dependency-review-action@v4
        with:
          fail-on-severity: moderate
```

## Additional examples

Repositories commonly use `moderate` or stricter thresholds so dependency review blocks only meaningful risk while keeping pull request friction manageable.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.security];
```

## When not to use it

Disable this rule if the repository intentionally accepts the action's default behavior and does not want to codify a severity threshold in workflow YAML.

## Further reading

- [Customizing your dependency review action configuration](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/customizing-your-dependency-review-action-configuration)
