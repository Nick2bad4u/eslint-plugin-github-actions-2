# require-codeql-actions-read

> **Rule catalog ID:** R099

## Targeted pattern scope

Jobs that use CodeQL actions such as `init`, `analyze`, `autobuild`, or `upload-sarif`.

## What this rule reports

This rule reports CodeQL jobs that do not grant `actions: read`.

## Why this rule exists

CodeQL jobs commonly need `actions: read` for workflow metadata and action access. Requiring it explicitly keeps job permissions self-documenting and consistent.

## ❌ Incorrect

```yaml
permissions:
  contents: read
```

## ✅ Correct

```yaml
permissions:
  actions: read
  contents: read
```

## Additional examples

This rule is job-scoped: it only evaluates jobs that actually use CodeQL actions, not unrelated workflow jobs.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.codeScanning];
```

## When not to use it

Disable this rule if your CodeQL setup demonstrably works without `actions: read` and you intentionally prefer the smaller permission set.

## Further reading

- [About code scanning with CodeQL](https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql)
