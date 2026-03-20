# no-secrets-in-if

> **Rule catalog ID:** R027

## Targeted pattern scope

GitHub Actions workflow YAML files with job-level or step-level `if` conditionals.

## What this rule reports

This rule reports `if` conditionals that directly reference the `secrets` context, such as `secrets.DEPLOY_TOKEN`.

## Why this rule exists

GitHub documents that secrets cannot be directly referenced in `if:` conditionals. The safe pattern is to assign the secret to an environment variable first, then check the environment variable inside the conditional.

## ❌ Incorrect

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - if: ${{ secrets.DEPLOY_TOKEN != '' }}
        run: ./deploy.sh
```

## ✅ Correct

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
    steps:
      - if: ${{ env.DEPLOY_TOKEN != '' }}
        run: ./deploy.sh
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
      "github-actions/no-secrets-in-if": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsif](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsif)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idif](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idif)
