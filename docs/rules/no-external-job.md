# no-external-job

> **Rule catalog ID:** R012

## Targeted pattern scope

GitHub Actions workflow YAML files that call reusable workflows from `jobs.<id>.uses`.

## What this rule reports

This rule reports jobs that invoke reusable workflows via `uses` instead of defining the job inline.

## Why this rule exists

Some repositories prefer every job definition to live in the same workflow file for easier review, debugging, and change impact analysis.

## ❌ Incorrect

```yaml
jobs:
  deploy:
    uses: ./.github/workflows/deploy.yml
```

## ✅ Correct

```yaml
jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: ./scripts/deploy.sh
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
      "github-actions/no-external-job": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/using-workflows/reusing-workflows](https://docs.github.com/actions/using-workflows/reusing-workflows)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_iduses](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_iduses)
