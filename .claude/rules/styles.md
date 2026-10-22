---
paths:
  - 'src/**/*.scss'
---

# Styles (SCSS)

- Design tokens (colours, spacing, typography, radii, shadows) are CSS custom properties defined
  once in the global stylesheet (`src/styles.scss` or the file `CLAUDE.md` names). Components use
  `var(--token)`; no hard-coded colours or magic numbers in component styles.
- Component styles stay encapsulated. `::ng-deep` only as a last resort, scoped under `:host`,
  with a comment explaining why.
- Keep each component stylesheet small: Angular's `anyComponentStyle` budget fails the build
  above the limit in `angular.json`. Move shared rules to the global layer instead of copying.
- Mobile first: base styles for narrow screens, `min-width` media queries to enlarge.
- Respect user preferences: `prefers-reduced-motion` disables non-essential animation;
  `prefers-color-scheme` only if the design defines a dark theme.
- Text contrast at least WCAG AA (4.5:1 body, 3:1 large text and UI components); focus styles
  always visible (`:focus-visible`), never `outline: none` without a replacement.
- Stylelint (`stylelint-config-standard-scss`) is the source of truth for syntax and ordering;
  fix reported problems instead of disabling rules.
