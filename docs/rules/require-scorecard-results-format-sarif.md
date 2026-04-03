# require-scorecard-results-format-sarif

> **Rule catalog ID:** R103

## Targeted pattern scope

Workflow steps that use `ossf/scorecard-action`.

## What this rule reports

This rule reports Scorecard action steps that do not set `results_format: sarif`.

## Why this rule exists

If a repository wants Scorecard findings to flow into GitHub code scanning, SARIF is the correct results format. Requiring it makes the upload contract explicit.

## ❌ Incorrect

```yaml
- uses: ossf/scorecard-action@v2
```

## ✅ Correct

```yaml
- uses: ossf/scorecard-action@v2
  with:
    results_format: sarif
```

## Additional examples

This rule pairs naturally with `require-scorecard-upload-sarif-step`, which ensures the generated SARIF is actually published.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.codeScanning];
```

## When not to use it

Disable this rule if your Scorecard workflow intentionally produces non-SARIF output for another destination.

## Further reading

- [OpenSSF Scorecard Action](https://github.com/ossf/scorecard-action)
