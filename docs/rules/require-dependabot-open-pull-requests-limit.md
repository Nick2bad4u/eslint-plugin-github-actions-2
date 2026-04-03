# require-dependabot-open-pull-requests-limit

> **Rule catalog ID:** R087

## Targeted pattern scope

Dependabot update entries in `.github/dependabot.yml`.

## What this rule reports

This rule reports update entries that do not define `open-pull-requests-limit`.

## Why this rule exists

Dependabot defaults can be reasonable, but they are still implicit. Requiring an explicit open pull request limit makes update volume a deliberate repository policy.

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
    open-pull-requests-limit: 5
    schedule:
      interval: "weekly"
```

## Additional examples

This rule works well with grouped updates because the repository can cap Dependabot volume even when multiple manifests are monitored.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule if the repository intentionally relies on Dependabot's built-in default PR limit.

## Further reading

- [Dependabot options reference: open-pull-requests-limit](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#open-pull-requests-limit-)
