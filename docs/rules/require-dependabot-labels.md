# require-dependabot-labels

> **Rule catalog ID:** R080

## Targeted pattern scope

Dependabot update entries and multi-ecosystem groups that decide pull request labels.

## What this rule reports

This rule reports update entries that do not resolve to a non-empty `labels` list, either directly or via `multi-ecosystem-groups` inheritance.

## Why this rule exists

Labels are a high-leverage way to route Dependabot pull requests into automation, project boards, or triage queues. Requiring them keeps dependency updates easy to filter and process consistently.

## ❌ Incorrect

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      time: "05:30"
      timezone: "UTC"
```

## ✅ Correct

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      time: "05:30"
      timezone: "UTC"
    labels:
      - "dependabot"
      - "dependencies"
```

## Additional examples

This rule is a strong fit when Dependabot pull requests feed dashboards, project automation, or triage workflows that rely on consistent labels.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.dependabot];
```

## When not to use it

Disable this rule if the repository intentionally accepts Dependabot's default labels without any custom triage flow.

## Further reading

- [Dependabot options reference: labels](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#labels--)
- [Customizing Dependabot pull requests: Labeling pull requests with custom labels](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/customizing-dependabot-prs#labeling-pull-requests-with-custom-labels)
