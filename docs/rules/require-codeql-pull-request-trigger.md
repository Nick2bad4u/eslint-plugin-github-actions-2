# require-codeql-pull-request-trigger

> **Rule catalog ID:** R100

## Targeted pattern scope

Workflows that run CodeQL analysis.

## What this rule reports

This rule reports CodeQL workflows that do not listen for `pull_request`.

## Why this rule exists

Code scanning is most actionable when it runs against pull requests before merges happen. Requiring the PR trigger keeps CodeQL feedback in the developer loop.

## ❌ Incorrect

```yaml
on:
  push:
    branches: [main]
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

This rule only checks workflows that actually use CodeQL actions; it will not report on unrelated scheduled security workflows.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.codeScanning];
```

## When not to use it

Disable this rule if your repository intentionally runs CodeQL only outside pull requests, for example in an external CI system.

## Further reading

- [About code scanning with CodeQL](https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql)
