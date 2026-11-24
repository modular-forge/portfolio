# Fonts

Self-hosted so that no request leaves the site's origin (see
`openspec/changes/design-tokens/design.md`, decision 6). Each family is licensed under the SIL Open
Font License 1.1; its `OFL.txt` sits next to its files.

## Files

| File                                        | Family         | Style  | Axes / weights                             | Size (bytes) |
| ------------------------------------------- | -------------- | ------ | ------------------------------------------ | ------------ |
| `fraunces/fraunces-roman-latin.woff2`       | Fraunces       | normal | `opsz` 9–144, `wght` 100–900, `SOFT` 0–100 | 120,788      |
| `fraunces/fraunces-italic-latin.woff2`      | Fraunces       | italic | `opsz` 9–144, `wght` 100–900, `SOFT` 0–100 | 149,208      |
| `inter/inter-latin.woff2`                   | Inter          | normal | `wght` 400–700                             | 48,256       |
| `jetbrains-mono/jetbrains-mono-latin.woff2` | JetBrains Mono | normal | variable, used at 400 and 600              | 31,432       |

## Source

Downloaded on 2026-11-24 from the Google Fonts CSS API, Latin subset only, using the `woff2` URLs
the API returns to a current desktop Chrome user agent:

```
https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,100..900,0..100;1,9..144,100..900,0..100&family=Inter:wght@400..700&family=JetBrains+Mono:wght@400;600&display=swap
```

Only the faces under the `/* latin */` comment were kept. Their `unicode-range`, copied into the
`@font-face` rules in `src/styles.scss`:

```
U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD
```

Licences: `ofl/fraunces/OFL.txt`, `ofl/inter/OFL.txt` and `ofl/jetbrainsmono/OFL.txt` from the
`main` branch of the `google/fonts` repository on GitHub.

To regenerate, request the query above with the same kind of user agent, download the `latin`
`woff2` URLs and replace the files, keeping the names. The API may serve newer font versions.

## Known follow-up

`src/styles.scss` loads these files from root-absolute URLs (`/fonts/...`). When i18n adds one
prerendered build per language (PF-3), check that `/fonts/` is still served at the root; otherwise
the fonts 404 and the fallback fonts hide the failure.
