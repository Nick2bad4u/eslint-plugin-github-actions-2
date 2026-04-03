# require-codeql-branch-filters

> **Rule catalog ID:** R113

## Targeted pattern scope

CodeQL workflows that define `push` or `pull_request` triggers as mappings.

## What this rule reports

This rule reports CodeQL `push` or `pull_request` triggers that do not define a non-empty `branches` or `branches-ignore` filter.

## Why this rule exists

Code scanning on every branch may be intentional, but for most repositories CodeQL is scoped to the main development branches. Requiring an explicit branch filter makes that intent visible and keeps trigger breadth reviewable.

## ❌ Incorrect

```yaml
on:
  push: {}
  pull_request: {}
```

## ✅ Correct

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

## Additional examples

This rule only checks CodeQL workflows and only when the trigger is expressed as a mapping where branch filters are supported.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.codeScanning];
```

## When not to use it

Disable this rule if your repository intentionally wants CodeQL to react to every branch and that policy is already understood by maintainers.

## Further reading

- [About code scanning with CodeQL](https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql)
