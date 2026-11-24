# Design

## Context

- `src/styles.scss` is empty (Angular scaffold). `src/app/app.html` is still the Angular placeholder
  with its own scoped `<style>`; it stays until PF-4.
- The approved canvas (Claude Design, PF-1) defines the palette, the type pairing, the emphasis
  styles and the motion. Its shared stylesheet is the reference for values; its layout classes are
  not part of this change.
- Baseline target in `CLAUDE.md`: Widely available. Anything newer is progressive enhancement or
  needs a fallback.
- Static prerendered site; the server will set a Content-Security-Policy later (PF-9), so nothing may
  load from another origin.
- `.claude/rules/styles.md`: tokens as custom properties defined once globally, mobile first, AA
  contrast, visible focus, reduced motion respected.

## Goals / Non-Goals

**Goals:**

- One global source of tokens that section components consume with `var(--token)`.
- Theme switching in CSS only, ready for a later toggle that sets one attribute.
- Fonts that never block text and never leave the site's origin.

**Non-Goals:**

- Component and layout classes (header, cards, grid). Sections add them in their own stylesheets.
- A visual regression or contrast test suite: contrasts are fixed by the palette and measured once
  here.

## Decisions

### 1. Tokens: raw palette plus semantic roles on `:root`

Raw colours (`--color-indigo`, `--color-green`, `--color-lemon`, `--color-peach`, `--color-nile`)
are declared once. Components never use them directly; they use semantic roles: `--color-bg`,
`--color-surface`, `--color-ink`, `--color-ink-soft`, `--color-rule`, `--color-link`,
`--color-link-line` (also the hover fill), `--color-link-hover-ink`, `--color-mark`,
`--color-tag-bg`, `--color-tag-ink`, `--color-accent`, `--color-focus`. A theme is only a different
assignment of roles, so switching it never touches component styles.

Alternative considered: a Sass map compiled into classes. Rejected: custom properties are needed at
runtime for the theme switch, and Sass would add a second source of truth.

### 2. Theme switch: `prefers-color-scheme` on `:root`, overridable by `data-theme`

```
:root                      → light roles, color-scheme: light dark
@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) → dark roles }
:root[data-theme='dark']   → dark roles, color-scheme: dark
:root[data-theme='light']  → light roles, color-scheme: light
```

`src/index.html` adds `<meta name="color-scheme" content="light dark">` so the canvas is themed
before the stylesheet arrives, and `color-scheme` on `:root` themes scrollbars and form controls.
Media query changes apply live, so a system switch needs no script.

Alternative considered: `light-dark()`. It is Baseline Newly available (May 2024), below the
project's Widely available target, and would still need the media-query fallback above; it adds
nothing until the target moves. The dark role assignment is written once in a Sass mixin and
included by the media query and by `[data-theme='dark']`, so the two cannot drift.

### 3. Measured contrast decides the colour roles

WCAG ratios between the palette colours:

| Pair                    | Ratio  | Use                                         |
| ----------------------- | ------ | ------------------------------------------- |
| Indigo / Lemon          | 16.03  | Body text and background, both themes       |
| Indigo / Nile           | 13.53  | Text on surfaces and on the light marker    |
| Indigo / Peach          | 5.50   | Link text on hover fill; peach links (dark) |
| Indigo / Green          | 5.45   | Tag text on green tags                      |
| Green / Lemon           | 2.94   | Fails as text: decoration only              |
| Peach / Lemon           | 2.92   | Fails as text: underline decoration only    |
| Lemon on Green 60 % over Indigo | ≈ 6.4 | Bold text on the dark marker        |

Peach Red and Green therefore never colour text on the light background. In the light theme a link
is Indigo text with a Peach underline (the text carries the contrast; the underline makes it
recognisable without colour alone). In the dark theme the link text itself is Peach (5.5:1). Soft
text is Indigo or Lemon at 78–80 % opacity, which stays above 7:1.

### 4. Emphasis drawn with a background gradient

Link underline and bold marker are a `linear-gradient` background sized with `background-size`:
the underline is `100% 0.16em` at the bottom and grows to `100% 100%` on `:hover` and
`:focus-visible`; the marker is a band of `0.48em` at the bottom of `strong`. Gradients and
`background-size` transitions are Widely available and let the underline become the hover fill,
which `text-decoration-thickness` cannot do. Links wrap across lines with
`box-decoration-break: clone` where supported, falling back to a continuous underline.

Focus uses `outline: 3px solid var(--color-focus)` with an offset on `:focus-visible` (ink colour:
16:1 in both themes).

### 5. Motion opts in with `prefers-reduced-motion: no-preference`

Following the Modern Web Guidance `motion` guide: the default style is the final, static state, and
the animations are added only inside `@media (prefers-reduced-motion: no-preference)`. No global
`animation: none` override, so nothing can be left at `opacity: 0`. Colour transitions on links stay
on for everyone; the underline growth (spatial) is part of the opt-in.

Animations provided:

- `.text-rise`: a word or line rises 0.35em and settles from Fraunces weight 300 "soft" to 600,
  staggered by a `--rise-index` custom property (90 ms per step). `transform` and `opacity` keep it
  on the compositor; the variable-font axis change is short and runs once.
- The bold marker draws from left to right once, 0.7 s after load.

### 6. Fonts: self-hosted Latin `woff2`, `font-display: swap`

Files are downloaded once from the Google Fonts CSS API (Latin subset only, the `woff2` that the
API serves to current browsers) and committed:

| Family         | Files                                       | Axes / weights              |
| -------------- | ------------------------------------------- | --------------------------- |
| Fraunces       | roman and italic, variable                  | `opsz` 9–144, `wght` 100–900, `SOFT` 0–100 |
| Inter          | roman, variable                             | `wght` 400–700              |
| JetBrains Mono | roman, variable (the API serves one file for 400 and 600) | `wght` 400–600 used |

Layout: `public/fonts/<family>/` with the `woff2` files and the family's `OFL.txt` (from the
`google/fonts` repository). `@font-face` rules in `src/styles.scss` use same-origin URLs, the
`unicode-range` the API declares for the Latin subset, and `font-display: swap`. The exact API query
and the resulting file sizes are recorded in `public/fonts/README.md` so the files can be
regenerated.

Fallback stacks keep text readable before the swap: Fraunces → Georgia, serif; Inter → system-ui,
sans-serif; JetBrains Mono → ui-monospace, monospace. `font-size-adjust: from-font` (Baseline Newly
available, progressive enhancement per the `visually-stable-font-fallbacks` guide) on the root
reduces the size jump where supported.

Alternatives considered:

- Google Fonts CDN: third-party requests, visitor data sent to Google and a CSP exception. Rejected.
- `@fontsource` npm packages: a new dependency with install-time churn for files that never change.
  Rejected.
- System fonts only: loses the editorial identity approved in the canvas.

No `<link rel="preload">` for now: which faces are critical depends on the home page (PF-4).

### 7. Type and spacing scales in `rem`, fluid between phone and desktop

Sizes are `rem` so the OS text-size setting is respected, and headings use `clamp()` between the
canvas's phone and desktop values (both Widely available):

| Token             | Phone  | Desktop |
| ----------------- | ------ | ------- |
| `--text-display`  | 54 px  | 112 px  |
| `--text-h2`       | 40 px  | 64 px   |
| `--text-h3`       | 26 px  | 32 px   |
| `--text-lead`     | 19 px  | 24 px   |
| `--text-body`     | 17 px  | 18 px   |
| `--text-label`    | 13 px  | 14 px   |

Spacing is a short scale (`--space-1` … `--space-9`, 4 px to 120 px) plus `--content-max`
(1200 px) and `--measure` (38em). Families are tokens too (`--font-display`, `--font-body`,
`--font-mono`).

### 8. One global stylesheet, in sections

`src/styles.scss` holds, in order: `@font-face`, tokens, themes, base elements, emphasis, motion. If
it grows past what is comfortable to read, it splits into partials under `src/styles/` imported with
`@use`; nothing outside the global layer changes.

## Risks / Trade-offs

- [The Angular placeholder has fixed colours: under the dark theme its heading became unreadable,
  and its social icons picked up the link underline] → Its `:host` is pinned to `color-scheme: light`
  with its own white background, and its icon links drop the underline. Removed with the placeholder
  in PF-4.
- [Variable Fraunces with three axes is the largest font file] → Latin subset only, loaded on demand
  by `font-display: swap`; sizes recorded, revisited with preloading in PF-4.
- [CSS cannot be unit-tested meaningfully in the Vitest DOM (no cascade, no media queries)] →
  Verified in a real browser with emulated colour scheme and reduced motion; the existing unit tests
  must keep passing.
- [The font files are binary blobs in a public repository] → Their licence (OFL) allows
  redistribution; the README records their source.

- [Font URLs are root-absolute (`/fonts/...`). With one prerendered build per language (PF-3),
  `public/` may be copied under each locale folder and `/fonts/` would 404, silently hidden by
  `font-display: swap`] → PF-3 must check where `public/` lands and fix the URLs or the server
  mapping; noted in `public/fonts/README.md`.
- [Global link styles reach component links] → The rule is `:where(a[href])`, zero specificity,
  so any component link (cards, store badges, nav) restyles it with a plain class selector.

## Migration Plan

Additive change: nothing consumes the tokens yet. Rollback is reverting the commit.
