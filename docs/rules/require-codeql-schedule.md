# require-codeql-schedule

> **Rule catalog ID:** R101

## Targeted pattern scope

Workflows that run CodeQL analysis.

## What this rule reports

This rule reports CodeQL workflows that do not define a `schedule` trigger.

## Why this rule exists

Scheduled CodeQL runs catch newly added queries, engine improvements, and baseline issues that may not be re-evaluated often enough through push-only activity.

## ❌ Incorrect

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

## ✅ Correct

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: "0 0 * * 1"
```

## Additional examples

This rule does not enforce a particular cron expression. It only requires that periodic re-analysis be configured.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.codeScanning];
```

## When not to use it

Disable this rule if CodeQL scheduling is handled outside GitHub Actions or by organization-wide automation.

## Further reading

- [About code scanning with CodeQL](https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql)
