# require-secret-scan-schedule

> **Rule catalog ID:** R106

## Targeted pattern scope

Workflows that use supported secret-scanning actions.

## What this rule reports

This rule reports secret-scanning workflows that do not define a `schedule` trigger.

## Why this rule exists

Scheduled secret scanning catches leaks even when no recent pull request or push event happens on the affected branch.

## ❌ Incorrect

```yaml
on: [pull_request]
```

## ✅ Correct

```yaml
on:
  pull_request:
  schedule:
    - cron: "12 4 * * *"
```

## Additional examples

This rule does not enforce a particular cron expression, only that periodic scanning exists.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.security];
```

## When not to use it

Disable this rule if scheduled secret scanning is handled outside GitHub Actions.

## Further reading

- [GitHub Actions workflow syntax: schedule](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onschedule)
