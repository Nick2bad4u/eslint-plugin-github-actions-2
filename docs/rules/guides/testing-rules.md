# Testing rules and fixtures

## Test structure

Rule tests are under `test/` and should validate:

- positive cases (expected reports)
- negative cases (no reports)
- fixer/suggestion behavior when applicable
- option combinations and edge cases

## Recommended loop

```sh
npm run build
npm run test
```

For focused work, run relevant test files directly through Vitest filters.

## Coverage expectations

- Cover primary rule branches.
- Include malformed input and boundary conditions.
- Assert message IDs rather than only counts where possible.

## Regression strategy

When fixing a bug:

1. add a failing test that reproduces the issue,
2. implement fix,
3. ensure test passes,
4. keep the new test in the suite as a regression guard.
