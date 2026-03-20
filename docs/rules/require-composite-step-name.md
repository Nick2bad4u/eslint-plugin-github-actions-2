# require-composite-step-name

> **Rule catalog ID:** R052

## Targeted pattern scope

Composite action `runs.steps` entries.

## What this rule reports

Reports composite steps missing a non-empty `name`.

## Why this rule exists

Named steps make action logs readable and troubleshooting faster.

## ❌ Incorrect

```yaml
runs:
  using: composite
  steps:
    - run: echo hello
      shell: bash
```

## ✅ Correct

```yaml
runs:
  using: composite
  steps:
    - name: Print greeting
      run: echo hello
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
      "github-actions/require-composite-step-name": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#runs-for-composite-actions](https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#runs-for-composite-actions)
