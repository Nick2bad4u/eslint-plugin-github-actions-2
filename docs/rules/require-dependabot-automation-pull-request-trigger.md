# require-dependabot-automation-pull-request-trigger

> **Rule catalog ID:** R112

## Targeted pattern scope

Workflows that automate Dependabot pull requests.

## What this rule reports

This rule reports Dependabot automation workflows that do not listen for `pull_request`.

## Why this rule exists

Dependabot pull request automation should run where Dependabot actually creates pull requests. Requiring the `pull_request` trigger keeps the workflow attached to the right event surface.

## ❌ Incorrect

```yaml
on: [workflow_dispatch]
```

## ✅ Correct

```yaml
on:
  pull_request:
    branches: [main]
```

## Additional examples

This rule applies only when the workflow contains known Dependabot automation patterns such as `dependabot/fetch-metadata` or `gh pr` automation commands.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.security];
```

## When not to use it

Disable this rule if your repository automates Dependabot outside `pull_request` workflows on purpose.

## Further reading

- [Automating Dependabot with GitHub Actions](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/automating-dependabot-with-github-actions)
