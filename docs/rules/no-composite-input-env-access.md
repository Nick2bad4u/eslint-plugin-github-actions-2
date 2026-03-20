# no-composite-input-env-access

> **Rule catalog ID:** R049

## Targeted pattern scope

Composite action metadata under `runs.using: composite`.

## What this rule reports

Reports `INPUT_*` environment variable usage in composite steps.

## Why this rule exists

Composite actions should read inputs via `inputs.*` context references.

## ❌ Incorrect

```yaml
runs:
  using: composite
  steps:
    - run: echo "$INPUT_TOKEN"
      shell: bash
```

## ✅ Correct

```yaml
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
      "github-actions/no-composite-input-env-access": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#inputs](https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#inputs)
- [https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#runs-for-composite-actions](https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#runs-for-composite-actions)
