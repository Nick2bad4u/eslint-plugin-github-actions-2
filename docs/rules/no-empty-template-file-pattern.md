# no-empty-template-file-pattern

> **Rule catalog ID:** R060

## Targeted pattern scope

`filePatterns` entries in `workflow-templates/*.properties.json` files.

## What this rule reports

Reports entries that are empty or whitespace-only strings.

## Why this rule exists

Template matching requires meaningful regex patterns.

## ❌ Incorrect

```json
{ "filePatterns": ["   "] }
```

## ✅ Correct

```json
{ "filePatterns": ["package.json$"] }
```

## Behavior and migration notes

The autofixer removes empty or whitespace-only entries from the `filePatterns` array while preserving the remaining valid items. If the array only contains invalid entries, the fix leaves an empty array behind so you can add the intended patterns explicitly.

## Additional examples

For larger repositories, this rule is often enabled together with one of the published presets so violations are caught in pull requests before workflow changes are merged.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [
  {
    files: ["**/*.{yml,yaml}"],
    plugins: {
      "github-actions": githubActions,
    },
    rules: {
      "github-actions/no-empty-template-file-pattern": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.

## Further reading

- [SchemaStore: GitHub workflow template properties schema](https://www.schemastore.org/github-workflow-template-properties.json)
