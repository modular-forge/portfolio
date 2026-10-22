---
paths:
  - 'src/**/*.spec.ts'
---

# Unit tests (Vitest through `ng test`)

- Runner: Vitest via `@angular/build:unit-test`, with Vitest globals (`describe`, `it`,
  `expect`, `vi`). Do not add Jasmine or Karma APIs. See the `angular-developer` skill,
  `references/testing-fundamentals.md`, for TestBed patterns.
- One spec next to each file it tests (`thing.ts` → `thing.spec.ts`).
- Test behaviour through the public surface: rendered DOM (roles, text, attributes), inputs,
  outputs and service methods. Do not test private members or implementation details.
- Act, wait, assert: change state through signals, inputs or DOM events, then
  `await fixture.whenStable()`, then assert. No `fixture.detectChanges()` or `markForCheck()`.
  Timers with `vi.useFakeTimers()`.
- Deterministic tests only: no real network, no real time, no order dependence. Mock HTTP with
  `provideHttpClientTesting`.
- Run one file while working: `npx ng test --include <path/to/file.spec.ts> --watch=false`.
  Before finishing: `npm run test:ci` (coverage thresholds in `angular.json`; do not lower them).
- A failing test is information: fix the code or ask; never delete or skip a test to go green.
