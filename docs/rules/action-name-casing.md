# action-name-casing

> **Rule catalog ID:** R009

## Targeted pattern scope

GitHub Actions workflow YAML files that declare a top-level `name`.

## What this rule reports

This rule reports workflow `name` values whose casing does not match the configured naming convention.

## Why this rule exists

Consistent workflow names make Actions tabs, status checks, and release dashboards easier to scan. Teams that standardize naming conventions can search and review workflow runs more quickly.

## ❌ Incorrect

```yaml
name: releasePipeline
```

## ✅ Correct

```yaml
name: Release Pipeline
```

```yaml
name: release-pipeline
```

_The second example is valid when the rule is configured for `kebab-case`._

## Behavior and migration notes

When the rule is configured with exactly one allowed casing, the autofixer rewrites the workflow `name` into that casing. If multiple casings are allowed at once, the rule stays report-only because there is no single unambiguous target format.

### Options

The rule defaults to `"Title Case"`. You can pass a casing name directly or use an options object with casing names as boolean flags.

- `ignores` is an array of exact workflow names to exempt.
- `allowPattern` is a JavaScript regular expression source string, matched case-sensitively in Unicode mode. Use `^` and `$` when you want to match the whole name.

If a name matches either exception, the rule leaves it alone. All other names must match an enabled casing, with Title Case as the fallback when the options object enables none.

## Additional examples

Use a single pattern to allow titles such as `CodeQL`, `CodeQL Advanced`, `.NET`, and `C/C++ CI` while enforcing Title Case elsewhere. The example below matches product tokens at the beginning of a name and accepts any title that starts with one of those tokens followed by a space.

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
   "github-actions/action-name-casing": [
    "error",
    {
     "Title Case": true,
     allowPattern: "^(?:CodeQL|\\.NET|C/C\\+\\+)(?: |$)",
    },
   ],
  },
 },
];
```

## When not to use it

You can disable this rule when its policy does not match your repository standards, or when equivalent enforcement is already handled by another policy tool.

## Further reading

- [GitHub Actions workflow syntax: `name`](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#name)
- [GitHub Actions docs: Using workflow run logs](https://docs.github.com/actions/monitoring-and-troubleshooting-workflows/using-workflow-run-logs)
