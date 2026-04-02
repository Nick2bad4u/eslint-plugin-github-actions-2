# require-dependabot-directory

> **Rule catalog ID:** R073

## Targeted pattern scope

Entries under the top-level `updates` sequence in Dependabot configuration files.

## What this rule reports

This rule reports update entries that omit both `directory` and `directories`, define both at once, or provide only empty values.

## Why this rule exists

Dependabot needs a manifest search location for every update block. Requiring exactly one directory form keeps update intent explicit and avoids ambiguous configuration.

## ❌ Incorrect

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    schedule:
      interval: "weekly"
```

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    directories:
      - "/docs/docusaurus"
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

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directories:
      - "/"
      - "/docs/docusaurus"
    schedule:
      interval: "weekly"
```

## Additional examples

Use this rule together with monorepo-oriented Dependabot settings when some workspaces live outside the repository root and need their own manifest scan locations.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule only if another repository-specific validator already enforces directory selection semantics.

## Further reading

- [Dependabot options reference: directories or directory](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#directories-or-directory--)
- [Defining multiple locations for manifest files](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/controlling-dependencies-updated#defining-multiple-locations-for-manifest-files)
