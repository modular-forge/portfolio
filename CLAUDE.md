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
- Text shown to visitors is in Spanish and English, with a language switcher: Angular i18n, one
  prerendered build per language (for example `/es/` and `/en/`). Never hard-code visible copy in
  one language only.
- Commit, push and merge only as "Commits and review" describes, each after the user's OK. Never
  force-push, push to `main`, rebase, tag or rewrite history.
- **Public repository:** everything committed is public. No secrets, tokens, personal data,
  internal hostnames or IPs, personal absolute paths or details of the home server in code, docs
  or commit messages.
- Never invent APIs, versions or options. Check the installed version (`package.json`) and the
  docs (Angular CLI MCP, `angular-developer` skill) first.
- Browser support: this project's Baseline target is Baseline Widely available. Before writing
  HTML, CSS or client-side JS, look the pattern up with the `modern-web-guidance` skill and apply
  its fallbacks for anything outside the target.
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

Forge flow: anvil tracks the work, OpenSpec holds the decisions.

- **anvil** (`anvil` CLI, `anvil@anvil-hq` plugin) only tracks: priority, status, blockers and
  the journal that carries one session into the next. The session starts with its briefing.
- **OpenSpec** holds what the project decided: current requirements and business rules
  (`openspec/specs/`), why a change is made (`proposal.md`), technical decisions (`design.md`)
  and implementation tasks (`tasks.md`). A decision made in a session is written there; the
  journal only mentions it.

Every request goes through these steps:

1. **Focus.** Tie the request to an anvil item. If it is not trivial and has no item, say it is
   off-priority and offer to note it in the inbox and go back to the focus, unless the user
   decides to switch.
2. **Explore** read-only and resolve doubts before changing anything (`/opsx:explore` if needed).
3. **Classify** with the resumption test: could the work be picked up again with only the
   request and the `git diff`?

   | Level   | Examples                                                 | Process                                                                                                                                             |
   | ------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Trivial | Typo, style, dependency bump with no change of behaviour | Implement directly, no OpenSpec change. If it alters what the visitor sees, update the spec                                                         |
   | Normal  | A bounded feature                                        | `/opsx:propose` (proposal, delta, tasks; `design.md` only for a technical decision) → the user reviews → `/opsx:apply` test first → `/opsx:archive` |
   | Risky   | Exposed to the Internet, authentication, data            | Normal plus `/opsx:explore`, `design.md`, a full review, `/opsx:verify` and the `code-reviewer` agent                                               |

4. **Track.** The item goes to doing and names the OpenSpec change. One item per change: its
   steps are the phases only, the tasks stay in `tasks.md`.
5. **Implement** task by task, each one through the review loop in "Commits and review". Check
   each step when it is completed; if something blocks, set the item to blocked with the reason.
6. **Close with proof:** the definition-of-done commands, the PR and the change archived. The
   item goes to done only when the user confirms the merge.
7. **End of session:** the user runs `/anvil:wrap-up`, which checks the items against what was
   done and writes the journal note.

Without asking you may move an item to doing or blocked and check steps. Always ask before
creating an item, closing one (done or cancelled) or skipping a step. Change items only with the
`anvil` CLI, never by editing its files.

## Commits and review

Work on a branch, never on `main`. One logical change per commit, usually one OpenSpec task.

Review loop, for every task:

1. Finish the task and run the definition of done.
2. Read your own diff for debug code, TODOs and unrelated changes, then run the `code-reviewer`
   agent and fix what it finds.
3. Stop. Summarise what changed, the real check results and what the user should look at. The
   user reviews locally (`git diff`).
4. Commit only after the user's OK. If they ask for changes, apply them and go back to step 1.

Commit message: Conventional Commits with the type's emoji in front, imperative subject under
72 characters (aim for 50) with no final period, a body that explains why when it is not obvious,
and the anvil item as a trailer:

```
✨ feat(contact): validate email after first blur

Errors shown while typing felt hostile; they now appear once the field loses focus.

Refs: <ITEM-ID>
```

| Type       | Emoji | For                         |
| ---------- | ----- | --------------------------- |
| `feat`     | ✨    | New feature                 |
| `fix`      | 🐛    | Bug fix                     |
| `docs`     | 📝    | Documentation only          |
| `style`    | 🎨    | Formatting, no logic change |
| `refactor` | ♻️    | Restructure, same behaviour |
| `perf`     | ⚡️    | Performance                 |
| `test`     | ✅    | Tests                       |
| `build`    | 📦️    | Build system, dependencies  |
| `ci`       | 👷    | CI                          |
| `chore`    | 🔧    | Maintenance, configuration  |
| `revert`   | ⏪️    | Revert a commit             |

A breaking change adds `!` after the type or scope and a `BREAKING CHANGE:` footer. Use the
Unicode emoji, never `:shortcodes:`.

Pull request and merge, once the user says the cycle is fine:

1. Check every commit subject on the branch against the format above
   (`git log main..HEAD --format=%s`) and fix any before going on.
2. `git push -u origin HEAD` (the `pre-push` hook blocks `main` and runs `npm run check`).
3. `gh pr create`: title in the commit format (it becomes the merge commit message); body with
   the anvil item, the OpenSpec change, a short summary and the definition-of-done results.
4. Ask to merge with `gh pr merge <number> --merge`. The permission prompt is the user's final
   approval; never use `--admin`, `--squash` or `--rebase`.
5. After the merge: `git switch main && git pull`, and propose closing the item with the PR as
   evidence.

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
  segment will be revisited when i18n is set up (a language prefix changes the URLs).
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

### Session notes

- Not kept in this public repository: the journal between sessions lives in anvil, so do not
  create `docs/context/`. Decisions are recorded in OpenSpec (`openspec/changes/archive/`).
