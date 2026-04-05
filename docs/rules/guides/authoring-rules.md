# Authoring ESLint rules

This guide covers how to add or evolve a rule safely.

## Workflow

1. Create or update a rule module under `src/rules/`.
2. Ensure `meta.docs` and preset metadata are correct.
3. Register the rule if needed via the internal rules registry.
4. Add rule docs in `docs/rules/<rule-name>.md`.
5. Add tests in `test/` for valid/invalid cases and edge behavior.

## Metadata checklist

- `meta.docs.description` is clear and actionable.
- `meta.docs.url` points to the docs page.
- `meta.docs.configs` includes correct preset references.
- `meta.messages` has stable message IDs.

## Safety checks

Run before opening a PR:

```sh
npm run typecheck
npm run test
npm run lint:all
```

## Tips

- Prefer narrow, deterministic diagnostics over broad heuristics.
- Keep rule options minimal and strongly typed.
- Avoid false positives in common workflow patterns.
