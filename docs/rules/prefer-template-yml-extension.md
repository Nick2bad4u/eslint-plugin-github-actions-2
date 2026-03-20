# prefer-template-yml-extension

> **Rule catalog ID:** R066

## Targeted pattern scope

Workflow template YAML filenames under `workflow-templates/`.

## What this rule reports

Reports template files that use `.yaml` instead of `.yml`.

## Why this rule exists

Consistent file extensions improve discoverability and repository conventions.

## ❌ Incorrect

```text
workflow-templates/ci.yaml
```

## ✅ Correct

```text
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
      "github-actions/prefer-template-yml-extension": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations](https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations)
