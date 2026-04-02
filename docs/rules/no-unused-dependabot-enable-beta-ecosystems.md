# no-unused-dependabot-enable-beta-ecosystems

> **Rule catalog ID:** R085

## Targeted pattern scope

Top-level Dependabot configuration keys in `.github/dependabot.yml`.

## What this rule reports

This rule reports the top-level `enable-beta-ecosystems` key whenever it is present.

## Why this rule exists

GitHub currently documents `enable-beta-ecosystems` as "not currently in use." Keeping it in the file suggests behavior that Dependabot does not actually honor, which adds noise and misleads maintainers reviewing the configuration.

## ❌ Incorrect

```yaml
version: 2
enable-beta-ecosystems: true
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

This rule is especially helpful in repositories that were initialized from older Dependabot snippets and still carry forward unused top-level keys.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule only if GitHub later gives `enable-beta-ecosystems` active behavior and the repository intentionally adopts that updated contract before this plugin is updated.

## Further reading

- [Dependabot options reference: enable-beta-ecosystems](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#enable-beta-ecosystems-)
- [Dependabot options reference](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference)
