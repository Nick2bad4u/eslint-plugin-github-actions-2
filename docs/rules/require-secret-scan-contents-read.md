# require-secret-scan-contents-read

> **Rule catalog ID:** R107

## Targeted pattern scope

Jobs that use supported secret-scanning actions.

## What this rule reports

This rule reports secret-scanning jobs that do not grant `contents: read`.

## Why this rule exists

Secret-scanning workflows generally only need read access to repository contents. Making that permission explicit reinforces least privilege.

## ❌ Incorrect

```yaml
permissions: {}
```

## ✅ Correct

```yaml
permissions:
  contents: read
```

## Additional examples

This rule is intentionally narrow and does not try to prescribe every other permission a secret-scanning workflow may or may not need.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.security];
```

## When not to use it

Disable this rule if your scanner workflow runs in an unusual environment that truly does not need repository contents access.

## Further reading

- [GitHub Actions workflow syntax: permissions](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#permissions)
