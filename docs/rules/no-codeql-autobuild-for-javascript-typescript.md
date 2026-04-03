# no-codeql-autobuild-for-javascript-typescript

> **Rule catalog ID:** R097

## Targeted pattern scope

CodeQL workflows that only scan JavaScript/TypeScript.

## What this rule reports

This rule reports `github/codeql-action/autobuild` steps when the workflow only scans JavaScript/TypeScript.

## Why this rule exists

CodeQL does not need a build step for JavaScript/TypeScript analysis. Keeping `autobuild` in JS/TS-only workflows adds noise and can mislead maintainers into thinking a compiled-language build is required.

## ❌ Incorrect

```yaml
- uses: github/codeql-action/init@v4
  with:
    languages: javascript-typescript

- uses: github/codeql-action/autobuild@v4
```

## ✅ Correct

```yaml
- uses: github/codeql-action/init@v4
  with:
    languages: javascript-typescript

- uses: github/codeql-action/analyze@v4
```

## Additional examples

If a repository later adds a compiled language to the same CodeQL job, this rule will stop reporting as long as the workflow language set is no longer JS/TS-only.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.codeScanning];
```

## When not to use it

Disable this rule if a repository intentionally keeps `autobuild` in place as documentation despite it being unnecessary for JS/TS analysis.

## Further reading

- [Preparing your code for CodeQL analysis](https://docs.github.com/en/code-security/code-scanning/using-codeql-code-scanning-with-your-existing-ci-system/configuring-codeql-cli-in-your-ci-system)
