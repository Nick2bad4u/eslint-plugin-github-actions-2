# Docs authoring

## Docs surfaces

- End-user rule docs: `docs/rules/`
- Docusaurus site docs: `docs/docusaurus/site-docs/`
- TypeDoc API output: `docs/docusaurus/site-docs/developer/api/`

## Common tasks

### Update README rules matrix

```sh
npm run sync:readme-rules-table
node scripts/sync-readme-rules-table.mjs --check
```

### Regenerate TypeDoc docs

```sh
npm run docs:api
```

### Build docs site

```sh
npm run --workspace docs/docusaurus build:fast
```

## Style guidance

- Prefer short paragraphs and descriptive headings.
- Use consistent terminology across rules, presets, and developer docs.
- Keep links stable and avoid duplicated sources of truth.
