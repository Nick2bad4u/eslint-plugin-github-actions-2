# require-dependabot-cooldown

> **Rule catalog ID:** R086

## Targeted pattern scope

Dependabot update entries in `.github/dependabot.yml`.

## What this rule reports

This rule reports update entries that omit the `cooldown` key.

## Why this rule exists

Cooldown settings reduce noisy pull request churn by delaying fresh version updates for a defined period. Requiring the key makes update pacing an explicit policy decision instead of an accidental default.

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
    cooldown:
      default-days: 3
    schedule:
      interval: "weekly"
```

## Additional examples

Teams that prefer fewer routine Dependabot pull requests often combine cooldown with grouped updates and explicit pull request limits.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule if the repository intentionally wants Dependabot to consider each new release immediately.

## Further reading

- [Dependabot options reference: cooldown](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#cooldown-)
