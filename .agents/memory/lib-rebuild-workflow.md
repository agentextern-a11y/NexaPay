---
name: Library Rebuild Workflow
description: How to keep lib package dist/ declarations in sync with src/ changes.
---

## Rule
After editing `lib/` package source files, always run `pnpm run typecheck:libs` (or `tsc --build`) to regenerate `dist/` declarations. Consuming packages reference `dist/`, not `src/`.

## Why
In this workspace, `lib/api-client-react` exports `.` to `./src/index.ts` but the dist declarations are what TypeScript project references actually use. If src changes but dist isn't rebuilt, downstream packages see stale/missing exports.

## How to apply
1. Edit source in `lib/<package>/src/`.
2. Run `pnpm run typecheck:libs` from workspace root.
3. Verify downstream with `pnpm -r --filter <consumer> run typecheck`.
