# require-dependabot-schedule-cronjob

> **Rule catalog ID:** R083

## Targeted pattern scope

Dependabot schedule mappings that use `interval: "cron"`, including schedules inherited from `multi-ecosystem-groups`.

## What this rule reports

This rule reports two cases:

- `interval: "cron"` without a non-empty `cronjob`
- non-cron intervals that still define `cronjob`

## Why this rule exists

`cronjob` is meaningful only when Dependabot is configured with `interval: "cron"`. Requiring it in cron mode and forbidding it elsewhere keeps schedule intent explicit and avoids configuration that looks more precise than Dependabot will actually honor.

## ❌ Incorrect

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "cron"
      timezone: "UTC"
```

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      cronjob: "0 9 * * *"
```

## ✅ Correct

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "cron"
      cronjob: "0 9 * * *"
      timezone: "UTC"
```

## Additional examples

This rule complements `require-dependabot-schedule-time` and `require-dependabot-schedule-timezone` by covering the schedule branch where `cronjob` replaces `time`.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule only if the repository bans cron-based schedules and enforces that policy with a different rule set.

## Further reading

- [Dependabot options reference: schedule](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#schedule-)
- [Dependabot options reference: schedule.cronjob](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#schedule-)
