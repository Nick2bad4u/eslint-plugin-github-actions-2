# require-fetch-metadata-github-token

> **Rule catalog ID:** R110

## Targeted pattern scope

Workflow steps that use `dependabot/fetch-metadata`.

## What this rule reports

This rule reports fetch-metadata steps that do not configure `with.github-token`.

## Why this rule exists

`dependabot/fetch-metadata` needs a token to retrieve pull request dependency metadata. Requiring the token input makes the workflow contract explicit and avoids subtle runtime failures.

## ❌ Incorrect

```yaml
- uses: dependabot/fetch-metadata@v2
```

## ✅ Correct

```yaml
- uses: dependabot/fetch-metadata@v2
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Additional examples

This rule only checks for the presence of a non-empty token input. It does not prescribe a specific secret name.

## ESLint flat config example

```ts
import githubActions from "eslint-plugin-github-actions-2";

export default [githubActions.configs.security];
```

## When not to use it

Disable this rule only if the action changes to no longer require an explicit token input.

## Further reading

- [dependabot/fetch-metadata](https://github.com/dependabot/fetch-metadata)
