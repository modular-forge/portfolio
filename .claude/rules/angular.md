---
paths:
  - 'src/**/*.ts'
  - 'src/**/*.html'
---

# Angular code (TypeScript and templates)

Framework details live in the `angular-developer` skill and the Angular CLI MCP server
(`get_best_practices`, `search_documentation`). Check the installed Angular version in
`package.json` before applying any guidance. These rules are the project's own choices.

- Follow the patterns already in `src/`. Read two or three similar files before writing a new one.
- Generate files with `npx ng generate <schematic> <name>` so naming, selectors and file layout
  match `angular.json`. Keep the project's file naming (Angular v20+ style: `thing.ts`,
  `thing.html`, `thing.scss`, `thing.spec.ts`, no `.component` suffix) unless the project already
  uses suffixes.
- Selector prefix comes from `angular.json` (`prefix`); ESLint enforces it.
- State with signals (`signal`, `computed`, `linkedSignal`, `resource`); component API with
  `input()`, `output()` and `model()`; dependencies with `inject()`. No new `BehaviorSubject` state.
- Templates use the built-in control flow (`@if`, `@for` with `track`, `@switch`, `@defer`).
- No `any`. Use precise types or `unknown` plus narrowing. Do not silence the type checker
  (`as any`, `@ts-ignore`, non-null `!` without a reason in a comment).
- Lazy-load feature routes with `loadComponent` / `loadChildren`.
- If the app prerenders or uses SSR, components and services also run on Node: no `window`,
  `document`, `localStorage` or layout APIs while rendering. Browser-only work goes in
  `afterNextRender` / `afterRenderEffect`; use the `DOCUMENT` token instead of the global; never
  render different templates per platform (it breaks hydration).
- Images: `NgOptimizedImage` with explicit `width` and `height` (or `fill`), meaningful `alt`.
- Accessibility is part of correctness: semantic HTML first (`button`, `a`, `nav`, `main`,
  headings in order), labels for every control, visible focus, no information by colour alone.
  The template ESLint rules include the accessibility set; do not disable them.
- External links: `rel="noopener noreferrer"` with `target="_blank"`, and only `https://` URLs.
- Never bind untrusted HTML (`[innerHTML]`) or bypass the sanitizer (`bypassSecurityTrust*`).
