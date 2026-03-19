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

## Further reading

- <https://docs.github.com/actions/using-workflows/reusing-workflows>
- <https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_callinputs>
- <https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_callinputsinput_idtype>
