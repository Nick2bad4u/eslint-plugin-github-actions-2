# no-pre-if-without-pre

> **Rule catalog ID:** R045

## Targeted pattern scope

Action metadata `runs.pre-if` declarations.

## What this rule reports

Reports `runs.pre-if` when `runs.pre` is missing.

## Why this rule exists

`pre-if` has no effect unless a `pre` hook exists.

## ❌ Incorrect

```yaml
runs:
  using: node20
  main: dist/index.js
  pre-if: runner.os == 'Linux'
```

## ✅ Correct

```yaml
runs:
  using: node20
  pre: dist/setup.js
  pre-if: runner.os == 'Linux'
  main: dist/index.js
```

## Behavior and migration notes

The autofixer removes the orphaned `runs.pre-if` line because that key has no effect without `runs.pre`. If you meant to run setup conditionally, add the missing `runs.pre` hook after applying the fix.

## Additional examples

For larger repositories, this rule is often enabled together with one of the published presets so violations are caught in pull requests before workflow changes are merged.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [
  {
    files: ["**/*.{yml,yaml}"],
    plugins: {
      "github-actions": githubActions,
    },
    rules: {
      "github-actions/no-pre-if-without-pre": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.

## Further reading

- [GitHub Actions metadata syntax: `runs` for JavaScript actions](https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#runs-for-javascript-actions)
