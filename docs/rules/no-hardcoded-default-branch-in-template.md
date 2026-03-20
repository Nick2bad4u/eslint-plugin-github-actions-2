# no-hardcoded-default-branch-in-template

> **Rule catalog ID:** R068

## Targeted pattern scope

Workflow template YAML files under `workflow-templates/`.

## What this rule reports

Reports hardcoded `main` and `master` branch literals.

## Why this rule exists

Template workflows should use `$default-branch` so generated workflows match the target repository.

## ❌ Incorrect

```yaml
on:
  push:
    branches:
      - main
```

## ✅ Correct

```yaml
on:
  push:
    branches:
      - $default-branch
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
      "github-actions/no-hardcoded-default-branch-in-template": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations](https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations)
