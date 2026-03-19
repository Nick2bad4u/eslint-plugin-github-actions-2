# require-merge-group-trigger

> **Rule catalog ID:** R035

## Targeted pattern scope

GitHub Actions workflow YAML files that validate pull requests with the `pull_request` trigger.

## What this rule reports

This rule reports workflows that subscribe to `pull_request` but do not also declare a `merge_group` trigger.

## Why this rule exists

GitHub documents that repositories using required GitHub Actions checks with merge queues must add the separate `merge_group` trigger. Otherwise, those required checks do not run when a pull request enters the queue, and the merge cannot complete.

## ❌ Incorrect

```yaml
on:
  pull_request:
    branches:
      - main
```

## ✅ Correct

```yaml
on:
  pull_request:
    branches:
      - main
  merge_group:
    types:
      - checks_requested
```

## Further reading

- <https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows#merge_group>
- <https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onmerge_grouptypes>
