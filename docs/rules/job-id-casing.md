# job-id-casing

> **Rule catalog ID:** R010

## Targeted pattern scope

GitHub Actions workflow YAML files that declare job identifiers under `jobs`.

## What this rule reports

This rule reports workflow job IDs whose casing does not match the configured naming convention.

## Why this rule exists

Job IDs are referenced by features like `needs`, reusable workflow outputs, and visual run graphs. A consistent convention makes those references easier to read and maintain.

## ❌ Incorrect

```yaml
jobs:
  BuildApp:
    name: Build App
    runs-on: ubuntu-latest
```

## ✅ Correct

```yaml
jobs:
  build-app:
    name: Build App
    runs-on: ubuntu-latest
```

```yaml
jobs:
  build_app:
    name: Build App
    runs-on: ubuntu-latest
```

_The second example is valid when the rule is configured for `snake_case`._


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
      "github-actions/job-id-casing": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_id](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_id)
- [https://docs.github.com/actions/using-jobs/using-jobs-in-a-workflow](https://docs.github.com/actions/using-jobs/using-jobs-in-a-workflow)
