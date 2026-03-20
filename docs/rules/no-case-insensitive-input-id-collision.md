# no-case-insensitive-input-id-collision

> **Rule catalog ID:** R048

## Targeted pattern scope

Action metadata input ID keys under `inputs`.

## What this rule reports

Reports input IDs that collide when normalized case-insensitively.

## Why this rule exists

Case-variant IDs are confusing for callers and easy to misread in workflow `with:` blocks.

## ❌ Incorrect

```yaml
inputs:
  Token:
    description: First input
  token:
    description: Second input
```

## ✅ Correct

```yaml
inputs:
  token:
    description: Access token
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
      "github-actions/no-case-insensitive-input-id-collision": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#inputsinput_id](https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#inputsinput_id)
