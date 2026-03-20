# no-inherit-secrets

> **Rule catalog ID:** R026

## Targeted pattern scope

GitHub Actions workflow YAML files that call reusable workflows with `jobs.<job_id>.uses`.

## What this rule reports

This rule reports reusable-workflow jobs that use `secrets: inherit`.

## Why this rule exists

GitHub allows `secrets: inherit` to pass every secret available to the calling workflow into a directly called reusable workflow. Requiring explicitly named secrets keeps reusable-workflow integrations least-privileged and easier to review.

## ❌ Incorrect

```yaml
jobs:
  deploy:
    uses: ./.github/workflows/deploy.yml
    secrets: inherit
```

## ✅ Correct

```yaml
jobs:
  deploy:
    uses: ./.github/workflows/deploy.yml
    secrets:
      token: ${{ secrets.DEPLOY_TOKEN }}
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
      "github-actions/no-inherit-secrets": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idsecretsinherit](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idsecretsinherit)
- [https://docs.github.com/actions/using-workflows/reusing-workflows#passing-inputs-and-secrets-to-a-reusable-workflow](https://docs.github.com/actions/using-workflows/reusing-workflows#passing-inputs-and-secrets-to-a-reusable-workflow)
