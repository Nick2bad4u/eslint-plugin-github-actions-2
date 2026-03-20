# no-write-all-permissions

> **Rule catalog ID:** R023

## Targeted pattern scope

GitHub Actions workflow YAML files that declare `permissions`.

## What this rule reports

This rule reports workflow-level or job-level `permissions: write-all` declarations.

## Why this rule exists

GitHub recommends granting the `GITHUB_TOKEN` the least access needed. The `write-all` shortcut grants every writable scope at once, which makes reviews harder and increases the blast radius of a compromised workflow or third-party action.

## ❌ Incorrect

```yaml
permissions: write-all
```

## ✅ Correct

```yaml
permissions:
  contents: read
  pull-requests: write
```


## Additional examples

For larger repositories, this rule is often enabled together with one of the published presets so violations are caught in pull requests before workflow changes are merged.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions";

export default [
  {
    files: ["**/*.{yml,yaml}"],
    plugins: {
      "github-actions": githubActions,
    },
    rules: {
      "github-actions/no-write-all-permissions": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#permissions](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#permissions)
- [https://docs.github.com/actions/security-guides/automatic-token-authentication#modifying-the-permissions-for-the-github_token](https://docs.github.com/actions/security-guides/automatic-token-authentication#modifying-the-permissions-for-the-github_token)
