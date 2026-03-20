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
      "github-actions/require-workflow-call-output-value": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/using-workflows/reusing-workflows](https://docs.github.com/actions/using-workflows/reusing-workflows)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_calloutputs](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_calloutputs)
