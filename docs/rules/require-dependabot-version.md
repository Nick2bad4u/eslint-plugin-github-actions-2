# require-dependabot-version

> **Rule catalog ID:** R070

## Targeted pattern scope

Repository Dependabot configuration files at `.github/dependabot.yml` or `.github/dependabot.yaml`.

## What this rule reports

This rule reports Dependabot configuration files that omit the top-level `version` key or set it to anything other than `2`.

## Why this rule exists

Dependabot configuration files must use schema version `2`. Omitting the key or using a different value makes the file invalid and prevents Dependabot from interpreting later settings reliably.

## ❌ Incorrect

```yaml
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

```yaml
version: 1
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
    schedule:
      interval: "weekly"
```

## Additional examples

This rule pairs well with `require-dependabot-updates` so the file always declares both the schema version and at least one update block.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule only if you do not lint Dependabot configuration files with this plugin.

## Further reading

- [Dependabot options reference: Required keys](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#required-keys)
- [Configuring Dependabot version updates](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configuring-dependabot-version-updates)
