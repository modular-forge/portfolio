<!--
Adapted from the web-angular template of modular-forge/claude-harness (see .claude/template.json).
Target: under 200 lines. HTML comments like this one are not sent to Claude.
-->

# Portfolio — modular-forge.dev

Personal portfolio of modular-forge: who I am, the products and apps I have built (with links to
their website, Google Play and App Store) and a way to contact me for information or job offers.
Published at https://modular-forge.dev.

## Ground rules

- Talk to the user in Spanish. Everything written to the repository is in English: code,
  identifiers, comments, docs, `.claude/` files, OpenSpec proposals and specs, and commit messages
  (Conventional Commits, same style as `git log`).
- Language of the text shown to visitors: **pending decision** (Spanish or English). Ask before
  writing visible copy.
- Never push, merge, rebase, tag or rewrite history: the user does that. Commit only when asked.
- **Public repository:** everything committed is public. No secrets, tokens, personal data,
  internal hostnames or IPs, personal absolute paths or details of the home server in code, docs
  or commit messages.
- Never invent APIs, versions or options. Check the installed version (`package.json`) and the
  docs (Angular CLI MCP, `angular-developer` skill) first.
- Ask before: adding or upgrading a dependency, changing CI or deployment files, deleting files
  you did not create, or touching anything outside this repository.

## Stack

| Layer      | Technology                                                                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework  | Angular 22.2 (standalone, signals, zoneless)                                                                                                                   |
| Rendering  | Static prerender only: `outputMode: "static"`, `RenderMode.Prerender` for every route. `@angular/ssr` runs at build time; no server at runtime                 |
| Styles     | SCSS; design tokens in `src/styles.scss`. The visual design comes from Claude Design                                                                           |
| Unit tests | Vitest through `ng test` (`@angular/build:unit-test`), 80 % global coverage thresholds in `angular.json`                                                       |
| Node / npm | Node 24 (`.nvmrc`), npm 11.19.1 (`packageManager`)                                                                                                             |
| CI/deploy  | `.github/workflows/ci.yml` calls the reusable workflow `modular-forge/ci-web` (pinned by SHA): checks and build on every PR and push; deploy on push to `main` |

## Commands

```bash
npm start              # dev server, localhost only (never add --host)
npm run check          # format:check + lint + lint:styles + deps:validate + knip (pre-push hook)
npm run test:ci        # unit tests with coverage thresholds
npm run build          # production build (prerender)
npm run format         # fix formatting
npx ng test --include <path/to/file.spec.ts> --watch=false   # one spec file
npx ng generate <schematic> <name>                           # components, services…
```

## Definition of done

A task is finished only when you have run these and they pass. Quote the real result in your
summary:

1. `npm run check`
2. `npm run test:ci`
3. `npm run build`

After every edit a hook formats the file with Prettier and lints it (ESLint for
`src/**/*.{ts,html}`, Stylelint for `src/**/*.scss`). Fix what it reports before moving on.
Never disable rules, add `eslint-disable` / `stylelint-disable` comments, lower coverage
thresholds or skip tests without asking.

## Dependencies (supply chain)

- Ask before adding any package; prefer what Angular already provides.
- Never install a version published less than 7 days ago. Pin exact versions for new tooling.
- `.npmrc` has `strict-allow-scripts=true` and `package.json` lists the reviewed install scripts in
  `allowScripts`. If `npm ci` or `npm install` fails with `ESTRICTALLOWSCRIPTS`, stop and tell the
  user; never approve install scripts yourself.
- Never run `npm audit fix --force` (it downgrades `@angular/build`), never use `@latest`.
- Dependabot proposes updates weekly; major versions are done by the user with `ng update`.

## Workflow

- New features, behaviour changes and multi-file refactors go through OpenSpec:
  `/opsx:explore` (optional) → `/opsx:propose <change>` → the user reviews → `/opsx:apply` →
  `/opsx:archive`. Small fixes can skip it.
- Work on a branch, never on `main`. One logical change per commit.
- Before the final summary, read your own diff (`git diff`) for debug code, TODOs and unrelated
  changes.

## Project structure

```
src/
├── main.ts, main.server.ts        # browser and prerender entry points
├── styles.scss                    # global styles and design tokens
└── app/
    ├── app.ts / app.html / app.scss   # shell: header, main, footer
    ├── app.config.ts, app.config.server.ts
    ├── app.routes.ts                  # client routes (lazy)
    ├── app.routes.server.ts           # prerender configuration
    ├── projects/                      # planned: projects section
    └── contact/                       # planned: contact block
public/                            # static assets copied as they are (project images in public/projects/)
```

## Agents

| Agent           | Use it for                                                             |
| --------------- | ---------------------------------------------------------------------- |
| `angular-dev`   | Components, templates, services, routing, signals, data files          |
| `ux-ui`         | Layout, SCSS, design tokens, responsive and visual checks in a browser |
| `testing`       | Unit tests and coverage gaps; can write the spec first                 |
| `code-reviewer` | Read-only review of the current changes before commit, push or PR      |
| `docs`          | README, CLAUDE.md, `.claude/` files, TSDoc                             |

## Project specifics

### Projects section (planned; first OpenSpec change)

- Content lives in the repository, not in a database or CMS: `src/app/projects/projects.data.ts`,
  a typed list of `Project`. Adding a product must be a PR that only changes data (and an image).
- Fields: `slug`, `name`, `summary`, `description`, `technologies`, `status` (`published` |
  `in-development` | `archived`), `image` (under `public/projects/`), `date` (`YYYY-MM`) and
  `links`: `web` (`https://…`), `android` (`https://play.google.com/store/apps/details?id=…`),
  `ios` (`https://apps.apple.com/…`) and `code` (`https://github.com/…`, public repositories only).
  Link formats are TypeScript template literal types, so a malformed link fails to compile. If a
  product gets a web version of the app at another address, add `webApp`.
- List and detail pages. `/projects/<slug>` is prerendered with `getPrerenderParams` and
  `fallback: PrerenderFallback.Client` (an unknown slug shows a client-side "not found"). The URL
  segment will be revisited together with the visible-language decision.
- `projects.data.spec.ts` checks: unique and valid slugs, `date` as `YYYY-MM`, and at least one of
  `web`, `android` or `ios` in every `published` project.
- Google Play and App Store badges: the official artwork, following their usage guidelines.
- Dianto and cash-flow are private repositories: never a `code` link for them.

### Contact

- A `mailto:` link, no form and no backend. Address `contacto@modular-forge.dev` (pending the
  user's confirmation), shown as the link text so it can be copied, with the subject pre-filled
  through `encodeURIComponent`. Address and subject live in one constant
  (`src/app/contact/contact.ts`) used by the templates.

### Hosting constraints

- Static files only. Routes that are not prerendered fall back to `index.csr.html`, so every
  route must also work client-side.
- The server sets the security headers. A Content-Security-Policy will be defined later: no inline
  `<script>`, third-party scripts, web fonts from other origins or trackers without asking.
- CI writes `version.json` into the build output to check each deployment: never create
  `public/version.json`.
- The installed Vite has advisories that affect only the dev server (fixed when Angular ships
  Vite ≥ 8.3.3): keep `npm start` on localhost.

### Session logs

- Not kept in this public repository: do not create `docs/context/`. Decisions are recorded in
  OpenSpec (`openspec/changes/archive/`).
