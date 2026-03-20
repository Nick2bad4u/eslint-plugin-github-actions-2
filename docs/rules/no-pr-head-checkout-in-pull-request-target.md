# no-pr-head-checkout-in-pull-request-target

> **Rule catalog ID:** R030

## Targeted pattern scope

GitHub Actions workflow YAML files triggered by `pull_request_target` that use `actions/checkout`.

## What this rule reports

This rule reports `actions/checkout` steps in `pull_request_target` workflows when `with.ref` or `with.repository` points at the pull request head branch, SHA, or repository.

## Why this rule exists

GitHub warns that `pull_request_target` runs with the base repository's privileges and should not be used to build or run untrusted code from the pull request. Checking out the PR head inside this privileged trigger is a common way to accidentally create a "pwn request" workflow.

## ❌ Incorrect

```yaml
on:
  pull_request_target:

jobs:
  annotate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
        with:
          repository: ${{ github.event.pull_request.head.repo.full_name }}
          ref: ${{ github.event.pull_request.head.ref }}
```

## ✅ Correct

```yaml
on:
  pull_request_target:

jobs:
  annotate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v8
        with:
          script: |
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: "Thanks for the PR!"
            });
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
      "github-actions/no-pr-head-checkout-in-pull-request-target": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target](https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target)
- [https://docs.github.com/actions/reference/security/secure-use](https://docs.github.com/actions/reference/security/secure-use)
