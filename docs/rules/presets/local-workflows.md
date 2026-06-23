# localWorkflows preset

## Purpose

Use `githubActions.configs.localWorkflows` when a repository intentionally forbids reusable-workflow caller jobs and requires every workflow job to be defined inline.

## Files

```txt
.github/workflows/*.{yml,yaml}
```

## Included rules

Fix legend:

- 🔧 = autofixable
- 💡 = suggestions available
- — = report only

| Rule                                                                                       | Fix |
| ------------------------------------------------------------------------------------------ | :-: |
| <span class="sb-inline-rule-number">R012</span> [`no-external-job`](../no-external-job.md) |  —  |
