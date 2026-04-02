# require-dependabot-schedule-interval

> **Rule catalog ID:** R074

## Targeted pattern scope

`updates[*].schedule.interval` values in Dependabot configuration files, including values inherited from `multi-ecosystem-groups`.

## What this rule reports

This rule reports update entries that do not resolve to a valid `schedule.interval` value.

## Why this rule exists

`schedule.interval` is a required Dependabot setting. Requiring a supported value keeps update frequency explicit and avoids accidental reliance on invalid or misspelled scheduling keys.

## ❌ Incorrect

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule: {}
```

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "sometimes"
```

## ✅ Correct

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

## Additional examples

This rule also accepts valid intervals inherited from `multi-ecosystem-groups`, so grouped configurations do not need to duplicate schedule frequency on every update block.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule only when Dependabot files are not part of the lint surface for the repository.

## Further reading

- [Dependabot options reference: schedule](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#schedule-)
- [Dependabot options reference: Required keys](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#required-keys)
