# require-dependabot-automation-permissions

> **Rule catalog ID:** R111

## Targeted pattern scope

Jobs that automate Dependabot pull requests using `gh pr edit`, `gh pr review`, or `gh pr merge`.

## What this rule reports

This rule reports missing minimum permissions for Dependabot pull request automation steps.

## Why this rule exists

PR automation should request only the permissions it actually needs, but it still needs enough privilege to work. This rule makes those minimum permission requirements explicit for common `gh pr` automation commands.

## ❌ Incorrect

```yaml
permissions:
  contents: read
```

## ✅ Correct

```yaml
permissions:
  contents: read
  pull-requests: write
  issues: write
```

## Additional examples

- `gh pr edit --add-label` requires `issues: write`
- `gh pr review` requires `pull-requests: write`
- `gh pr merge` requires `contents: write` and `pull-requests: write`

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.security];
```

## When not to use it

Disable this rule if your repository uses a different automation mechanism instead of `gh pr` commands.

## Further reading

- [Automating Dependabot with GitHub Actions](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/automating-dependabot-with-github-actions)
