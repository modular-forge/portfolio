# visual-theme Specification

## Purpose

Defines the site's visual identity as a visitor experiences it: the colour palette and its light and
dark themes, typography and fonts, how links and bold text stand out, keyboard focus, contrast and
motion preferences. Every page and section builds on it.

## Requirements

### Requirement: Palette

The site SHALL use only the five colours of the Haishoku Soukan combination March 013 for text,
backgrounds, links, markers and accents: Deep Indigo `#051230`, Green `#489b6e`, Pale Lemon Yellow
`#ffefae`, Peach Red `#f15a30` and Nile Blue `#bce4e5`. Translucent mixes of these colours are
allowed for rules and soft text; other hues are not.

#### Scenario: A page uses the palette

- **WHEN** a visitor opens any page in either theme
- **THEN** the background, body text, links, bold markers and accents use the palette colours or
  translucent mixes of them, and no other hue appears in the site's own styles

### Requirement: Theme follows the system preference

The site SHALL show a light theme (Pale Lemon background, Deep Indigo text) by default and a dark
theme (Deep Indigo background, Pale Lemon text) when the visitor's system prefers a dark colour
scheme. Browser UI such as scrollbars and the page canvas SHALL follow the active theme.

#### Scenario: System in light mode

- **WHEN** a visitor whose system prefers a light colour scheme opens a page
- **THEN** the page has a Pale Lemon background with Deep Indigo text

#### Scenario: System in dark mode

- **WHEN** a visitor whose system prefers a dark colour scheme opens a page
- **THEN** the page has a Deep Indigo background with Pale Lemon text, and the browser's scrollbars
  and canvas render in their dark variant

#### Scenario: The preference changes while the page is open

- **WHEN** the visitor switches the system colour scheme with the page open
- **THEN** the page switches theme without a reload

### Requirement: Theme can be forced from the root element

The site SHALL let a later control force either theme, overriding the system preference, by setting
a single attribute on the root element, without changing any other style.

#### Scenario: Dark theme forced on a light system

- **WHEN** the root element is marked as dark while the system prefers light
- **THEN** the page renders the dark theme, including the browser's dark UI variant

### Requirement: Text contrast

All text SHALL meet WCAG 2.2 AA contrast against its background in both themes: 4.5:1 for body
text and 3:1 for large text and for focus indicators. Peach Red and Green SHALL NOT be used as the
colour of text on a Pale Lemon background.

#### Scenario: Body text and links in the light theme

- **WHEN** body text or a link is shown on the Pale Lemon background
- **THEN** its text colour is Deep Indigo (16:1), and Peach Red appears only as a decoration such as
  the link underline

#### Scenario: Links in the dark theme

- **WHEN** a link is shown on the Deep Indigo background
- **THEN** its text colour is Peach Red (5.5:1) or another pair from the palette with at least 4.5:1

### Requirement: Self-hosted fonts

Display headings SHALL use Fraunces, body text Inter and labels, dates and technical tags
JetBrains Mono. The font files SHALL be served from the site's own origin together with their
licences. Text SHALL stay readable with system fallback fonts while the fonts load or if they fail.

#### Scenario: Fonts load from the site

- **WHEN** a visitor opens a page
- **THEN** every font file is requested from the site's own origin and no request goes to a
  third-party font service

#### Scenario: Fonts are slow or blocked

- **WHEN** the font files have not loaded
- **THEN** the text is shown immediately in a fallback font of similar size and replaced when the
  font arrives

#### Scenario: Licences are published

- **WHEN** someone browses the published font folder
- **THEN** each font family has its SIL Open Font License file next to its font files

### Requirement: Link emphasis

Links in running text SHALL be recognisable without relying on colour alone: they carry a thick
underline in Peach Red that fills the link background on hover and keyboard focus, keeping the text
readable in both states.

#### Scenario: Hovering a link in the light theme

- **WHEN** the visitor hovers or focuses a link on the Pale Lemon background
- **THEN** the Peach Red underline grows to fill the link background and the text stays Deep Indigo
  (5.5:1 on Peach Red)

#### Scenario: Hovering a link in the dark theme

- **WHEN** the visitor hovers or focuses a link on the Deep Indigo background
- **THEN** the link background fills with Peach Red and the text turns Deep Indigo

### Requirement: Bold text as a marker

Bold text SHALL be highlighted with a marker band behind its lower half: Nile Blue in the light
theme and translucent Green in the dark theme, keeping the text contrast of the surrounding body.

#### Scenario: Bold text in each theme

- **WHEN** a paragraph contains bold text
- **THEN** the bold words show a marker band in the theme's marker colour and remain readable at 4.5:1
  or more

### Requirement: Visible keyboard focus

Every focusable element SHALL show a visible focus indicator when reached with the keyboard, with
at least 3:1 contrast against the background in both themes.

#### Scenario: Tabbing through links

- **WHEN** the visitor moves through the page with the Tab key
- **THEN** each focused link or button shows an outline in the theme's ink colour

### Requirement: Motion respects the visitor's preference

Decorative motion (headline words rising into place, the bold marker drawing in, the link underline
growing) SHALL run only when the visitor has not asked for reduced motion. With reduced motion,
every element SHALL appear directly in its final state; colour changes MAY remain.

#### Scenario: Reduced motion requested

- **WHEN** a visitor whose system requests reduced motion opens a page
- **THEN** headings and bold markers appear in their final state without movement, and nothing is
  left hidden

#### Scenario: No motion preference

- **WHEN** a visitor with no reduced-motion preference opens a page
- **THEN** animated headline words rise into place and bold markers draw in once, without flashing
