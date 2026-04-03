# require-dependabot-commit-message-prefix-development

> **Rule catalog ID:** R090

## Targeted pattern scope

Dependabot update entries for ecosystems that support `commit-message.prefix-development`, including values inherited from `multi-ecosystem-groups`.

## What this rule reports

This rule reports supported update entries that do not define a non-empty `commit-message.prefix-development`.

## Why this rule exists

Development dependency updates often deserve different review and merge treatment than production dependencies. Requiring a dedicated development prefix makes that distinction visible in Dependabot commit messages and pull request titles.

## ❌ Incorrect

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    commit-message:
      prefix: "deps"
      include: "scope"
```

## ✅ Correct

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    commit-message:
      prefix: "deps"
      prefix-development: "deps-dev"
      include: "scope"
```

## Additional examples

This rule only applies to ecosystems that GitHub documents as supporting `prefix-development`, so unrelated ecosystems are ignored.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule if the repository intentionally wants identical Dependabot title prefixes for production and development dependencies.

## Further reading

- [Dependabot options reference: commit-message](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#commit-message--)
