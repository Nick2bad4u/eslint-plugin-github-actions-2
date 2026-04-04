# no-post-if-without-post

> **Rule catalog ID:** R046

## Targeted pattern scope

Action metadata `runs.post-if` declarations.

## What this rule reports

Reports `runs.post-if` when `runs.post` is missing.

## Why this rule exists

`post-if` has no effect without a matching `post` hook.

## ❌ Incorrect

```yaml
runs:
  using: node20
  main: dist/index.js
  post-if: runner.os == 'Linux'
```

## ✅ Correct

```yaml
runs:
  using: node20
  main: dist/index.js
  post: dist/cleanup.js
  post-if: runner.os == 'Linux'
```

## Behavior and migration notes

The autofixer removes the orphaned `runs.post-if` line because that key has no effect without `runs.post`. If you intended a guarded cleanup hook, add `runs.post` manually instead of relying on the fix alone.

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
      "github-actions/no-post-if-without-post": "error",
    },
  },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.

## Further reading

- [GitHub Actions metadata syntax: `runs` for JavaScript actions](https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#runs-for-javascript-actions)
