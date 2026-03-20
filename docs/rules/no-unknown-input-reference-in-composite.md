# no-unknown-input-reference-in-composite

> **Rule catalog ID:** R050

## Targeted pattern scope

Composite action metadata strings that reference `inputs.<id>`.

## What this rule reports

Reports `inputs.<id>` references when `<id>` is not declared under `inputs`.

## Why this rule exists

Typos in input references make composite actions behave incorrectly at runtime.

## ❌ Incorrect

```yaml
inputs:
  token:
    description: Token
runs:
  using: composite
  steps:
    - run: echo "${{ inputs.tokne }}"
      shell: bash
```

## ✅ Correct

```yaml
inputs:
  token:
    description: Token
runs:
  using: composite
  steps:
    - run: echo "${{ inputs.token }}"
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
      "github-actions/no-unknown-input-reference-in-composite": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#inputs](https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#inputs)
