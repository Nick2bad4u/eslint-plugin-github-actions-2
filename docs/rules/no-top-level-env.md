# no-top-level-env

> **Rule catalog ID:** R013

## Targeted pattern scope

GitHub Actions workflow YAML files that declare `env` at the top level.

## What this rule reports

This rule reports workflows that define a top-level `env` block.

## Why this rule exists

Top-level environment variables affect every job and can hide which parts of a workflow actually depend on a variable. Narrower scoping keeps workflow behavior easier to audit.

## ❌ Incorrect

```yaml
env:
  NODE_ENV: production
```

## ✅ Correct

```yaml
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    env:
      NODE_ENV: production
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
      "github-actions/no-top-level-env": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#env](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#env)
- [https://docs.github.com/actions/learn-github-actions/variables](https://docs.github.com/actions/learn-github-actions/variables)
