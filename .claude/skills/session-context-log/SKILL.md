---
name: session-context-log
description: "Write a session context log to docs/context/session-log-YYYY-MM-DD-HH-<topic>.md. Use when the user asks to document, log or save the context of the current session (in Spanish: 'genera un log de sesión', 'documenta esta sesión', 'guarda el contexto'), or at the end of a substantial session so future sessions inherit the decisions, root causes and pending items."
metadata:
  author: modular-forge (generalised from Dianto's session-context-log)
  version: '1.2'
---

# Session context log

Session logs in `docs/context/` are the project's memory of _why_: decisions, diagnosed root
causes and pending work that git history and the code do not carry. Future sessions and agents
read them. This skill writes one log for the current session.

If CLAUDE.md names a different folder for session logs, or says they are not kept, follow
CLAUDE.md.

## File name (mandatory format)

```
docs/context/session-log-YYYY-MM-DD-HH-<topic>.md
```

- `YYYY-MM-DD-HH`: date and hour (24 h, zero-padded) from the real clock. Get it with
  `date +%Y-%m-%d-%H` (Git Bash). Do not guess.
- `<topic>`: 2–4 words in kebab-case naming the session's main theme (`projects-section`,
  `ci-quality-gates`).
- List `docs/context/` first and follow the naming already there.

## Language, audience and safety

- Write in English, even when the conversation was in Spanish: everything in the repository is in
  English. The reader is a future session with no memory of this conversation: name exact files,
  functions, error messages and commands. Prefer _why_ over _what_ (the diff shows the what).
- **The repository may be public.** Never include secrets, tokens, personal data, internal
  hostnames or IPs, personal absolute paths, or details of private infrastructure. Summarise them
  ("the deploy key", "the home server") instead.

## Structure

```markdown
# Session Log — YYYY-MM-DD-HH — <readable title>

## Session goal

<1–3 sentences: what the user asked for and why.>

---

## 1. <Block of work>

<For each non-trivial change: symptom or goal, root cause if there was a diagnosis, the change
(short snippets when they help), and why this solution and not another.>

---

## N. Files changed

| File | Change |

## N+1. Decisions

| Decision | Reason |

## N+2. Verification

<Commands actually run and their real result, e.g. `npm run check` → OK.>

## N+3. Pending

<What is still open and why, including anything the user deferred.>
```

Never drop "Session goal", "Files changed" or "Pending"; omit other sections that do not apply.

## How to build it

1. Run `date +%Y-%m-%d-%H` for the prefix.
2. Reconstruct the session from the conversation itself: requests, edits, commands and their
   output, diagnoses. Do not invent work; do include failed attempts and why they failed.
3. Take verification results from real command output, not from what should have passed.
4. Report the path of the created file to the user. A log is a docs change: no tests needed.
