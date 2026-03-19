# require-workflow-call-output-value

> **Rule catalog ID:** R039

## Targeted pattern scope

GitHub Actions workflow YAML files that define reusable workflow outputs under `on.workflow_call.outputs`.

## What this rule reports

This rule reports reusable workflow outputs that omit `value` or set it to an empty scalar.

## Why this rule exists

Reusable workflow outputs are part of the public interface exposed to callers. GitHub documents each `workflow_call` output as having a `value`, and without that mapping the output cannot return anything meaningful to downstream jobs.

## ❌ Incorrect

```yaml
on:
  workflow_call:
    outputs:
      deployment-url:
        description: Published deployment URL
```

## ✅ Correct

```yaml
on:
  workflow_call:
    outputs:
      deployment-url:
        description: Published deployment URL
        value: ${{ jobs.deploy.outputs.url }}
```

## Further reading

- <https://docs.github.com/actions/using-workflows/reusing-workflows>
- <https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_calloutputs>
