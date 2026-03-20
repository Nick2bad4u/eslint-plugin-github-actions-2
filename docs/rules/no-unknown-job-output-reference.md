# no-unknown-job-output-reference

> **Rule catalog ID:** R037

## Targeted pattern scope

GitHub Actions workflow YAML files that reference job outputs through `needs.<job_id>.outputs.<output_name>` or reusable workflow outputs through `jobs.<job_id>.outputs.<output_name>`.

## What this rule reports

This rule reports output references that point at:

- a job that does not exist
- a job that is not listed in the current job's direct `needs`
- an output name that is not declared under the referenced job's `outputs`

## Why this rule exists

GitHub only populates the `needs` context for direct dependencies, and reusable workflow outputs must be mapped from declared job outputs. Typos in job IDs, missing `needs` dependencies, or misspelled output names silently evaluate to empty strings at runtime and can break downstream deployment, release, or reporting logic.

## ❌ Incorrect

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      artifact-sha: ${{ steps.pkg.outputs.sha }}
    steps:
      - id: pkg
        run: echo "sha=abc123" >> "$GITHUB_OUTPUT"

  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "${{ needs.build.outputs.artifact_sha }}"
```

## ✅ Correct

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      artifact-sha: ${{ steps.pkg.outputs.sha }}
    steps:
      - id: pkg
        run: echo "sha=abc123" >> "$GITHUB_OUTPUT"

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "${{ needs.build.outputs.artifact-sha }}"
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
      "github-actions/no-unknown-job-output-reference": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/contexts#needs-context](https://docs.github.com/actions/reference/workflows-and-actions/contexts#needs-context)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idoutputs](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idoutputs)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_calloutputs](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_calloutputs)
