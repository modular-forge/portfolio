#!/usr/bin/env node
// Claude Code PostToolUse hook: format and lint the file Claude just edited.
// Template: modular-forge/claude-harness, templates/web-angular (derived from Dianto's
// scripts/claude-lint-hook.mjs).
//
// Wired from .claude/settings.json (hooks.PostToolUse, matcher Edit|Write|MultiEdit).
// Reads the hook payload (JSON) from stdin, takes tool_input.file_path and:
//   1. Prettier --write on that file (respects .prettierignore; unknown types are skipped).
//   2. ESLint for src/**/*.ts and src/**/*.html, Stylelint for src/**/*.scss.
// Exit codes (Claude Code hooks contract):
//   0 -> nothing to report (or no tool applies); the session continues silently.
//   2 -> a check failed; stderr is shown to Claude, which fixes it in the same turn.
// Missing tools, bad payloads or files outside the project never block (exit 0): a tooling
// glitch must not wedge the session. Only a real formatting or lint failure reports.
// Formatting rewrites the file, so Claude re-reads it before its next edit. That is expected.
// Runs each tool as `node <bin>` with shell:false, so Windows paths with spaces are safe.

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const TIMEOUT_MS = 90_000;

async function readPayload() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Path of a package's CLI inside node_modules, read from its package.json "bin". */
function resolveBin(pkg, binName) {
  const pkgJson = path.join(projectDir, 'node_modules', pkg, 'package.json');
  if (!existsSync(pkgJson)) return null;
  try {
    const { bin } = JSON.parse(readFileSync(pkgJson, 'utf8'));
    const rel = typeof bin === 'string' ? bin : bin?.[binName];
    if (!rel) return null;
    const cli = path.join(projectDir, 'node_modules', pkg, rel);
    return existsSync(cli) ? cli : null;
  } catch {
    return null;
  }
}

/** Run a package CLI from the project root. Returns {code, out}, or null if unavailable. */
function runTool(pkg, binName, args) {
  const cli = resolveBin(pkg, binName);
  if (!cli) return null;
  const res = spawnSync(process.execPath, [cli, ...args], {
    cwd: projectDir,
    encoding: 'utf8',
    timeout: TIMEOUT_MS,
  });
  if (res.error) return null;
  return { code: res.status ?? 0, out: `${res.stdout || ''}${res.stderr || ''}`.trim() };
}

function lintStep(relPath, absPath) {
  if (!relPath.startsWith('src/')) return null;
  if (relPath.endsWith('.ts') || relPath.endsWith('.html')) {
    return {
      label: 'eslint',
      run: () => runTool('eslint', 'eslint', ['--max-warnings=0', '--no-warn-ignored', absPath]),
    };
  }
  if (relPath.endsWith('.scss')) {
    return {
      label: 'stylelint',
      run: () => runTool('stylelint', 'stylelint', ['--allow-empty-input', absPath]),
    };
  }
  return null;
}

const payload = await readPayload();
const filePath = payload?.tool_input?.file_path;
if (!filePath || typeof filePath !== 'string') process.exit(0);

const absPath = path.resolve(projectDir, filePath);
const relPath = path.relative(projectDir, absPath).split(path.sep).join('/');
if (!relPath || relPath.startsWith('..') || path.isAbsolute(relPath)) process.exit(0);
if (!existsSync(absPath)) process.exit(0);

const failures = [];

const formatted = runTool('prettier', 'prettier', [
  '--write',
  '--ignore-unknown',
  '--log-level=warn',
  absPath,
]);
if (formatted && formatted.code !== 0) {
  failures.push(`[prettier] could not format ${relPath}:\n${formatted.out}`);
}

const step = lintStep(relPath, absPath);
const linted = step ? step.run() : null;
if (step && linted && linted.code !== 0) {
  failures.push(`[${step.label}] ${relPath}:\n${linted.out}`);
}

if (failures.length > 0) {
  process.stderr.write(`Fix these before continuing:\n\n${failures.join('\n\n')}\n`);
  process.exit(2);
}
process.exit(0);
