# no-deprecated-node-runtime

> **Rule catalog ID:** R044

## Targeted pattern scope

GitHub Action metadata `runs.using` for JavaScript actions.

## What this rule reports

Reports deprecated Node.js runtimes such as `node12` and `node16`.

## Why this rule exists

Deprecated runtimes age out of security support and eventually break action execution.

## ❌ Incorrect

```yaml
runs:
  using: node16
  main: dist/index.js
```

## ✅ Correct

```yaml
runs:
  using: node20
  main: dist/index.js
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
      "github-actions/no-deprecated-node-runtime": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.
## Further reading

- [https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#runs-for-javascript-actions](https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#runs-for-javascript-actions)
