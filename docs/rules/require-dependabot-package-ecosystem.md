# require-dependabot-package-ecosystem

> **Rule catalog ID:** R072

## Targeted pattern scope

Entries under the top-level `updates` sequence in Dependabot configuration files.

## What this rule reports

This rule reports `updates` entries that are not mappings, or mappings that omit a non-empty `package-ecosystem`.

## Why this rule exists

Dependabot cannot resolve package-manager-specific behavior without knowing the ecosystem for each update block. Missing `package-ecosystem` means the rest of the block has no clear target.

## ❌ Incorrect

```yaml
version: 2
updates:
  - directory: "/"
    schedule:
      interval: "weekly"
```

## ✅ Correct

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

## Additional examples

This rule is especially helpful when large `updates` blocks are copied and edited by hand, since missing `package-ecosystem` is easy to overlook in repetitive YAML.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

If you already validate Dependabot files against a stricter schema elsewhere, this rule can be redundant.

## Further reading

- [Dependabot options reference: package-ecosystem](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#package-ecosystem-)
- [Dependabot options reference: Required keys](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#required-keys)
