# no-unknown-dependabot-multi-ecosystem-group

> **Rule catalog ID:** R081

## Targeted pattern scope

Dependabot `updates[*].multi-ecosystem-group` references in `.github/dependabot.yml` files.

## What this rule reports

This rule reports update entries that reference a `multi-ecosystem-group` name that is not declared under the top-level `multi-ecosystem-groups` mapping.

## Why this rule exists

A missing group definition is a configuration bug, not just a style preference. When the referenced group does not exist, inherited settings such as schedule, labels, assignees, and target branch cannot resolve correctly, and later rule failures become noisy symptoms instead of the real root cause.

## ❌ Incorrect

```yaml
version: 2
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

This rule is especially helpful when a group is renamed and not every update entry is migrated in the same commit.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule only if Dependabot files are validated by a stricter schema-aware tool before lint runs.

## Further reading

- [Configuring multi-ecosystem updates for Dependabot](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/configuring-multi-ecosystem-updates)
- [Dependabot options reference: multi-ecosystem-groups](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#multi-ecosystem-groups-)
