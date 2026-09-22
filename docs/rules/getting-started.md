# Getting started

Use this guide to install the plugin, enable your first preset, and quickly
navigate to the rule and preset reference docs.

## Install

```sh
npm install --save-dev eslint eslint-plugin-github-actions-2
```

## Flat config example

```js
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.recommended];
```

## What the presets do for you

The exported presets already:

- scope themselves to their intended workflow, action metadata, or configuration files
- register `yaml-eslint-parser`
- register the `github-actions` plugin namespace

## Choosing a preset

- Start with `recommended` for most repositories.
- Add `security` when you want immutable pinning checks.
- Add `stylistic` for consistent workflow names, job IDs, and input IDs across workflows and action metadata.
- Use `strict` when you want concurrency and stronger operational guardrails.
- Use `all` for the complete bundled rule set, with explicitly opt-in policy rules enabled separately.

For target-specific linting, use:

- `actionMetadata` for `action.yml`/`action.yaml`
- `workflowTemplates` for `workflow-templates/*.yml` and `*.yaml`
- `workflowTemplateProperties` for `workflow-templates/*.properties.json`

## Next steps

- Review the [preset reference](./presets/index.md)
- Browse the full [rule reference](./overview.md)
- See the official
  [workflow syntax documentation](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions)
