# Tasks

## 1. Localized build

- [ ] 1.1 Run `ng add @angular/localize@22.2.4`; review what it changed (`package.json`, polyfills
      for build and test, tsconfig types) and keep only what the docs require; verify
      `npm run test:ci` still passes
- [ ] 1.2 Add the project `i18n` block (`sourceLocale: "en"`, `es` →
      `src/locale/messages.es.xlf`), `localize: true`, `i18nMissingTranslation: "error"` and
      `i18nDuplicateTranslation: "error"` for production, plus the `development-es` build and serve
      configurations and a `start:es` script, as in `design.md` Decision 2; verify `npm run build`
      writes `dist/portfolio/browser/en/index.html` and `dist/portfolio/browser/es/index.html` with
      `<base href="/en/">` and `<base href="/es/">`, and `npm run start:es` serves Spanish locally
- [ ] 1.3 Inspect the built output for fonts and `favicon.ico` under each locale; if the
      root-absolute `/fonts/…` URLs do not resolve from `/en/` and `/es/`, change the `@font-face`
      URLs as in `design.md` Decision 9; verify in the browser's network panel, serving
      `dist/portfolio/browser` locally, that every font loads from the same origin under both
      prefixes, and record the chosen form in `design.md`
- [ ] 1.4 Confirm the prerendered `index.html` of each locale has the right `<html lang>`; note in
      `design.md` Decision 7 whether the build sets it or the metadata service must

## 2. Translation workflow

- [ ] 2.1 Install `ng-extract-i18n-merge` 3.5.0 (exact, dev) with its `ng add` schematic; configure
      it from its installed schema for XLIFF 1.2, output `src/locale/`, target `es`; add an
      `extract-i18n` script; verify `npm run extract-i18n` writes `messages.xlf` and
      `messages.es.xlf` and running it twice produces no diff
- [ ] 2.2 Verify the failure path: add a temporary `i18n` text without translating it and check that
      `npm run build` fails naming it, then change its English text after translating and check it
      fails again; remove the temporary text and record the result in the task summary

## 3. Locale helper and metadata

- [ ] 3.1 Write the specs first, then add `src/app/i18n/` with the supported locales, their own
      names, the site origin and the pure URL function (`design.md` Decision 5); verify the specs
      cover both locales, the root path, nested paths and query-free output
- [ ] 3.2 Write the spec first, then add the page metadata service (`design.md` Decision 7): title
      and description with `$localize` (meaning and description), alternates `en`, `es`,
      `x-default` as absolute URLs, replaced on each navigation; verify the spec and, after
      `npm run build`, that `dist/portfolio/browser/es/index.html` has the Spanish title,
      description and the three alternates

## 4. Language switcher

- [ ] 4.1 Write the spec first, then add the switcher component and a minimal `<header>` in
      `app.html` (`design.md` Decision 6), styled only with existing tokens; verify the spec (link
      target, `lang`, `hreflang`, text per locale) and, in the browser at 375 px and 1280 px, that
      `/en/` links to `/es/` and back, it is reachable by keyboard with visible focus, and no cookie
      or storage entry is written
- [ ] 4.2 Extract and translate the new texts into `messages.es.xlf`; verify `npm run extract-i18n`
      leaves no unit without a target and `npm run build` passes

## 5. Documentation

- [ ] 5.1 Update `CLAUDE.md` (with the `docs` agent): i18n stack line, `start:es` and
      `extract-i18n` commands, how to add or change a text, the locale-prefixed URLs (resolving the
      "revisited when i18n is set up" note for `/projects/<slug>`), the `{ en, es }` convention for
      data files, and that `dist` now has one folder per locale; verify every command written there
      runs as documented

## 6. Final check

- [ ] 6.1 Run `npm run check`, `npm run test:ci` and `npm run build`; all three must pass

## Workflow follow-up

- Do not merge until CW-2 (ci-web handles per-locale folders) is released, `ci.yml` is pinned to it
  (CI file change, asked for separately) and the hosting configuration is ready (`design.md`
  Decision 8 and Migration Plan).
- After the merge, apply the hosting configuration and check `/`, `/en/`, `/es/`, a non-prerendered
  path and the fonts in production.
- Archive the change with `/opsx:archive` and sync `site-localization` into `openspec/specs/`.
