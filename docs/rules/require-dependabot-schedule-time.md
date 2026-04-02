# require-dependabot-schedule-time

> **Rule catalog ID:** R075

## Targeted pattern scope

Non-`cron` schedule mappings in Dependabot update entries, including schedule settings inherited from `multi-ecosystem-groups`.

## What this rule reports

This rule reports update entries that use a non-`cron` interval without declaring `schedule.time`.

## Why this rule exists

GitHub assigns a random execution time when `time` is omitted. Requiring an explicit time makes Dependabot activity predictable and easier to coordinate with release windows and CI load.

## ❌ Incorrect

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

## ✅ Correct

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      time: "05:30"
      timezone: "UTC"
```

## Additional examples

Repositories that want quieter daytime CI load often use this rule to keep Dependabot runs in an off-hours maintenance window.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule if random Dependabot run times are acceptable for the repository.

## Further reading

- [Dependabot options reference: schedule.time](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#schedule-)
- [Optimizing the creation of pull requests for Dependabot version updates](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/optimizing-pr-creation-version-updates)
