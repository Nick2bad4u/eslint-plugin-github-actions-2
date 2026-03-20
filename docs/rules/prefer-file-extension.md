# prefer-file-extension

> **Rule catalog ID:** R020

## Targeted pattern scope

GitHub Actions workflow YAML files under `.github/workflows/`.

## What this rule reports

This rule reports workflow files whose extension does not match the configured preference.

## Why this rule exists

Using one workflow file extension consistently keeps repositories easier to scan, search, and script against. It also avoids needless churn from mixed `.yml` and `.yaml` naming styles.

## ❌ Incorrect

```yaml
# .github/workflows/release.yaml
name: Release
on:
  workflow_dispatch:
```

## ✅ Correct

```yaml
# .github/workflows/release.yml
name: Release
on:
  workflow_dispatch:
```

## Behavior and migration notes

### Default behavior

With the default configuration, this rule expects workflow files to use the `.yml` extension.

### `{ "extension": "yaml" }`

Use this option to enforce `.yaml` instead.

### `{ "caseSensitive": false }`

Use this option when you want extension matching to ignore case differences in repository paths.


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
      "github-actions/prefer-file-extension": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax)
