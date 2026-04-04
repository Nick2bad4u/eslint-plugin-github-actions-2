# require-dependabot-github-actions-directory-root

> **Rule catalog ID:** R084

## Targeted pattern scope

Dependabot update entries that use `package-ecosystem: "github-actions"`.

## What this rule reports

This rule reports GitHub Actions ecosystem entries that do not use `directory: "/"` exactly, or that try to use `directories` instead.

## Why this rule exists

GitHub documents `directory: "/"` as the correct location for the `github-actions` ecosystem. Dependabot uses that root setting to scan the standard workflow directory and root action metadata locations. Using a narrower or alternate directory is misleading and can cause missed updates.

## ❌ Incorrect

```yaml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/.github/workflows"
    schedule:
      interval: "weekly"
```

## ✅ Correct

```yaml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

## Behavior and migration notes

The autofixer rewrites GitHub Actions ecosystem entries to the canonical `directory: "/"` form. If the entry incorrectly uses `directories`, the fix replaces that block with the single documented `directory` key because that is the only supported location for `package-ecosystem: "github-actions"`.

## Additional examples

This rule is a good fit for repositories that maintain both workflow YAML and root-level composite or JavaScript actions, because the documented root scan location covers both surfaces.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule only if GitHub changes the documented scan behavior for the `github-actions` ecosystem and the repository intentionally follows that newer contract.

## Further reading

- [Dependabot options reference: directories or directory](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#directories-or-directory--)
- [Example dependabot.yml file](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configuring-dependabot-version-updates#example-dependabotyml-file)
