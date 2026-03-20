# require-job-timeout-minutes

> **Rule catalog ID:** R002

## Targeted pattern scope

Non-reusable workflow jobs under `jobs.<job_id>`.

## What this rule reports

This rule reports jobs that do not define `timeout-minutes`, jobs that use a non-integer timeout, and jobs that exceed the configured `maxMinutes` threshold.

## Why this rule exists

Explicit job timeouts make runner usage more predictable and reduce the blast radius of stuck processes or hanging external services.

## ❌ Incorrect

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
```

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 180
```

## ✅ Correct

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30
```

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: ${{ fromJson(vars.CI_TIMEOUT_MINUTES) }}
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
      "github-actions/require-job-timeout-minutes": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idtimeout-minutes](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idtimeout-minutes)
