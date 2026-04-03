# require-codeql-category-when-language-matrix

> **Rule catalog ID:** R114

## Targeted pattern scope

CodeQL analyze steps inside jobs that use `strategy.matrix.language`.

## What this rule reports

This rule reports CodeQL analyze steps that do not set `with.category` to include `matrix.language` when the job uses a language matrix.

## Why this rule exists

When CodeQL runs in a language matrix, the SARIF category is the easiest way to keep uploads distinct and understandable in the code scanning UI. Requiring a matrix-aware category helps avoid ambiguous result grouping.

## ❌ Incorrect

```yaml
- uses: github/codeql-action/analyze@v4
```

## ✅ Correct

```yaml
- uses: github/codeql-action/analyze@v4
  with:
    category: /language:${{ matrix.language }}
```

## Additional examples

This rule only applies when the job uses a `language` matrix. Single-language CodeQL jobs are ignored.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.codeScanning];
```

## When not to use it

Disable this rule if your repository intentionally accepts a shared category across matrix jobs and that grouping has already been reviewed.

## Further reading

- [About code scanning with CodeQL](https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql)
