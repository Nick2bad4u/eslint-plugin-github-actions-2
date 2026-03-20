# prefer-fail-fast

> **Rule catalog ID:** R015

## Targeted pattern scope

GitHub Actions workflow YAML files that use matrix strategies.

## What this rule reports

This rule reports jobs that explicitly set `strategy.fail-fast` to `false`.

## Why this rule exists

Leaving fail-fast enabled can save runner time and reduce queue pressure when one matrix job already proves the matrix is failing.

## ❌ Incorrect

```yaml
jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        node: [20, 22]
```

## ✅ Correct

```yaml
jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    strategy:
      fail-fast: true
      matrix:
        node: [20, 22]
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
      "github-actions/prefer-fail-fast": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/using-jobs/using-a-matrix-for-your-jobs](https://docs.github.com/actions/using-jobs/using-a-matrix-for-your-jobs)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstrategy](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstrategy)
