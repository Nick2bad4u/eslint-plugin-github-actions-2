# require-workflow-call-input-type

> **Rule catalog ID:** R034

## Targeted pattern scope

GitHub Actions workflow YAML files that define `on.workflow_call.inputs` for reusable workflows.

## What this rule reports

This rule reports reusable workflow inputs that omit `type` or set `type` to a value outside GitHub's documented `string`, `number`, and `boolean` reusable-workflow input types.

## Why this rule exists

Reusable workflows are interfaces consumed by other workflows. Explicitly typed inputs make those interfaces clearer for callers, help GitHub validate passed values consistently, and reduce ambiguity when workflows evolve.

## ❌ Incorrect

```yaml
on:
  workflow_call:
    inputs:
      dry_run:
        description: Run validation only
        required: false
```

## ✅ Correct

```yaml
on:
  workflow_call:
    inputs:
      dry_run:
        description: Run validation only
        required: false
        type: boolean
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
      "github-actions/require-workflow-call-input-type": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/using-workflows/reusing-workflows](https://docs.github.com/actions/using-workflows/reusing-workflows)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_callinputs](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_callinputs)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_callinputsinput_idtype](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_callinputsinput_idtype)
