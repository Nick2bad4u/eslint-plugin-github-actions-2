---
slug: maintainer-workflow-baseline
title: Maintainer workflow baseline
authors: [nick2bad4u]
tags: [maintainers, workflow, quality]
---

To keep contributions predictable and high-signal, our baseline maintainer loop is:

<!-- truncate -->

1. implement changes in `src/` and corresponding tests in `test/`
2. update user/developer docs for any observable behavior shift
3. run typecheck, lint, tests, and docs build before opening PR

By treating docs, metadata, and tests as one unit, we reduce drift and make
releases safer.
