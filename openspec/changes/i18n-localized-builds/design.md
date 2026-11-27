# Design

## Context

- Angular 22.2 (`@angular/core` 22.2.4, `@angular/build` 22.2.5), static prerender
  (`outputMode: "static"`, one `**` server route with `RenderMode.Prerender`), no routes yet.
- `src/app/app.html` is still the Angular placeholder; there is no header. PF-4 replaces it.
- `src/index.html` has `<html lang="en">` and `<base href="/">`.
- Self-hosted fonts live in `public/fonts/` and `src/styles.scss` references them with root-absolute
  URLs (`url('/fonts/…')`), decided in the `design-tokens` change.
- CI (`modular-forge/ci-web`, pinned by SHA) publishes `dist/portfolio/browser` and its verify step
  expects `index.html` at that root.
- Option names below were checked against the installed schemas: `@angular/cli` workspace schema
  (`i18n.sourceLocale`, `i18n.locales.<id>.translation`, `subPath` defaults to the locale code),
  `@angular/build:application` (`localize`, `i18nMissingTranslation`) and
  `@angular/build:extract-i18n` (`format` accepts `xlf`).

## Goals / Non-Goals

**Goals:**

- Localization fixed at build time: no translation work in the browser, no hydration mismatch.
- A translation file that carries context, readable in any XLIFF tool, merged automatically.
- Locale-aware URLs computed in one place, shared by the switcher and the metadata.

**Non-Goals:**

- Server configuration in this repository, beyond the generic requirements in Decision 8.
- A translated placeholder page.

## Decisions

### 1. Build-time i18n with `@angular/localize`, not a runtime library

One build per locale, prerendered. Each locale gets complete HTML, its own URL, `lang` and
`hreflang`, and works without JavaScript, which is what a public portfolio needs to be indexed and
shared (see the spec). Rejected: Transloco or ngx-translate with one build. They switch language
without a reload, but crawlers only see the prerendered language unless per-language routes are
rebuilt by hand. Reading the language from storage on load also conflicts with hydration (flash of
the other language), and the translations become a third-party dependency. The cost accepted here is
a page load when switching language, which is cheap for static pages.

### 2. Workspace configuration

- Project `i18n`: `sourceLocale: "en"`, `locales: { "es": { "translation": "src/locale/messages.es.xlf" } }`.
  No `subPath`/`baseHref`: the default (the locale code) gives `/en/` and `/es/`.
- Build: `localize: true` and `i18nMissingTranslation: "error"` for production, so the deployed build
  always contains both locales and never ships an untranslated text. `i18nDuplicateTranslation:
  "error"` too, to catch a corrupted merge.
- Development: the dev server serves one locale at a time. The default `development` configuration
  serves English. A `development-es` build configuration (`localize: ["es"]`) and its serve
  configuration back a `start:es` script. The exact URL the dev server uses for a localized build is
  checked in the first task and written into `CLAUDE.md`.
- `ng add @angular/localize@22.2.4` installs the package and adds its polyfill and types to the
  build, test and TypeScript configuration; the task checks what it changed instead of assuming it.

### 3. Translation files: XLIFF 1.2 with Angular's hash IDs

- Format `xlf` (XLIFF 1.2). It keeps each unit's meaning, description and source location, and is
  the format every translation tool reads. Rejected: `json` (loses context), `xlf2` (thinner tool
  support for no gain here), `arb` (only useful to share with Flutter).
- Default hash IDs, no `@@custom` IDs. A hash is derived from the English text and its meaning, so a
  changed English text gets a new ID. With `i18nMissingTranslation: "error"` the build then fails
  until the Spanish is updated. That is the spec's "changed English text" scenario, for free.
  Identical texts with the same meaning share one translation; a different meaning
  (`i18n="meaning|description"`) separates them.
- Every `i18n` attribute and `$localize` call gives a meaning and a description, so the XLIFF file
  explains where each text appears.
- Files: `src/locale/messages.xlf` (English source, generated) and `src/locale/messages.es.xlf`
  (Spanish, committed and edited).

### 4. Extraction and merge with `ng-extract-i18n-merge`

`ng extract-i18n` only rewrites the source file. `ng-extract-i18n-merge` 3.5.0 (exact, dev) replaces
the `extract-i18n` target with a builder that extracts and merges into `messages.es.xlf`. New units
arrive marked for translation, removed units are deleted, existing translations are kept and the
order is stable. It is installed with its own `ng add` schematic. Its builder options are taken from
the installed package's schema at that point, not assumed here; the configuration must keep XLIFF
1.2, `src/locale/` and the `es` target file. An `extract-i18n` npm script runs it.

### 5. Locale helper: one source for supported locales and URLs

`src/app/i18n/` holds:

- the supported locales (`en`, `es`) with each one's own name ("English", "Español"), and the site
  origin (`https://modular-forge.dev`) used for absolute `hreflang` URLs;
- a pure function that builds the URL of a page path in a locale (`/es/` + path).

The current locale comes from Angular's `LOCALE_ID`, which the localized build sets per locale.
The current page path comes from the router, without the base href. Tests cover the function and
both locales.

### 6. Language switcher in a minimal shell header

`app.html` gets a `<header>` with a switcher component above the placeholder. The switcher is a plain
`<a href>` (not `routerLink`: the target is another build) to the current path in the other locale,
with `lang` and `hreflang` set to the target and the target language's own name as text. Visible
names of languages are deliberately not translated: each one is shown in its own language. Styles use
the existing tokens only; layout of the real header is PF-4's job. Prerendering computes the `href`
per page, so it works without JavaScript.

### 7. Page metadata service

A root service sets, on every navigation: the `<title>` and meta description (translated with
`$localize`), and the `<link rel="alternate">` set (`en`, `es`, `x-default` → origin + `/`). It
replaces existing alternates instead of appending. `<html lang>` is set by the localized build; the
task confirms it in the prerendered output and only sets it from the service if the build does not.

### 8. Hosting requirements (documented, configured outside the repository)

The server that hosts the static files must:

- redirect `/` with `302` to `/es/` when the first language in `Accept-Language` is `es` or `es-*`,
  and to `/en/` otherwise, sending `Vary: Accept-Language`;
- redirect `/en` and `/es` to the same path with a trailing slash;
- inside `/en/` and `/es/`, serve the requested file, then the directory's `index.html`, then that
  locale's `index.csr.html` (client-side fallback for routes that are not prerendered).

Its configuration is kept privately with the server, not in this public repository.

### 9. Fonts and public assets under a locale prefix

With `localize`, `public/` is copied into each locale folder, so `/fonts/…` (root-absolute) would
point at the site root, where no locale build lives. The first task builds and inspects the output.
If the root-absolute URLs break, the `@font-face` URLs become relative ones resolved per locale, and
the task records which form works and why. Whatever the form, fonts keep loading from the site's
origin (`visual-theme` is unchanged). The same check covers `favicon.ico`.

### 10. Localized content in data files

Typed data files store each visible text as an object with one value per locale (`{ en, es }`),
read through `LOCALE_ID`. It keeps the content in one reviewed TypeScript file, keeps the template
literal types of the links, and a missing language fails to compile. Adding a project stays a PR
that only changes data. The type itself is added with the projects section (PF-7), where it is first
used. Here it is recorded in `CLAUDE.md`.

## Risks / Trade-offs

- [Deploy breaks: ci-web verify looks for `browser/index.html`] → do not merge before CW-2 ships and
  the pinned SHA in `ci.yml` is updated (a CI file change, asked for separately).
- [Root `/` returns 404 until the server redirects] → the hosting configuration goes live together
  with the merge (Migration Plan).
- [`Accept-Language` matching only looks at the first language, not q-values] → good enough for two
  languages; a visitor in the wrong language has the switcher.
- [The dev server shows one locale at a time] → `start:es` script.
- [A third-party builder in the translation workflow] → dev only, pinned, no install scripts. If it
  breaks on an Angular update, `ng extract-i18n` plus a manual merge still works.
- [Placeholder text stays English in `/es/`] → accepted until PF-4; it is not translated copy, it is
  the scaffold.

## Migration Plan

1. Implement and open the PR. CI on the PR runs checks and build only.
2. Before merging: CW-2 released in ci-web, `ci.yml` pinned to it, hosting configuration prepared.
3. Merge. Then apply the hosting configuration and check `/`, `/en/`, `/es/`, a non-prerendered path
   and the fonts in production.
4. Rollback: revert the merge commit and restore the previous hosting configuration.
