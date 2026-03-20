# require-workflow-dispatch-input-type

> **Rule catalog ID:** R022

## Targeted pattern scope

GitHub Actions workflow YAML files that define `on.workflow_dispatch.inputs`.

## What this rule reports

This rule reports manual-dispatch inputs that omit `type` or set `type` to an empty or non-string value.

## Why this rule exists

Explicit input types make manual workflows easier to use in the GitHub UI, preserve boolean and number semantics more reliably, and keep workflow interfaces self-documenting as they evolve.

## ❌ Incorrect

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: Deployment target
        required: true
```

## ✅ Correct

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: Deployment target
        required: true
        type: environment
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
      "github-actions/require-workflow-dispatch-input-type": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_dispatchinputs](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_dispatchinputs)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_dispatchinputsinput_idtype](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_dispatchinputsinput_idtype)
- [https://docs.github.com/actions/reference/workflows-and-actions/contexts#inputs-context](https://docs.github.com/actions/reference/workflows-and-actions/contexts#inputs-context)
