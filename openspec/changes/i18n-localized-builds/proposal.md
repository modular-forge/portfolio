# Proposal

## Why

The site must speak to visitors in English and Spanish (decision PF-2), and every section that comes
next (PF-4 to PF-8) writes visible copy. The localization mechanism has to exist before that copy
does, or every section would be written in one language and retrofitted later. As a public portfolio
the site lives on search engines and shared links, so each language needs its own crawlable,
prerendered URL rather than text swapped in the browser.

## What Changes

- Angular's built-in i18n (`@angular/localize`): English is the source locale and Spanish the
  translation; `ng build` produces one prerendered build per locale, served under `/en/` and `/es/`.
- **BREAKING** (URLs): every page moves under a locale prefix (`/` content becomes `/en/…` and
  `/es/…`). The site has no published content yet, so no external link breaks.
- The site root `/` sends each visitor to their language: Spanish-preferring browsers go to `/es/`,
  everyone else to `/en/`. This is done by the hosting server; the repository only documents the
  requirement (no server details in this public repository).
- A language switcher in a minimal shell header: a plain link to the same page in the other locale.
  No stored preference, no cookie, no script.
- Per-page language metadata: `<html lang>`, a translated `<title>` and meta description, and
  `<link rel="alternate" hreflang>` for `en`, `es` and `x-default` (the root).
- Translation workflow: UI text marked with `i18n` attributes and `$localize`, Angular's default
  hash IDs, meaning and description given for context, XLIFF 1.2 files under `src/locale/`, and the
  build fails on a missing translation.
- Extraction and merge with `ng-extract-i18n-merge`, so new or changed texts land in the Spanish file
  marked for translation and removed texts disappear from it. A small script checks before every
  build that no unit is left untranslated, because Angular silently falls back to English for them.
- Convention for content data: localized fields in typed data files are objects with one value per
  locale (`{ en, es }`), recorded in `design.md` and `CLAUDE.md` for the projects section (PF-7).
- Self-hosted fonts keep loading from the site's origin under each locale prefix.

## Capabilities

### New Capabilities

- `site-localization`: how visitors reach and switch the site's languages: locale-prefixed URLs,
  root redirect by browser language, the language switcher, per-page language metadata for search
  engines, and the guarantee that every visible text exists in both languages.

### Modified Capabilities

- `visual-theme`: the "Self-hosted fonts" requirement's licence scenario. Fonts still load from the
  site's own origin, but the build now serves them with a content hash from each language's
  `media/` folder, so the licences can no longer sit next to the served files; they stay in
  `fonts/<family>/` and the fonts README maps each served file to its licence.

## New dependencies

- `@angular/localize` 22.2.4 (dev, same version as `@angular/core`): Angular's own i18n package.
  It is how Angular provides i18n; the framework packages already installed do not include it.
  Translations are inlined at build time, so `ng add` places it in `devDependencies`. It uses the
  same caret range as `@angular/compiler` and `@angular/compiler-cli`, whose exact version it
  requires, so it moves with them on every Angular update.
- `ng-extract-i18n-merge` 3.5.0, exact (dev): `ng extract-i18n` only writes the source-language file
  and never updates translation files. This builder merges new, changed and removed units into
  `messages.es.xlf` and keeps a stable order for clean diffs. Angular has no equivalent. Published
  2026-10-20, MIT, peer `@angular/build ^22`, no install scripts.

## Out of scope

- Hosting configuration (root redirect, per-locale fallback, `Vary` header). It lives with the
  server, outside this public repository; tracked privately.
- The ci-web change so its verify and deploy steps handle per-locale folders (CW-2, another
  repository). This change must not be merged before CW-2 and the hosting configuration are ready.
- Translating the Angular placeholder in `src/app/app.html`: the home page (PF-4) replaces it.
- The projects section and its data file (PF-7); only the localized-field convention is decided here.
- Remembering the visitor's language, automatic switching on later visits, and languages other than
  English and Spanish.
- A runtime translation library (Transloco, ngx-translate): rejected for SEO, see `design.md`.

## Impact

- `angular.json`: project `i18n` block, `localize` and `i18nMissingTranslation` on the build, a
  Spanish build and serve configuration for development, the extract target.
- `package.json`: two dependencies, `start:es` and `extract-i18n` scripts.
- `src/app/`: shell header with the switcher, a small locale helper, page metadata service;
  `src/locale/messages.xlf` and `messages.es.xlf` (new).
- `src/styles.scss` font URLs if they must change to resolve under the locale prefix.
- Build output: `dist/portfolio/browser/en/` and `dist/portfolio/browser/es/` instead of a single
  root; deployment depends on CW-2 and the hosting configuration.
- `CLAUDE.md`: project specifics for i18n, URLs and the localized-field convention.
