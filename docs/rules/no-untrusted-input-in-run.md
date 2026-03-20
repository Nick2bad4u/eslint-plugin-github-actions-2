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
      "github-actions/no-untrusted-input-in-run": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/security/secure-use#good-practices-for-mitigating-script-injection-attacks](https://docs.github.com/actions/reference/security/secure-use#good-practices-for-mitigating-script-injection-attacks)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsrun](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsrun)
