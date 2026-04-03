# require-codeql-security-events-write

> **Rule catalog ID:** R098

## Targeted pattern scope

Jobs that run `github/codeql-action/analyze`.

## What this rule reports

This rule reports CodeQL analysis jobs that do not grant `security-events: write`.

## Why this rule exists

CodeQL analysis uploads results to GitHub code scanning. Without `security-events: write`, those results cannot be published correctly.

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

This rule complements `require-sarif-upload-security-events-write` by covering CodeQL analysis jobs directly, even when they do not use a separate SARIF upload step.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.codeScanning];
```

## When not to use it

Disable this rule only if CodeQL results are uploaded through a different mechanism outside the workflow.

## Further reading

- [About code scanning with CodeQL](https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql)
