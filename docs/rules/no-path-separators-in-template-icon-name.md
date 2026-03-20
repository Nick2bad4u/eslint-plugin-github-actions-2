# no-path-separators-in-template-icon-name

> **Rule catalog ID:** R064

## Targeted pattern scope

`iconName` in workflow-template properties metadata.

## What this rule reports

Reports `iconName` values containing `/` or `\\`.

## Why this rule exists

`iconName` should be a token, not a filesystem path.

## ❌ Incorrect

```json
{ "iconName": "icons/workflow" }
```

## ✅ Correct

```json
{ "iconName": "workflow" }
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
      "github-actions/no-path-separators-in-template-icon-name": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://www.schemastore.org/github-workflow-template-properties.json](https://www.schemastore.org/github-workflow-template-properties.json)
