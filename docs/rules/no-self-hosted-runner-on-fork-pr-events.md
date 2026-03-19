# no-self-hosted-runner-on-fork-pr-events

> **Rule catalog ID:** R036

## Targeted pattern scope

GitHub Actions workflow YAML files triggered by fork-capable pull request events such as `pull_request`, `pull_request_target`, `pull_request_review`, `pull_request_review_comment`, and `issue_comment`.

## What this rule reports

This rule reports jobs that select a self-hosted runner while the workflow can be invoked from forked or Dependabot pull request activity.

## Why this rule exists

GitHub documents that forked pull request activity is sent to the base repository for these PR-related events, and that self-hosted runners do not provide the same clean, ephemeral isolation guarantees as GitHub-hosted runners. Running untrusted contributor-triggered workflows on self-hosted infrastructure can expose secrets, tokens, network access, or persistent runner state.

## ❌ Incorrect

```yaml
on:
  pull_request:

jobs:
  test:
    runs-on:
      - self-hosted
      - linux
    steps:
      - run: npm test
```

## ✅ Correct

```yaml
on:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

## Further reading

- <https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request>
- <https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target>
- <https://docs.github.com/actions/reference/security/secure-use#hardening-for-self-hosted-runners>
