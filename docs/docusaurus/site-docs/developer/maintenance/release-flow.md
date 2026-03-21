# Release flow

## Suggested release checklist

1. Ensure all tests, lint, and typecheck pass.
2. Confirm docs and README sync checks are green.
3. Build docs (`npm run docs:build`) and verify key pages.
4. Review changelog/release notes.
5. Publish and validate package/docs availability.

## Verification commands

```sh
npm run release:verify
```

This includes build, lint, typecheck, tests, docs build, and package dry run.
