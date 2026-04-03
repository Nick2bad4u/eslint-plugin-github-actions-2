# require-dependabot-versioning-strategy-for-npm

> **Rule catalog ID:** R088

## Targeted pattern scope

Dependabot update entries with `package-ecosystem: "npm"`.

## What this rule reports

This rule reports npm update entries that omit `versioning-strategy`.

## Why this rule exists

`versioning-strategy` changes how Dependabot edits package manifests and lockfiles. Requiring the key makes npm range update behavior explicit, which is especially useful in monorepos and libraries with stricter dependency policies.

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
    versioning-strategy: "increase"
    schedule:
      interval: "weekly"
```

## Additional examples

For application repositories, `increase` is a common choice because it keeps package ranges aligned with the updated resolved version.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule if the repository intentionally accepts Dependabot's default versioning strategy heuristics for npm.

## Further reading

- [Dependabot options reference: versioning-strategy](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#versioning-strategy--)
