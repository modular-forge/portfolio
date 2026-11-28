# Fonts

Self-hosted so that no request leaves the site's origin (see
`openspec/changes/design-tokens/design.md`, decision 6). Each family is licensed under the SIL Open
Font License 1.1; its `OFL.txt` sits next to its files in this folder and stays in
`fonts/<family>/` on the published site, where the fonts themselves are served from `media/` (see
"How the build serves them").

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

## How the build serves them

`src/styles.scss` references these files relative to itself (`../public/fonts/...`). The build
resolves each URL, emits the file with a content hash into every locale's `media/` folder and
rewrites the URL to `./media/<name>-<hash>.woff2`, so the fonts load under `/en/` and `/es/` alike.
A root-absolute URL (`/fonts/...`) would point at the site root, where no locale build lives.

`angular.json` excludes the `woff2` files from the copy of `public/` to avoid shipping them twice;
this README and the licences are still copied to each locale's `fonts/` folder.

| Served file (in each locale)               | Family         | Licence                        |
| ------------------------------------------ | -------------- | ------------------------------ |
| `media/fraunces-roman-latin-<hash>.woff2`  | Fraunces       | `fonts/fraunces/OFL.txt`       |
| `media/fraunces-italic-latin-<hash>.woff2` | Fraunces       | `fonts/fraunces/OFL.txt`       |
| `media/inter-latin-<hash>.woff2`           | Inter          | `fonts/inter/OFL.txt`          |
| `media/jetbrains-mono-latin-<hash>.woff2`  | JetBrains Mono | `fonts/jetbrains-mono/OFL.txt` |
