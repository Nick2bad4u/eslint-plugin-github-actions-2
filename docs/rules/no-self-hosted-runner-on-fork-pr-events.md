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
      "github-actions/no-self-hosted-runner-on-fork-pr-events": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request](https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request)
- [https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target](https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target)
- [https://docs.github.com/actions/reference/security/secure-use#hardening-for-self-hosted-runners](https://docs.github.com/actions/reference/security/secure-use#hardening-for-self-hosted-runners)
