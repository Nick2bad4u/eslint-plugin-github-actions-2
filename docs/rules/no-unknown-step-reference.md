# no-unknown-step-reference

> **Rule catalog ID:** R038

## Targeted pattern scope

GitHub Actions workflow YAML files that reference the `steps` context.

## What this rule reports

This rule reports `steps.<id>.*` references when the referenced step ID does not exist in the job, or when a step tries to read the `steps` context from a later step that has not run yet.

## Why this rule exists

GitHub documents that the `steps` context only contains steps in the current job that have an `id` and have already run. A typo in `steps.<id>` or a forward reference to a later step resolves to missing data at runtime and can invalidate job outputs, environment URLs, or step conditionals.

## ❌ Incorrect

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Use result too early
        run: echo "${{ steps.publish.outputs.url }}"
      - id: publish
        run: echo "url=https://example.com" >> "$GITHUB_OUTPUT"
```

## ✅ Correct

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - id: publish
        run: echo "url=https://example.com" >> "$GITHUB_OUTPUT"
      - name: Use published URL
        run: echo "${{ steps.publish.outputs.url }}"
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
      "github-actions/no-unknown-step-reference": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/contexts#steps-context](https://docs.github.com/actions/reference/workflows-and-actions/contexts#steps-context)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsid](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsid)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idoutputs](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idoutputs)
