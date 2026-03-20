# no-invalid-concurrency-context

> **Rule catalog ID:** R042

## Targeted pattern scope

GitHub Actions workflow YAML files that define workflow-level `concurrency` or `jobs.<job_id>.concurrency` expressions.

## What this rule reports

This rule reports concurrency expressions that reference contexts GitHub does not allow at that location.

- Top-level `concurrency` may only reference `github`, `inputs`, and `vars`
- Job-level `concurrency` may only reference `github`, `needs`, `strategy`, `matrix`, `inputs`, and `vars`

## Why this rule exists

Concurrency is evaluated before steps run, so step-only and runner-time contexts such as `steps`, `secrets`, `env`, `job`, or `runner` are not available there. Using unsupported contexts makes concurrency groups invalid and can break workflow scheduling behavior.

## ❌ Incorrect

```yaml
concurrency:
  group: deploy-${{ secrets.ENVIRONMENT }}
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    concurrency:
      group: deploy-${{ steps.meta.outputs.lock }}
    steps:
      - id: meta
        run: echo "lock=prod" >> "$GITHUB_OUTPUT"
```

## ✅ Correct

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: Deployment target
        required: true
        type: string

concurrency:
  group: deploy-${{ github.workflow }}-${{ inputs.environment }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      lock: ${{ steps.meta.outputs.lock }}
    steps:
      - id: meta
        run: echo "lock=prod" >> "$GITHUB_OUTPUT"

  deploy:
    needs: build
    runs-on: ubuntu-latest
    concurrency:
      group: deploy-${{ needs.build.outputs.lock }}
      cancel-in-progress: ${{ inputs.environment == 'prod' }}
    steps:
      - run: echo "Deploying"
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
      "github-actions/no-invalid-concurrency-context": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#concurrency](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#concurrency)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idconcurrency](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idconcurrency)
- [https://docs.github.com/actions/reference/workflows-and-actions/contexts#context-availability](https://docs.github.com/actions/reference/workflows-and-actions/contexts#context-availability)
