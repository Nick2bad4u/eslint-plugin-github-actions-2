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

- [ADR-0001 Rule metadata contract](pathname:///docs/developer/adr/rule-metadata-contract)
- [ADR-0002 Docs sync and matrixes](pathname:///docs/developer/adr/docs-sync-and-matrixes)

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

See [Maintenance playbooks](pathname:///docs/developer/maintenance) for
operational detail.
