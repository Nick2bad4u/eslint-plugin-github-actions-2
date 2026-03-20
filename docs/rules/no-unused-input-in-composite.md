# no-unused-input-in-composite

> **Rule catalog ID:** R053

## Targeted pattern scope

Composite action inputs declared under `inputs`.

## What this rule reports

Reports declared inputs that are never referenced as `inputs.<id>`.

## Why this rule exists

Unused inputs increase maintenance burden and create confusing action interfaces.

## ❌ Incorrect

```yaml
inputs:
  token:
    description: Token
runs:
  using: composite
  steps:
    - run: echo hello
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
      "github-actions/no-unused-input-in-composite": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#inputs](https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#inputs)
