# valid-trigger-events

> **Rule catalog ID:** R018

## Targeted pattern scope

GitHub Actions workflow YAML files that declare trigger events under `on`.

## What this rule reports

This rule reports trigger event names that are not documented GitHub Actions workflow events.

## Why this rule exists

Mistyped trigger names silently break workflow intent. Validating events early prevents workflows from never running, or from running at the wrong time.

## ❌ Incorrect

```yaml
on:
  foo_bar:
```

## ✅ Correct

```yaml
on:
  push:
    branches:
      - main
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
      "github-actions/valid-trigger-events": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows](https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#on](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#on)
