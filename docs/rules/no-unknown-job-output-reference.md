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

## Further reading

- <https://docs.github.com/actions/reference/workflows-and-actions/contexts#needs-context>
- <https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idoutputs>
- <https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_calloutputs>
