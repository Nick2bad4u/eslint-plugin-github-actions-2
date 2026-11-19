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
  if: ${{ github.event.inputs.dry_run == 'true' }}
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

## Behavior and migration notes

This rule reports references but does not autofix them. Changing contexts can change the value type and alter workflow conditions. When migrating a Boolean comparison such as `github.event.inputs.dry_run == 'true'`, use `inputs.dry_run == true` (without quotes), or test `inputs.dry_run` directly when the input is known to be provided. Review workflows with multiple triggers separately to preserve how they handle missing inputs.

## Additional examples

For larger repositories, this rule is often enabled together with one of the published presets so violations are caught in pull requests before workflow changes are merged.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [
 {
  files: ["**/*.{yml,yaml}"],
  plugins: {
   "github-actions": githubActions,
  },
  rules: {
   "github-actions/prefer-inputs-context": "error",
  },
 },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.

## Further reading

- [GitHub Actions event reference: `workflow_dispatch`](https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_dispatch)
- [GitHub Actions contexts reference: `inputs` context](https://docs.github.com/actions/reference/workflows-and-actions/contexts#inputs-context)
