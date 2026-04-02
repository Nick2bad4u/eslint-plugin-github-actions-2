# require-dependabot-updates

> **Rule catalog ID:** R071

## Targeted pattern scope

Repository Dependabot configuration files at `.github/dependabot.yml` or `.github/dependabot.yaml`.

## What this rule reports

This rule reports files that omit the top-level `updates` key or define it as an empty sequence.

## Why this rule exists

`updates` is the section where Dependabot is told which ecosystems to maintain. Without at least one update entry, the configuration is syntactically present but operationally useless.

## ❌ Incorrect

```yaml
version: 2
```

```yaml
version: 2
updates: []
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

On repositories with multiple ecosystems, this rule helps ensure Dependabot stays enabled even after refactors remove one update block and forget to add its replacement.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule only when `.github/dependabot.yml` is intentionally not used in the repository.

## Further reading

- [Dependabot options reference: Required keys](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#required-keys)
- [Example dependabot.yml file](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configuring-dependabot-version-updates#example-dependabotyml-file)
