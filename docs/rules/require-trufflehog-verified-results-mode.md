# require-trufflehog-verified-results-mode

> **Rule catalog ID:** R108

## Targeted pattern scope

Workflow steps that use the TruffleHog GitHub Action.

## What this rule reports

This rule reports TruffleHog steps that do not configure `extra_args` to include `--results=verified`.

## Why this rule exists

Verified-results mode reduces noise by failing only on findings that the scanner can verify more confidently.

## ❌ Incorrect

```yaml
- uses: trufflesecurity/trufflehog@v3
```

## ✅ Correct

```yaml
- uses: trufflesecurity/trufflehog@v3
  with:
    extra_args: --results=verified
```

## Additional examples

This rule still allows additional TruffleHog flags as long as the verified-results mode is present.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.security];
```

## When not to use it

Disable this rule if your repository intentionally wants broader TruffleHog results despite the extra noise.

## Further reading

- [TruffleHog Action](https://github.com/trufflesecurity/trufflehog)
