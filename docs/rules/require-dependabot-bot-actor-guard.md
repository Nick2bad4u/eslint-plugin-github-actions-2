# require-dependabot-bot-actor-guard

> **Rule catalog ID:** R109

## Targeted pattern scope

Jobs that automate Dependabot pull requests using `dependabot/fetch-metadata` or `gh pr` commands.

## What this rule reports

This rule reports Dependabot automation jobs that do not guard execution on `dependabot[bot]`.

## Why this rule exists

Pull request automation should not run broadly on all pull requests when it is intended specifically for Dependabot. Requiring a Dependabot bot guard makes that safety boundary explicit.

## ❌ Incorrect

```yaml
jobs:
  dependabot:
    runs-on: ubuntu-latest
```

## ✅ Correct

```yaml
jobs:
  dependabot:
    if: github.event.pull_request.user.login == 'dependabot[bot]'
    runs-on: ubuntu-latest
```

## Additional examples

This rule accepts either a job-level guard or step-level guards on the relevant automation steps.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.security];
```

## When not to use it

Disable this rule if your automation intentionally handles both Dependabot and non-Dependabot pull requests in the same job.

## Further reading

- [Automating Dependabot with GitHub Actions](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/automating-dependabot-with-github-actions)
