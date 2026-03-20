# no-subdirectory-template-file-pattern

> **Rule catalog ID:** R062

## Targeted pattern scope

`filePatterns` entries in workflow-template properties metadata.

## What this rule reports

Reports patterns containing path separators that target subdirectories.

## Why this rule exists

Workflow-template `filePatterns` are intended to match repository-root indicators.

## ❌ Incorrect

```json
{ "filePatterns": ["^src/package.json$"] }
```

## ✅ Correct

```json
{ "filePatterns": ["^package.json$", "^go\\.mod$"] }
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
      "github-actions/no-subdirectory-template-file-pattern": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations#metadata-file-requirements](https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations#metadata-file-requirements)
