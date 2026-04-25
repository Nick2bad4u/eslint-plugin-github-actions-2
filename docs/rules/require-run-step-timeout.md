# require-run-step-timeout

> **Rule catalog ID:** R115

## Targeted pattern scope

Non-reusable workflow jobs under `jobs.<job_id>` that contain `steps[*].run` commands.

## What this rule reports

This rule reports jobs that contain `run` steps but do not define `timeout-minutes` at the job level.

## Why this rule exists

`run:` steps (shell commands) can hang indefinitely while waiting on network I/O, stdin input, or a deadlocked subprocess. A hung step consumes the entire job's timeout budget. Explicit job-level timeouts prevent unattended runners from consuming resources indefinitely and reduce incident response time.

## ❌ Incorrect

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm install
```

```yaml
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

## ✅ Correct

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: npm install
```

```yaml
jobs:
  checkout-only:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

```yaml
jobs:
  ci:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

## Additional examples

### ✅ Correct — Jobs without run steps don't need timeouts

```yaml
jobs:
  dispatch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/upload-artifact@v3
```

### ✅ Correct — Reusable workflows are skipped

```yaml
jobs:
  reusable-call:
    uses: ./.github/workflows/shared.yml
    with:
      timeout: 20
```

## ESLint flat config example

```ts
import githubActionsPlugin from "eslint-plugin-github-actions";

export default [
    {
        plugins: { "github-actions": githubActionsPlugin },
        rules: {
            "github-actions/require-run-step-timeout": "error",
        },
    },
];
```

## When not to use it

Disable this rule if:

- Your workflows never use `run` steps (only actions)
- You enforce timeouts via external mechanisms (e.g., runner configuration, workflow policies)
- Your GitHub plan does not support runner group settings and explicit timeouts are not a concern

## Further reading

- [GitHub Actions: Job syntax — timeout-minutes](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idtimeout-minutes)
- [Related rule: require-job-timeout-minutes](require-job-timeout-minutes.md) — enforces timeouts on all non-reusable jobs
- [Related rule: valid-timeout-minutes](valid-timeout-minutes.md) — validates timeout values are in acceptable ranges
