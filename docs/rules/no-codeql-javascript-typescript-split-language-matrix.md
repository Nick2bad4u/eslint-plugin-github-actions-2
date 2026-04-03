# no-codeql-javascript-typescript-split-language-matrix

> **Rule catalog ID:** R096

## Targeted pattern scope

CodeQL workflow jobs that use a `strategy.matrix.language` list.

## What this rule reports

This rule reports CodeQL workflows that split JavaScript and TypeScript into separate matrix values.

## Why this rule exists

CodeQL treats JavaScript and TypeScript as the same extractor family. Using separate `javascript` and `typescript` matrix entries is redundant and makes the workflow look more language-specific than it really is.

## ❌ Incorrect

```yaml
strategy:
  matrix:
    language: ["javascript", "typescript"]
```

## ✅ Correct

```yaml
strategy:
  matrix:
    language: ["javascript-typescript"]
```

## Additional examples

This rule is deliberately narrow: it focuses on the common JS/TS split-matrix mistake rather than trying to rewrite every possible CodeQL language expression.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.codeScanning];
```

## When not to use it

Disable this rule only if your repository intentionally prefers the redundant split for human readability and accepts the extra workflow noise.

## Further reading

- [About code scanning with CodeQL](https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql)
