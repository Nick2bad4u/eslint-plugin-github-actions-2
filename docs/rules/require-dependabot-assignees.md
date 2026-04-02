# require-dependabot-assignees

> **Rule catalog ID:** R077

## Targeted pattern scope

Dependabot update entries and multi-ecosystem groups that control pull request ownership.

## What this rule reports

This rule reports update entries that do not resolve to a non-empty `assignees` list, either directly or via `multi-ecosystem-groups` inheritance.

## Why this rule exists

Dependabot pull requests are easy to ignore when they are unowned. Requiring assignees makes update responsibility explicit and improves triage speed.

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
    assignees:
      - "octocat"
```

## Additional examples

This rule also accepts assignees inherited from a `multi-ecosystem-group`, which is often the cleanest way to keep ownership consistent across multiple update entries.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule when ownership is handled exclusively through CODEOWNERS, bots, or external automation and explicit assignees would be noisy.

## Further reading

- [Dependabot options reference: assignees](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#assignees--)
- [Customizing Dependabot pull requests: Automatically adding assignees](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/customizing-dependabot-prs#automatically-adding-assignees)
