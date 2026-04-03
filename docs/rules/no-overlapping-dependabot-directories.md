# no-overlapping-dependabot-directories

> **Rule catalog ID:** R095

## Targeted pattern scope

Dependabot directory selectors declared by `directory` or `directories` for update entries that share the same package ecosystem and effective target branch.

## What this rule reports

This rule reports guaranteed overlaps between directory selectors for the same package ecosystem and target branch.

It intentionally focuses on high-confidence overlaps such as:

- duplicate exact selectors
- exact selectors matched by a glob selector in another update entry

## Why this rule exists

GitHub recommends avoiding overlapping directory definitions when you split one ecosystem across multiple Dependabot update entries. Overlaps can cause ambiguous ownership of manifest locations and make configuration review harder.

## ❌ Incorrect

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"

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
      - "/packages/*"
    schedule:
      interval: "weekly"

  - package-ecosystem: "npm"
    directory: "/packages/app"
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

  - package-ecosystem: "npm"
    directory: "/docs/docusaurus"
    schedule:
      interval: "weekly"
```

## Additional examples

This rule compares entries only within the same package ecosystem and target branch, so separate ecosystems can still reuse the same directory string without triggering a report.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule if the repository intentionally uses overlapping selectors and accepts the maintenance ambiguity that comes with them.

## Further reading

- [Dependabot options reference: directories or directory](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#directories-or-directory--)
