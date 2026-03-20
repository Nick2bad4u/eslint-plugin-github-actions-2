# prefer-action-yml

> **Rule catalog ID:** R043

## Targeted pattern scope

GitHub Action metadata files named `action.yaml`.

## What this rule reports

Reports action metadata files that use `action.yaml` instead of `action.yml`.

## Why this rule exists

GitHub supports both extensions, but the metadata docs call out `action.yml` as the preferred filename.

## ❌ Incorrect

```text
action.yaml
```

## ✅ Correct

```text
action.yml
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
      "github-actions/prefer-action-yml": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax](https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax)
