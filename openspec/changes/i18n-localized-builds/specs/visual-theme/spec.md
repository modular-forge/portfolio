# Spec Delta

## MODIFIED Requirements

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

- **WHEN** someone browses the published site in either language
- **THEN** each font family's SIL Open Font License file is published under that language's
  `fonts/<family>/` folder, and the published fonts README names the served font file of each
  family and the licence that covers it
