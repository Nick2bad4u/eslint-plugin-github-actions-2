# require-dependabot-open-pull-requests-limit

> **Rule catalog ID:** R087

## Targeted pattern scope

Standalone Dependabot update entries in `.github/dependabot.yml` that do not use `multi-ecosystem-group`.

## What this rule reports

This rule reports standalone update entries that do not define `open-pull-requests-limit`.

It also reports grouped configurations that set `open-pull-requests-limit` on either the update entry or the referenced multi-ecosystem group.

## Why this rule exists

Dependabot defaults can be reasonable, but they are still implicit. Requiring an explicit open pull request limit makes update volume a deliberate repository policy.

Updates that use `multi-ecosystem-group` are intentionally excluded. GitHub creates a single pull request per multi-ecosystem group, so `open-pull-requests-limit` does not apply there and should not be set.

## ❌ Incorrect

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

```yaml
version: 2
multi-ecosystem-groups:
  app:
    open-pull-requests-limit: 5
updates:
  - package-ecosystem: "npm"
    directory: "/"
    multi-ecosystem-group: "app"
    schedule:
      interval: "weekly"
```

## ✅ Correct

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    open-pull-requests-limit: 5
    schedule:
      interval: "weekly"
```

## Additional examples

This rule is intentionally limited to standalone update entries. Grouped updates already consolidate into one pull request per multi-ecosystem group.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule if the repository intentionally relies on Dependabot's built-in default PR limit for standalone updates.

## Further reading

- [Dependabot options reference: open-pull-requests-limit](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#open-pull-requests-limit-)
