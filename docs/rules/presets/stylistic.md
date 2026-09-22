---
sidebar_position: 9
---

# `githubActions.configs.stylistic`

Opt-in naming conventions for workflow names, job identifiers, and workflow and action input identifiers.

This preset targets `.github/workflows/*.{yml,yaml}` and `**/action.{yml,yaml}`. It uses Title Case for workflow names and `kebab-case` for job and input identifiers. Input casing is a repository preference; it is not enabled by `recommended` or `actionMetadata`.

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [
 githubActions.configs.recommended,
 githubActions.configs.actionMetadata,
 githubActions.configs.stylistic,
];
```

Override `github-actions/input-id-case` after these presets to select another convention or ignore existing public input names. Input identifiers are report-only because renaming them can break external callers.

## Included rules

Fix legend:

- 🔧 = autofixable
- 💡 = suggestions available
- — = report only

| Rule                                                                                             | Fix |
| ------------------------------------------------------------------------------------------------ | :-: |
| <span class="sb-inline-rule-number">R009</span> [`action-name-casing`](../action-name-casing.md) | 🔧  |
| <span class="sb-inline-rule-number">R116</span> [`input-id-case`](../input-id-case.md)           |  —  |
| <span class="sb-inline-rule-number">R010</span> [`job-id-casing`](../job-id-casing.md)           |  —  |
