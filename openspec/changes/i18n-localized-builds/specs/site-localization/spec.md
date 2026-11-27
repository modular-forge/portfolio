# Spec Delta

## Purpose

Defines how visitors reach the site in English or Spanish and move between the two: locale-prefixed
URLs, the root redirect by browser language, the language switcher, the language metadata search
engines read, and the guarantee that every visible text exists in both languages.

## ADDED Requirements

### Requirement: One URL per page and language

Every page SHALL be published once per supported language under a language prefix: `/en/` for
English and `/es/` for Spanish, followed by the same page path. Each URL SHALL serve complete HTML
already written in its language, readable without running JavaScript.

#### Scenario: A page in each language

- **WHEN** a visitor or crawler requests `/en/` and `/es/`
- **THEN** each response is a complete HTML page whose visible text is in English and in Spanish
  respectively, with no client-side translation step

#### Scenario: JavaScript disabled

- **WHEN** a visitor with JavaScript disabled opens `/es/`
- **THEN** the page content is shown in Spanish

### Requirement: Root sends visitors to their language

A request for the site root `/` SHALL redirect temporarily to `/es/` when the browser's preferred
language is Spanish, and to `/en/` in every other case, including when no language is sent. The
redirect response SHALL vary by the browser's language preference so caches keep one answer per
language.

#### Scenario: Spanish browser

- **WHEN** a browser whose first preferred language is Spanish (`es` or any `es-*` region) requests `/`
- **THEN** it is redirected to `/es/`

#### Scenario: Any other browser

- **WHEN** a browser whose first preferred language is not Spanish, or that sends no language
  preference, requests `/`
- **THEN** it is redirected to `/en/`

### Requirement: Language switcher

Every page SHALL show a language switcher, available to keyboard and screen-reader users, that links
to the same page in the other language. The link SHALL name the target language in that language
and declare the target language. Switching SHALL NOT store any preference on the visitor's device.

#### Scenario: Switching from English to Spanish

- **WHEN** a visitor on `/en/<path>` activates the switcher
- **THEN** the browser navigates to `/es/<path>`, the same page in Spanish

#### Scenario: Switcher is announced in the target language

- **WHEN** a screen reader reaches the switcher on an English page
- **THEN** the link text is "Español" and the link is marked as Spanish, so it is pronounced in
  Spanish

#### Scenario: Nothing is stored

- **WHEN** a visitor switches language
- **THEN** no cookie or browser storage entry is written

### Requirement: Language metadata for search engines

Every page SHALL declare its language on the root element, have a title and meta description in its
language, list its alternates (the page in each language with `hreflang` `en` and `es`, plus the
root as `x-default`) and name itself as canonical, all as absolute URLs.

#### Scenario: Metadata of a Spanish page

- **WHEN** a crawler reads `/es/<path>`
- **THEN** the root element has `lang="es"`, the title and description are in Spanish, and the head
  links `/en/<path>` as `en`, `/es/<path>` as `es` and `/` as `x-default` with the site's absolute
  origin

#### Scenario: Each language version is its own canonical page

- **WHEN** a crawler reads `/en/<path>` or `/es/<path>`
- **THEN** the head has exactly one canonical link, pointing to that same page in that same language
  (absolute URL, without query string or fragment), so the two versions are indexed separately and
  not as duplicates

### Requirement: Every visible text exists in both languages

Every text shown to visitors SHALL exist in English and Spanish. A text without its Spanish
translation SHALL stop the site from being built, so an incomplete translation is never published.

#### Scenario: Missing translation

- **WHEN** a visible text is added in English without a Spanish translation and the site is built
- **THEN** the build fails and names the untranslated text

#### Scenario: Changed English text

- **WHEN** the English wording of an already translated text changes and the site is built without
  updating the Spanish file
- **THEN** the build fails, so the old Spanish translation is not published for the new text
