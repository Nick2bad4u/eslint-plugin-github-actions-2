# Docs pipeline

## Sources of truth

- Rule docs and presets content in `docs/rules/`
- Developer docs in `docs/docusaurus/site-docs/developer/`
- README rules matrix from `scripts/sync-readme-rules-table.mjs`
- TypeDoc output from `npm run docs:api`

## Local docs validation

```sh
npm run docs:api
npm run --workspace docs/docusaurus build:fast
node scripts/sync-readme-rules-table.mjs --check
```

## Published inspector tools

- [ESLint Config Inspector](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/eslint-inspector/)
- [Stylelint Config Inspector](https://nick2bad4u.github.io/eslint-plugin-github-actions-2/stylelint-inspector/)

## Common failure classes

- stale generated docs or table output
- broken markdown links
- mismatched preset metadata and matrix rendering

When failures happen, prefer fixing source metadata and regeneration scripts over
manual patching of generated outputs.
