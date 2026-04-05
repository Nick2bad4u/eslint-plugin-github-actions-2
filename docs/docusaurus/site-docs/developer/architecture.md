# Architecture overview

## Plugin shape

At a high level, the plugin exports:

- a rule registry
- flat-config presets (`githubActions.configs.*`)
- metadata used by docs and tests

Core sources live in `src/`, and tests live in `test/`.

## Rule metadata contract

Each rule is expected to provide stable `meta.docs` metadata including config
membership, which drives both runtime validation and docs generation.

See ADRs for rationale:

- [ADR-0001 Rule metadata contract](./adr/0001-rule-metadata-contract.md)
- [ADR-0002 Docs sync and matrixes](./adr/0002-docs-sync-and-matrixes.md)

## Docs architecture

The docs site has two main tracks:

- **End-user docs** under `docs/rules` (rule pages and presets)
- **Developer docs** under `docs/docusaurus/site-docs/developer`

TypeDoc output is generated into `docs/docusaurus/site-docs/developer/api` and
exposed in the docs sidebar.

## CI/release posture

The repository emphasizes:

- strict type safety
- robust lint/test gates
- synchronized docs tables/matrixes from source metadata
- reproducible docs builds

See [Maintenance playbooks](./maintenance/index.md) for
operational detail.
