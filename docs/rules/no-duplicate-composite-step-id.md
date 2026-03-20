# no-duplicate-composite-step-id

> **Rule catalog ID:** R051

## Targeted pattern scope

Composite action `runs.steps[*].id` declarations.

## What this rule reports

Reports duplicate step IDs in composite actions.

## Why this rule exists

Duplicate step IDs create ambiguous references and break output wiring.

## ❌ Incorrect

```yaml
runs:
  using: composite
  steps:
    - id: setup
      run: echo one
      shell: bash
    - id: setup
      run: echo two
      shell: bash
```

## ✅ Correct

```yaml
runs:
  using: composite
  steps:
    - id: setup
      run: echo one
      shell: bash
    - id: finish
      run: echo two
      shell: bash
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
      "github-actions/no-duplicate-composite-step-id": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#runs-for-composite-actions](https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#runs-for-composite-actions)
