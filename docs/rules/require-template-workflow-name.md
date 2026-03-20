# require-template-workflow-name

> **Rule catalog ID:** R067

## Targeted pattern scope

Workflow template YAML files under `workflow-templates/`.

## What this rule reports

Reports missing or empty top-level `name` fields.

## Why this rule exists

Template names are primary labels shown in workflow selection UI.

## ❌ Incorrect

```yaml
on:
  push:
```

## ✅ Correct

```yaml
name: Node.js CI
on:
  push:
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
      "github-actions/require-template-workflow-name": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations](https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations)
