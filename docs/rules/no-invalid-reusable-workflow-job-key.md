# no-invalid-reusable-workflow-job-key

> **Rule catalog ID:** R041

## Targeted pattern scope

GitHub Actions workflow YAML jobs that call reusable workflows via `jobs.<job_id>.uses`.

## What this rule reports

This rule reports unsupported keys on reusable-workflow caller jobs, such as `runs-on`, `steps`, `container`, `outputs`, `timeout-minutes`, or `environment`.

## Why this rule exists

Jobs that call reusable workflows have a much narrower supported keyword set than normal inline jobs. GitHub only allows caller-job keys such as `name`, `uses`, `with`, `secrets`, `strategy`, `needs`, `if`, `concurrency`, and `permissions`. Adding inline-job keys beside `uses` creates invalid workflow structure and confuses reviewers about where the real job logic lives.

## ❌ Incorrect

```yaml
jobs:
  deploy:
    uses: ./.github/workflows/deploy.yml
    runs-on: ubuntu-latest
    steps:
      - run: echo "This caller job is invalid"
```

## ✅ Correct

```yaml
jobs:
  deploy:
    uses: ./.github/workflows/deploy.yml
    with:
      environment: production
    secrets:
      token: ${{ secrets.DEPLOY_TOKEN }}
    permissions:
      contents: read
    concurrency:
      group: deploy-${{ github.ref }}
      cancel-in-progress: true
```

## Further reading

- <https://docs.github.com/actions/reference/reusable-workflows-reference#supported-keywords-for-jobs-that-call-a-reusable-workflow>
- <https://docs.github.com/actions/using-workflows/reusing-workflows>
