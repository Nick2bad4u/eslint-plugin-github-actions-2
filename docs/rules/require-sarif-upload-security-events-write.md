# require-sarif-upload-security-events-write

> **Rule catalog ID:** R102

## Targeted pattern scope

Jobs that use `github/codeql-action/upload-sarif`.

## What this rule reports

This rule reports SARIF upload jobs that do not grant `security-events: write`.

## Why this rule exists

Uploading SARIF to GitHub code scanning requires `security-events: write`. Requiring it explicitly keeps workflow permissions correct and reviewable.

## ❌ Incorrect

```yaml
permissions:
  contents: read
```

## ✅ Correct

```yaml
permissions:
  contents: read
  security-events: write
```

## Additional examples

This rule applies to any SARIF uploader step using `github/codeql-action/upload-sarif`, not just CodeQL-native workflows.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.codeScanning];
```

## When not to use it

Disable this rule only if the uploader step is never intended to publish SARIF into GitHub code scanning.

## Further reading

- [About code scanning with CodeQL](https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql)
