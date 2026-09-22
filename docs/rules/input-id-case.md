# input-id-case

> **Rule catalog ID:** R116

Enforce a consistent casing convention for declared action and workflow input identifiers.

## Targeted pattern scope

This rule checks input declaration keys in:

- Top-level `inputs` in `action.yml` and `action.yaml`, for JavaScript, Docker, and composite actions.
- `on.workflow_call.inputs` and `on.workflow_dispatch.inputs` in GitHub Actions workflow files.

It does not check `with` keys in action steps or reusable workflow calls, because those names belong to the interface being called. Output names and input references are also outside its scope. Direct declarations wrapped in YAML tags or anchors are inspected; alias and merge references are not expanded.

## What this rule reports

The rule reports each input identifier that does not match any configured casing convention, unless its exact name appears in `ignores`. The default is `kebab-case`, also commonly called dash-case. This is a configurable project style choice, not a GitHub requirement to use dashes.

## Why this rule exists

Consistent input names make action interfaces and workflow forms easier to read. This rule belongs to the opt-in `stylistic` preset and the comprehensive `all` preset; it is not enabled by `recommended`, `strict`, or `actionMetadata`.

## ❌ Incorrect

```yaml
# action.yml
inputs:
 buildTarget: # The default convention requires build-target.
  description: Target to build
```

```yaml
on:
 workflow_dispatch:
  inputs:
   build_target: # The default convention requires build-target.
    type: string
```

## ✅ Correct

```yaml
# action.yml
inputs:
 build-target:
  description: Target to build
```

```yaml
on:
 workflow_call:
  inputs:
   build-target:
    type: string
```

## Behavior and migration notes

This rule does not provide automatic fixes or editor suggestions. Input names are public interfaces: renaming a declaration can break external callers, `inputs` expressions, and `INPUT_*` environment access. Coordinate those changes manually, or add an existing public name to `ignores` until it can be migrated safely.

## Additional examples

### Options

The rule accepts one style string or an object allowing multiple styles:

```ts
type Casing =
 | "camelCase"
 | "kebab-case"
 | "PascalCase"
 | "SCREAMING_SNAKE_CASE"
 | "snake_case"
 | "Train-Case";

type Options = [
 Casing | (Partial<Record<Casing, boolean>> & { ignores?: string[] }),
];
```

The default option is `"kebab-case"`. Use this spelling for dash-case as well. The options match `job-id-casing`; title case with spaces is not supported for identifiers.

| Option                   | Accepted example |
| ------------------------ | ---------------- |
| `"camelCase"`            | `buildTarget`    |
| `"kebab-case"`           | `build-target`   |
| `"PascalCase"`           | `BuildTarget`    |
| `"SCREAMING_SNAKE_CASE"` | `BUILD_TARGET`   |
| `"snake_case"`           | `build_target`   |
| `"Train-Case"`           | `Build-Target`   |

In object form, each `true` flag enables that convention. If no flags are enabled, the rule falls back to `kebab-case`. The `ignores` array contains literal, case-sensitive identifiers, not patterns or regular expressions.

```ts
const rules = {
 "github-actions/input-id-case": ["error", "snake_case"],
};
```

```ts
const rules = {
 "github-actions/input-id-case": [
  "error",
  {
   "kebab-case": true,
   snake_case: true,
   ignores: ["legacyInput"],
  },
 ],
};
```

The second configuration accepts `build-target`, `build_target`, and the exact name `legacyInput`.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";
import * as yamlParser from "yaml-eslint-parser";

export default [
 {
  files: [".github/workflows/*.{yml,yaml}", "**/action.{yml,yaml}"],
  languageOptions: { parser: yamlParser },
  plugins: { "github-actions": githubActions },
  rules: {
   "github-actions/input-id-case": ["error", "kebab-case"],
  },
 },
];
```

## When not to use it

Disable this rule when input names must preserve an externally established naming convention that cannot be expressed by its supported styles. Use literal ignores for a small number of compatibility exceptions.

## Further reading

- [GitHub action input metadata](https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax#inputs)
- [Reusable workflow inputs](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_callinputs)
- [Manual workflow inputs](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_dispatchinputs)
