# require-secret-scan-fetch-depth-zero

> **Rule catalog ID:** R105

## Targeted pattern scope

Jobs that use secret-scanning actions such as Gitleaks or TruffleHog.

## What this rule reports

This rule reports secret-scanning jobs that do not checkout repository history with `fetch-depth: 0`.

## Why this rule exists

Secret scanners are most effective when they can inspect full repository history rather than only the latest commit range.

## ❌ Incorrect

```yaml
- uses: actions/checkout@v6
```

## ✅ Correct

```yaml
- uses: actions/checkout@v6
  with:
    fetch-depth: 0
```

## Additional examples

This rule is job-scoped, so it only checks jobs that actually run the supported secret scanners.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.security];
```

## When not to use it

Disable this rule if your secret scanning workflow is intentionally limited to shallow history or event-specific diffs.

## Further reading

- [Gitleaks Action](https://github.com/gitleaks/gitleaks-action)
- [TruffleHog Action](https://github.com/trufflesecurity/trufflehog)
