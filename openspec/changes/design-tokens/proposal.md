# Proposal

## Why

The site's visual design was approved in Claude Design (anvil item PF-1): an editorial look built on
the Haishoku Soukan colour combination March 013, with Fraunces, Inter and JetBrains Mono. The
repository still has the empty `src/styles.scss` from the Angular scaffold, so every section that
comes next (PF-4 to PF-8) would have to invent its own colours and type. The tokens and base styles
must exist once, globally, before any section is built.

## What Changes

- Global design tokens as CSS custom properties in `src/styles.scss`: the five palette colours, the
  semantic roles built on them (background, surface, ink, soft ink, rule, link, marker, tag, accent)
  for a light and a dark theme, the type scale, the spacing scale and the layout widths.
- Light and dark themes chosen from the visitor's system preference (`prefers-color-scheme`), with
  `color-scheme` declared so browser UI (scrollbars, form controls, the initial canvas) follows the
  theme.
- Self-hosted fonts: Fraunces (variable, roman and italic), Inter (variable) and JetBrains Mono
  (400 and 600) as Latin-subset `woff2` files under `public/fonts/`, each with its SIL Open Font
  License, declared with `@font-face` in the global stylesheet.
- Base element styles: body text, headings, links (animated underline that fills on hover), bold
  text as an animated marker, visible keyboard focus and text selection.
- Reusable motion: a text "rise" entrance and the marker reveal, active only when the visitor has
  not asked for reduced motion.
- `src/index.html` declares the supported colour schemes in a `<meta name="color-scheme">`.

## Capabilities

### New Capabilities

- `visual-theme`: the site's visual identity as seen by a visitor: palette and light and dark
  themes, typography and self-hosted fonts, emphasis styles for links and bold text, focus
  visibility, contrast guarantees and motion preferences.

### Modified Capabilities

None: there are no existing specs.

## Out of scope

- Visible copy. The canvas texts are placeholders; each section writes its own Spanish and English
  copy when it is built (PF-4 to PF-8, after i18n in PF-3).
- Page layout and components (header, hero, cards, timeline, footer). They belong to the section
  changes and only consume these tokens.
- The manual theme toggle. It needs component logic and a decision on remembering the choice; it is
  part of the header (PF-4). This change only leaves the theme switchable from one attribute on the
  root element.
- Replacing the Angular placeholder in `src/app/app.html`. It only gets a light-only patch so it stays
  readable under the dark theme until the home page (PF-4) replaces it.
- Preloading fonts and a Content-Security-Policy (PF-9). Same-origin fonts keep both open.

## Impact

- `src/styles.scss` (new content), `src/index.html` (one `<meta>`), new files under
  `public/fonts/` (font files and their licences).
- No new npm dependency: the fonts are static files downloaded once from the Google Fonts API and
  committed, not a package. Angular has no font tooling to cover this, and nothing is needed at build
  time beyond copying `public/`.
- Initial transfer grows by the fonts actually used on a page (`woff2`, Latin subset; sizes recorded
  in `design.md`). The `initial` budget in `angular.json` only counts JS and CSS bundles, so it is
  unaffected.
