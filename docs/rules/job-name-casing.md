# job-name-casing

> **Rule catalog ID:** R117

## Targeted pattern scope

GitHub Actions workflow YAML files whose jobs declare a `name`, including reusable-workflow caller jobs.

## What this rule reports

This rule reports `jobs.<job_id>.name` values whose casing does not match the configured naming convention.

## Why this rule exists

Job names are what the Actions UI, run summaries, and pull request checks display. Consistent casing keeps those lists easy to scan and makes required status checks predictable to configure.

## ❌ Incorrect

```yaml
jobs:
 lint:
  name: lint code and docs
  runs-on: ubuntu-latest
  steps:
   - run: npm run lint
```

## ✅ Correct

```yaml
jobs:
 lint:
  name: Lint Code and Docs
  runs-on: ubuntu-latest
  steps:
   - run: npm run lint
```

```yaml
jobs:
 package:
  name: Validate Package on ${{ matrix.os }}
  runs-on: ${{ matrix.os }}
  steps:
   - run: npm pack
```

## Behavior and migration notes

Title Case changes only letter case. Whitespace, punctuation, `${{ … }}` expressions, and backtick code spans are kept as written, and expressions and code spans count as words when deciding whether a small word such as `on` is first or last. Words follow the same product dictionary as `action-name-casing`, so `github` becomes `GitHub` and `npm` stays lowercase, and words with deliberate internal capitals or digits, such as `CodeQL` or `v4`, are kept. Names that are only an expression are accepted.

A job's `name` is also its check-run name, so renaming a job can break required status checks in branch protection or rulesets. This rule therefore offers a suggestion rather than an autofix; after applying it, update any required checks that use the old name.

Suggestions are offered when exactly one casing is allowed and the name is a plain or quoted scalar without escapes. Block scalars and escaped strings are reported without a suggestion.

### Options

The rule defaults to `"Title Case"`. You can pass a casing name directly or use an options object with casing names as boolean flags, matching `action-name-casing`.

- `ignores` is an array of exact job names to exempt.
- `allowPattern` is a JavaScript regular expression source string, matched case-sensitively in Unicode mode.

The identifier-style casings (`camelCase`, `kebab-case`, `PascalCase`, `SCREAMING_SNAKE_CASE`, `snake_case`, and `Train-Case`) skip names that contain expressions or code spans, because converting them would rewrite the embedded text.

## Additional examples

```yaml
jobs:
 test:
  name: Test on Node ${{ matrix.node }} with ESLint ${{ matrix.eslint }}
  runs-on: ubuntu-latest
  steps:
   - run: npm test
 deploy:
  name: Deploy to AWS (Production)
  runs-on: ubuntu-latest
  steps:
   - run: ./deploy.sh
```

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [
 {
  files: [".github/workflows/*.{yml,yaml}"],
  plugins: {
   "github-actions": githubActions,
  },
  rules: {
   "github-actions/job-name-casing": [
    "error",
    {
     "Title Case": true,
     allowPattern: "^CodeQL",
    },
   ],
  },
 },
];
```

## When not to use it

You can disable this rule when job names are generated, intentionally follow another convention, or are referenced by required status checks you cannot rename yet.

## Further reading

- [GitHub Actions workflow syntax: `jobs.<job_id>.name`](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idname)
- [GitHub docs: About protected branches](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
