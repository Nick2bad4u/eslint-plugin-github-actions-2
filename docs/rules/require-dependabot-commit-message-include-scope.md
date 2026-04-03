# require-dependabot-commit-message-include-scope

> **Rule catalog ID:** R089

## Targeted pattern scope

Dependabot `commit-message` configuration, including values inherited from `multi-ecosystem-groups`.

## What this rule reports

This rule reports update entries that do not resolve to `commit-message.include: "scope"`.

## Why this rule exists

Including scope in Dependabot commit messages makes pull request titles more informative by distinguishing production and development dependency updates. That extra context is useful for triage and automation.

## ❌ Incorrect

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    commit-message:
      prefix: "deps"
```

## ✅ Correct

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    commit-message:
      prefix: "deps"
      include: "scope"
```

## Additional examples

This rule is especially helpful when grouped updates would otherwise produce similar-looking pull request titles across dependency classes.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule if the repository intentionally prefers shorter Dependabot titles without dependency scope markers.

## Further reading

- [Dependabot options reference: commit-message](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#commit-message--)
