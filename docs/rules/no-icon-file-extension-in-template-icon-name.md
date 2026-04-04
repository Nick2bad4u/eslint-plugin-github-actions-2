# no-icon-file-extension-in-template-icon-name

> **Rule catalog ID:** R063

## Targeted pattern scope

`iconName` in workflow-template properties metadata.

## What this rule reports

Reports `iconName` values ending in `.svg`.

## Why this rule exists

Template icon names should be bare icon identifiers, not filenames with extensions.

## ❌ Incorrect

```json
{ "iconName": "workflow.svg" }
```

## ✅ Correct

```json
{ "iconName": "workflow" }
```

## Behavior and migration notes

The autofixer removes a trailing `.svg` suffix from `iconName`. It does not try to normalize any other part of the value, so path segments or different file extensions are still left for other rules or manual review.

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
      "github-actions/no-icon-file-extension-in-template-icon-name": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.

## Further reading

- [GitHub Actions docs: Workflow template metadata file requirements](https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations#metadata-file-requirements)
