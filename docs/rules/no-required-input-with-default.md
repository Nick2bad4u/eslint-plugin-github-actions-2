# no-required-input-with-default

> **Rule catalog ID:** R047

## Targeted pattern scope

Action metadata `inputs.<id>` definitions.

## What this rule reports

Reports input definitions that set both `required: true` and `default`.

## Why this rule exists

A default value means callers can omit the input, which conflicts with `required: true`.

## ❌ Incorrect

```yaml
inputs:
  token:
    description: Token
    required: true
    default: abc123
```

## ✅ Correct

```yaml
inputs:
  token:
    description: Token
    required: true
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
      "github-actions/no-required-input-with-default": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#inputs](https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#inputs)
