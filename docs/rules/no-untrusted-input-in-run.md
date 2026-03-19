# no-untrusted-input-in-run

> **Rule catalog ID:** R029

## Targeted pattern scope

GitHub Actions workflow YAML files with inline `run` scripts that interpolate event payload values directly.

## What this rule reports

This rule reports `run` steps that directly embed untrusted event payload values such as pull request titles, issue bodies, comment bodies, review bodies, discussion text, or `repository_dispatch` client payload fields.

## Why this rule exists

GitHub recommends using an intermediate environment variable instead of interpolating untrusted context values directly into generated shell scripts. That reduces script-injection risk and makes the data flow easier to review.

## ❌ Incorrect

```yaml
on:
  pull_request:

jobs:
  check-title:
    runs-on: ubuntu-latest
    steps:
      - run: echo "${{ github.event.pull_request.title }}"
```

## ✅ Correct

```yaml
on:
  pull_request:

jobs:
  check-title:
    runs-on: ubuntu-latest
    steps:
      - env:
          PR_TITLE: ${{ github.event.pull_request.title }}
        run: echo "$PR_TITLE"
```

## Further reading

- <https://docs.github.com/actions/reference/security/secure-use#good-practices-for-mitigating-script-injection-attacks>
- <https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsrun>
