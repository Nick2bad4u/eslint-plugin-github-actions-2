# valid-timeout-minutes

> **Rule catalog ID:** R017

## Targeted pattern scope

GitHub Actions workflow YAML files that set `timeout-minutes` on jobs or steps.

## What this rule reports

This rule reports literal `timeout-minutes` values that are not positive integers or that fall outside the configured allowed range.

## Why this rule exists

Timeout values are operational safety limits. Invalid or out-of-policy values can lead to stuck runners, wasted compute, or unexpectedly long execution windows.

## ❌ Incorrect

```yaml
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    timeout-minutes: 0
```

## ✅ Correct

```yaml
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    timeout-minutes: 30
```

```yaml
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    timeout-minutes: ${{ fromJSON(vars.JOB_TIMEOUT_MINUTES) }}
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
      "github-actions/valid-timeout-minutes": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idtimeout-minutes](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idtimeout-minutes)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepscontinue-on-error](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepscontinue-on-error)
