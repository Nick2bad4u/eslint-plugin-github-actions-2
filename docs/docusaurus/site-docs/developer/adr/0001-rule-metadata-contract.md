# ADR-0001: Rule metadata contract

- **Status:** accepted
- **Date:** 2026-03-21

## Context

Rule metadata drives more than lint output. It also feeds docs generation,
preset matrixes, and consistency checks.

Without a strict metadata contract, docs and runtime behavior can drift.

## Decision

Maintain a strict rule metadata contract where each rule declares stable docs
metadata, including preset membership references.

## Consequences

- Better alignment between runtime behavior and generated docs.
- Earlier failures when metadata is missing or invalid.
- Slightly higher authoring discipline for new rules.
