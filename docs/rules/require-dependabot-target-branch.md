# require-dependabot-target-branch

> **Rule catalog ID:** R078

## Targeted pattern scope

Dependabot update entries and multi-ecosystem groups that decide where version-update pull requests land.

## What this rule reports

This rule reports update entries that do not resolve to a non-empty `target-branch`.

## Why this rule exists

Repositories with release trains or stabilization branches often want Dependabot changes routed predictably. Requiring `target-branch` removes ambiguity and documents the intended update flow directly in configuration.

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
    target-branch: "main"
```

## Additional examples

This rule is most useful in repositories that validate dependency updates on a dedicated integration branch before merging into the default branch.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule if the repository intentionally wants Dependabot to always use the default branch implicitly.

## Further reading

- [Dependabot options reference: target-branch](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#target-branch-)
- [Customizing Dependabot pull requests: Targeting pull requests against a non-default branch](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/customizing-dependabot-prs#targeting-pull-requests-against-a-non-default-branch)
