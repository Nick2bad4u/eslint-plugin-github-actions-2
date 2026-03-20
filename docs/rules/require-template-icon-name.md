# require-template-icon-name

> **Rule catalog ID:** R056

## Targeted pattern scope

Workflow-template metadata `iconName` property.

## What this rule reports

Reports metadata files missing `iconName` or setting it to an empty value.

## Why this rule exists

An icon improves template discoverability and chooser UX.

## ❌ Incorrect

```json
{ "name": "CI", "description": "Template" }
```

## ✅ Correct

```json
{ "name": "CI", "description": "Template", "iconName": "workflow" }
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
      "github-actions/require-template-icon-name": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations#metadata-file-requirements](https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations#metadata-file-requirements)
