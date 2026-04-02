# require-dependabot-schedule-timezone

> **Rule catalog ID:** R076

## Targeted pattern scope

Dependabot schedule mappings that use `time` or `cron` semantics, including values inherited from `multi-ecosystem-groups`.

## What this rule reports

This rule reports schedule blocks that require timezone context but omit `schedule.timezone`.

## Why this rule exists

Without a timezone, explicit times default to UTC. Requiring `timezone` makes scheduled runs match local operational intent instead of silently shifting around daylight saving or team-region assumptions.

## ❌ Incorrect

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      time: "05:30"
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
      timezone: "America/Detroit"
```

## Additional examples

When teams operate outside UTC, this rule prevents silent schedule drift caused by assuming everyone reads `time` values in the same timezone.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule if the repository intentionally standardizes all Dependabot schedules on implicit UTC.

## Further reading

- [Dependabot options reference: schedule.timezone](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#schedule-)
- [List of tz database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
