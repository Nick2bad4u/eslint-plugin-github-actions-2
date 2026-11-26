# step-name-casing

> **Rule catalog ID:** R118

## Targeted pattern scope

GitHub Actions workflow YAML files whose steps declare a `name`, and composite action metadata files (`action.yml` or `action.yaml` with `runs.using: composite`) whose steps declare a `name`.

## What this rule reports

This rule reports `jobs.<job_id>.steps[*].name` and composite `runs.steps[*].name` values whose casing does not match the configured naming convention.

## Why this rule exists

Step names label every section of a job log. Consistent casing makes logs easier to scan and keeps workflows and composite actions reading the same way.

## ❌ Incorrect

```yaml
jobs:
 build:
  runs-on: ubuntu-latest
  steps:
   - name: check out source
     uses: actions/checkout@v7
   - name: run `npm test` on ${{ matrix.os }}
     run: npm test
```

## ✅ Correct

```yaml
jobs:
 build:
  runs-on: ubuntu-latest
  steps:
   - name: Check Out Source
     uses: actions/checkout@v7
   - name: Run `npm test` on ${{ matrix.os }}
     run: npm test
```

## Behavior and migration notes

Title Case changes only letter case. Whitespace, punctuation, `${{ … }}` expressions, and backtick code spans are kept as written, and expressions and code spans count as words when deciding whether a small word such as `on` is first or last. Words follow the same product dictionary as `action-name-casing`, so `node.js` becomes `Node.js` and `npm` stays lowercase, and words with deliberate internal capitals or digits, such as `CodeQL` or `22.x`, are kept. Names that are only an expression are accepted.

When exactly one casing is allowed, the autofixer rewrites plain and quoted scalars without escapes. Block scalars, escaped strings, and configurations that allow more than one casing are report-only.

### Options

The rule defaults to `"Title Case"`. You can pass a casing name directly or use an options object with casing names as boolean flags, matching `action-name-casing`.

- `ignores` is an array of exact step names to exempt.
- `allowPattern` is a JavaScript regular expression source string, matched case-sensitively in Unicode mode.

The identifier-style casings (`camelCase`, `kebab-case`, `PascalCase`, `SCREAMING_SNAKE_CASE`, `snake_case`, and `Train-Case`) skip names that contain expressions or code spans, because converting them would rewrite the embedded text.

## Additional examples

```yaml
name: Setup
description: Install project dependencies
runs:
 using: composite
 steps:
  - name: Set Up Node.js 22.x
    uses: actions/setup-node@v7
  - name: Install Dependencies
    run: npm ci
    shell: bash
```

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [
 {
  files: [".github/workflows/*.{yml,yaml}", "**/action.{yml,yaml}"],
  plugins: {
   "github-actions": githubActions,
  },
  rules: {
   "github-actions/step-name-casing": [
    "error",
    {
     "Title Case": true,
     ignores: ["npm ci"],
    },
   ],
  },
 },
];
```

## When not to use it

You can disable this rule when step names are generated, mirror command lines on purpose, or follow another convention enforced elsewhere.

## Further reading

- [GitHub Actions workflow syntax: `jobs.<job_id>.steps[*].name`](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsname)
- [GitHub Actions metadata syntax: `runs.steps[*].name`](https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax#runsstepsname)
