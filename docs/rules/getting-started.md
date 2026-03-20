# Getting started

Use this guide to install the plugin, enable your first preset, and quickly
navigate to the rule and preset reference docs.

## Install

```sh
npm install --save-dev eslint eslint-plugin-github-actions
```

## Flat config example

```js
import githubActions from "eslint-plugin-github-actions";

export default [githubActions.configs.recommended];
```

## What the presets do for you

The exported presets already:

- scope themselves to `.github/workflows/*.{yml,yaml}`
- register `yaml-eslint-parser`
- register the `github-actions` plugin namespace

## Choosing a preset

- Start with `recommended` for most repositories.
- Add `security` when you want immutable pinning checks.
- Use `strict` when you want concurrency and stronger operational guardrails.
- Use `all` to enable every published rule.

For target-specific linting, use:

- `actionMetadata` for `action.yml`/`action.yaml`
- `workflowTemplates` for `workflow-templates/*.yml` and `*.yaml`
- `workflowTemplateProperties` for `workflow-templates/*.properties.json`

## Next steps

- Review the [preset reference](./presets/index.md)
- Browse the full [rule reference](./overview.md)
- See the official
  [workflow syntax documentation](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions)
