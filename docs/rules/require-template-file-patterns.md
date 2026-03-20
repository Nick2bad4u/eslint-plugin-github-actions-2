# require-template-file-patterns

> **Rule catalog ID:** R058

## Targeted pattern scope

Workflow-template metadata `filePatterns` property.

## What this rule reports

Reports missing or empty `filePatterns` arrays.

## Why this rule exists

File patterns help GitHub suggest relevant templates for repository contents.

## ❌ Incorrect

```json
{ "name": "CI", "description": "Template", "iconName": "workflow" }
```

## ✅ Correct

```json
{
  "name": "CI",
  "description": "Template",
  "iconName": "workflow",
  "categories": ["JavaScript"],
  "filePatterns": ["package.json$"]
}
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
      "github-actions/require-template-file-patterns": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations#metadata-file-requirements](https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations#metadata-file-requirements)
