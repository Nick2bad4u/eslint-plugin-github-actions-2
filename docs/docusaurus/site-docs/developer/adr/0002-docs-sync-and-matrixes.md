# ADR-0002: Docs sync and matrixes from source metadata

- **Status:** accepted
- **Date:** 2026-03-21

## Context

Rule/preset tables in docs and README can drift when maintained manually.

## Decision

Generate matrix-style docs sections from plugin metadata using scripts, and keep
README/docs checks in CI and local workflows.

## Consequences

- Reduced manual drift risk.
- Easier updates when rules/presets evolve.
- Build/check steps become more important in contributor workflow.
