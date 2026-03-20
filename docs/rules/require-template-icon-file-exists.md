# require-template-icon-file-exists

> **Rule catalog ID:** R065

## Targeted pattern scope

Workflow-template properties `iconName` values that refer to local SVG icons.

## What this rule reports

Reports local `iconName` values that do not resolve to an existing `*.svg` file.

## Why this rule exists

Broken icon references degrade workflow-template UX.

## ❌ Incorrect

```json
{ "iconName": "workflow" }
```

If `workflow.svg` does not exist next to the metadata file, this is reported.

## ✅ Correct

```json
{ "iconName": "workflow" }
```

With `workflow.svg` present in the same directory.


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
      "github-actions/require-template-icon-file-exists": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations#metadata-file-requirements](https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations#metadata-file-requirements)
