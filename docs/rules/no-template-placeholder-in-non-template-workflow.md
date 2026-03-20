# no-template-placeholder-in-non-template-workflow

> **Rule catalog ID:** R069

## Targeted pattern scope

Regular workflow YAML files outside `workflow-templates/`.

## What this rule reports

Reports usage of `$default-branch` placeholder tokens.

## Why this rule exists

`$default-branch` is a template-only token and should not appear in normal workflow files.

## ❌ Incorrect

```yaml
on:
  push:
    branches:
      - $default-branch
```

## ✅ Correct

```yaml
on:
  push:
    branches:
      - main
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
      "github-actions/no-template-placeholder-in-non-template-workflow": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations](https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations)
