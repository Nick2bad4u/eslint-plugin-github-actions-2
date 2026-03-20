# require-workflow-template-properties-pair

> **Rule catalog ID:** R055

## Targeted pattern scope

Workflow-template metadata files ending with `.properties.json`.

## What this rule reports

Reports metadata files that do not have matching `.yml`/`.yaml` template workflow files.

## Why this rule exists

Orphan metadata files are dead configuration and mislead maintainers.

## ❌ Incorrect

```text
workflow-templates/ci.properties.json
```

## ✅ Correct

```text
workflow-templates/ci.properties.json
workflow-templates/ci.yml
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
      "github-actions/require-workflow-template-properties-pair": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations#metadata-file-requirements](https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations#metadata-file-requirements)
