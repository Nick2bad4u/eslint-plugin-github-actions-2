# no-invalid-template-file-pattern-regex

> **Rule catalog ID:** R059

## Targeted pattern scope

`filePatterns` entries in workflow-template properties metadata.

## What this rule reports

Reports regex strings that are syntactically invalid.

## Why this rule exists

Invalid regex values break template recommendation matching.

## ❌ Incorrect

```json
{ "filePatterns": ["(package.json$"] }
```

## ✅ Correct

```json
{ "filePatterns": ["package.json$", "^go\\.mod$"] }
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
      "github-actions/no-invalid-template-file-pattern-regex": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://www.schemastore.org/github-workflow-template-properties.json](https://www.schemastore.org/github-workflow-template-properties.json)
