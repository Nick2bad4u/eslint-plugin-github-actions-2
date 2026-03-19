# prefer-inputs-context

> **Rule catalog ID:** R033

## Targeted pattern scope

GitHub Actions workflow YAML files that define `workflow_dispatch` and reference `github.event.inputs` in expressions.

## What this rule reports

This rule reports `github.event.inputs.*` references in `workflow_dispatch` workflows and prefers the shorter `inputs.*` context instead.

## Why this rule exists

GitHub documents that `inputs` and `github.event.inputs` expose the same manual-dispatch values, but `inputs` preserves Boolean values as Booleans instead of converting them to strings. Using `inputs` also makes workflow expressions shorter and easier to read.

## ❌ Incorrect

```yaml
on:
  workflow_dispatch:
    inputs:
      dry_run:
        description: Run validation only
        required: true
        type: boolean

jobs:
  release:
    runs-on: ubuntu-latest
    if: ${{ github.event.inputs.dry_run }}
    steps:
      - run: echo release
```

## ✅ Correct

```yaml
on:
  workflow_dispatch:
    inputs:
      dry_run:
        description: Run validation only
        required: true
        type: boolean

jobs:
  release:
    runs-on: ubuntu-latest
    if: ${{ inputs.dry_run }}
    steps:
      - run: echo release
```

## Further reading

- <https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_dispatch>
- <https://docs.github.com/actions/reference/workflows-and-actions/contexts#inputs-context>
