# require-dependabot-commit-message-prefix

> **Rule catalog ID:** R079

## Targeted pattern scope

Dependabot update entries and multi-ecosystem groups that configure `commit-message` formatting.

## What this rule reports

This rule reports update entries that do not resolve to a non-empty `commit-message.prefix`.

## Why this rule exists

Dependabot commit messages also shape pull request titles. Requiring a prefix keeps automation, filtering, and review conventions consistent across dependency update pull requests.

## ❌ Incorrect

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
    commit-message:
      prefix: "deps"
```

## Additional examples

Teams that trigger automation from pull request titles or commit conventions often use this rule to keep Dependabot updates aligned with the rest of the repository.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule when the repository intentionally relies on Dependabot's default commit message heuristics.

## Further reading

- [Dependabot options reference: commit-message](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#commit-message--)
- [Customizing Dependabot pull requests: Adding a prefix to commit messages](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/customizing-dependabot-prs#adding-a-prefix-to-commit-messages)
