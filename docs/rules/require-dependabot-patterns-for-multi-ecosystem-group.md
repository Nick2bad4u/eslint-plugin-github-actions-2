# require-dependabot-patterns-for-multi-ecosystem-group

> **Rule catalog ID:** R082

## Targeted pattern scope

Dependabot update entries that opt into `multi-ecosystem-group`.

## What this rule reports

This rule reports grouped update entries that do not declare a non-empty `patterns` list.

## Why this rule exists

GitHub's multi-ecosystem update guide calls out `patterns` as a required part of assigning ecosystems to a group. Without patterns, the grouping intent is underspecified and Dependabot may not consolidate updates the way the configuration suggests.

## ❌ Incorrect

```yaml
version: 2
multi-ecosystem-groups:
  app:
    schedule:
      interval: "weekly"

updates:
  - package-ecosystem: "npm"
    directory: "/"
    multi-ecosystem-group: "app"
```

## ✅ Correct

```yaml
version: 2
multi-ecosystem-groups:
  app:
    schedule:
      interval: "weekly"

updates:
  - package-ecosystem: "npm"
    directory: "/"
    multi-ecosystem-group: "app"
    patterns: ["*"]
```

## Additional examples

Use `patterns: ["*"]` when the goal is to group every dependency in that ecosystem rather than a narrower allowlist.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule only if the repository intentionally avoids multi-ecosystem updates entirely.

## Further reading

- [Configuring multi-ecosystem updates for Dependabot](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/configuring-multi-ecosystem-updates)
- [Dependabot options reference: multi-ecosystem-groups](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#multi-ecosystem-groups-)
