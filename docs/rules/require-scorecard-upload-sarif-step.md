# require-scorecard-upload-sarif-step

> **Rule catalog ID:** R104

## Targeted pattern scope

Workflows that use `ossf/scorecard-action`.

## What this rule reports

This rule reports Scorecard workflows that do not upload SARIF results with `github/codeql-action/upload-sarif`.

## Why this rule exists

Generating SARIF without uploading it leaves the code scanning integration incomplete. Requiring the upload step helps repositories actually surface Scorecard findings in GitHub.

## ❌ Incorrect

```yaml
- uses: ossf/scorecard-action@v2
  with:
    results_format: sarif
```

## ✅ Correct

```yaml
- uses: ossf/scorecard-action@v2
  with:
    results_format: sarif

- uses: github/codeql-action/upload-sarif@v4
  with:
    sarif_file: results.sarif
```

## Additional examples

This rule does not require a specific SARIF filename, only that an upload step exists.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.codeScanning];
```

## When not to use it

Disable this rule if SARIF upload is handled by a reusable workflow or another job outside the current file.

## Further reading

- [OpenSSF Scorecard Action](https://github.com/ossf/scorecard-action)
