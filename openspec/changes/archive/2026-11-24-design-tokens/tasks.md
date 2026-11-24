# Tasks

## 1. Self-hosted fonts

- [x] 1.1 Download the Latin-subset `woff2` files from the Google Fonts CSS API (Fraunces roman and
      italic variable with `opsz`, `wght`, `SOFT`; Inter variable `wght` 400–700; JetBrains Mono 400
      and 600) into `public/fonts/<family>/`; verify each file starts with the `wOF2` signature and
      that `npm run build` copies them to `dist/portfolio/browser/fonts/`
- [x] 1.2 Add each family's `OFL.txt` from the `google/fonts` repository next to its files; verify
      the three licence files exist and name the right font
- [x] 1.3 Write `public/fonts/README.md` with the exact API query, the `unicode-range`, the source of
      each licence and the size of every file; verify the documented query returns the same files
- [x] 1.4 Declare the `@font-face` rules in `src/styles.scss` (same-origin URLs, `font-display: swap`,
      the Latin `unicode-range`, `font-style` and weight or axis ranges); verify in the browser's
      network panel that the fonts load from the site's origin and nothing goes to a third party

## 2. Tokens and themes

- [x] 2.1 Add the raw palette, semantic colour roles, font families, type scale (`clamp()` in `rem`)
      and spacing scale to `:root` in `src/styles.scss` as described in `design.md`; verify
      `npm run lint:styles` passes
- [x] 2.2 Add the dark role assignment in a Sass mixin used by `@media (prefers-color-scheme: dark)`
      on `:root:not([data-theme='light'])` and by `:root[data-theme='dark']`, plus
      `:root[data-theme='light']`, with `color-scheme` set for each case; verify in the browser with
      emulated light and dark schemes that background and text match the spec scenarios and that
      setting `data-theme` on `<html>` overrides the system preference
- [x] 2.3 Add `<meta name="color-scheme" content="light dark">` to `src/index.html`; verify it is
      present in the prerendered `dist/portfolio/browser/index.html`

## 3. Base elements and emphasis

- [x] 3.1 Style `html`/`body` (background, ink, body font and size, line height,
      `font-size-adjust: from-font`), headings (display font, weights, scale) and `::selection`;
      verify computed styles in the browser match the tokens in both themes
- [x] 3.2 Style links: gradient underline in `--color-link-line`, fill to `--color-link-hover-bg` with
      `--color-link-hover-ink` on `:hover` and `:focus-visible`, colour transition always on; verify
      the link and hover pairs measure at least 4.5:1 in both themes (`design.md` table)
- [x] 3.3 Style `strong` as a marker band in `--color-mark`; verify bold text contrast is at least
      4.5:1 in both themes
- [x] 3.4 Add the `:focus-visible` outline in `--color-focus`; verify by tabbing through the page that
      every link and button shows it in both themes

## 4. Motion

- [x] 4.1 Add the `text-rise` keyframes and `.text-rise` utility (staggered by `--rise-index`) and the
      marker draw-in, the underline growth on hover, all inside
      `@media (prefers-reduced-motion: no-preference)`; verify with emulated reduced motion that
      headings and markers appear in their final state with no movement, and without it that they
      animate once without flashing

## 5. Integration

- [x] 5.1 Check the whole change in a real browser at phone (390 px) and desktop (1440 px) widths, in
      light and dark, with and without reduced motion, against every scenario of
      `specs/visual-theme/spec.md`; record the result in the PR description
- [x] 5.2 Run `npm run check`, `npm run test:ci` and `npm run build`; all three must pass

## Workflow follow-up

- Review loop from `CLAUDE.md` ("Commits and review"), then PR and merge after the user's OK.
- Archive the change with `/opsx:archive` after the merge, and propose closing PF-1.
