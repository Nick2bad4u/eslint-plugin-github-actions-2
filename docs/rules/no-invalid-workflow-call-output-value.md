# no-invalid-workflow-call-output-value

> **Rule catalog ID:** R040

## Targeted pattern scope

GitHub Actions workflow YAML files that define reusable workflow output values under `on.workflow_call.outputs.*.value`.

## What this rule reports

This rule reports reusable workflow output values that:

- reference contexts that are not available in `on.workflow_call.outputs.*.value`
- fail to map from a job output such as `jobs.build.outputs.artifact`

## Why this rule exists

GitHub only allows the `github`, `jobs`, `vars`, and `inputs` contexts when computing reusable workflow output values, and those values must ultimately come from a job output inside the called workflow. Direct `steps.*`, `needs.*`, `matrix.*`, or literal-only mappings are invalid and break the reusable workflow contract.

## ❌ Incorrect

```yaml
on:
  workflow_call:
    outputs:
      deployment-url:
        description: Published deployment URL
        value: ${{ steps.publish.outputs.url }}
```

## ✅ Correct

```yaml
on:
  workflow_call:
    outputs:
      deployment-url:
        description: Published deployment URL
        value: ${{ jobs.deploy.outputs.deployment-url }}
jobs:
  deploy:
    runs-on: ubuntu-latest
    outputs:
      deployment-url: ${{ steps.publish.outputs.url }}
    steps:
      - id: publish
        run: echo "url=https://example.com" >> "$GITHUB_OUTPUT"
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
      "github-actions/no-invalid-workflow-call-output-value": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/using-workflows/reusing-workflows](https://docs.github.com/actions/using-workflows/reusing-workflows)
- [https://docs.github.com/actions/reference/workflows-and-actions/contexts#context-availability](https://docs.github.com/actions/reference/workflows-and-actions/contexts#context-availability)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_calloutputs](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_calloutputs)
