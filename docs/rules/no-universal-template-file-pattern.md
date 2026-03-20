# no-universal-template-file-pattern

> **Rule catalog ID:** R061

## Targeted pattern scope

`filePatterns` entries in workflow-template properties metadata.

## What this rule reports

Reports universal catch-all patterns such as `.*`, `^.*$`, `.+`, and `^.+$`.

## Why this rule exists

Catch-all patterns degrade template recommendation precision.

## ❌ Incorrect

```json
{ "filePatterns": [".*"] }
```

## ✅ Correct

```json
{ "filePatterns": ["package.json$", "^Cargo\\.toml$"] }
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
      "github-actions/no-universal-template-file-pattern": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations#metadata-file-requirements](https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations#metadata-file-requirements)
