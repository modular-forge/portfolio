// Fails when a translation file has a unit without a usable translation.
//
// ng-extract-i18n-merge adds every new or changed text to the target files, and Angular's XLIFF
// loader falls back to the English <source> for a unit with no <target>, only logging a warning.
// So i18nMissingTranslation never fires for those units and English would ship under /es/. This
// check closes that gap: it runs before every build (prebuild), in npm run check and in CI
// (ci-web runs npm run i18n:check).
//
// A unit fails when its <target> is missing or empty, or has an XLIFF 1.2 state other than
// "translated", "signed-off" or "final" (for example "new" or any "needs-*" state).
// Usage: node scripts/check-translations.mjs [locale-dir] (default: src/locale)

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const dir = process.argv[2] ?? 'src/locale';
const done = new Set(['translated', 'signed-off', 'final']);

const unitPattern = /<trans-unit\b[^>]*\bid="([^"]*)"[^>]*>([\s\S]*?)<\/trans-unit>/g;
const sourcePattern = /<source(?=[\s>])[^>]*>([\s\S]*?)<\/source>/;
const targetPattern = /<target(?=[\s/>])([^>]*?)(?:\/>|>([\s\S]*?)<\/target>)/;
const statePattern = /\bstate="([^"]*)"/;

const plain = (xml) =>
  xml
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const fail = (lines) => {
  for (const line of lines) console.error(line);
  process.exit(1);
};

let entries = [];
try {
  entries = await readdir(dir);
} catch (error) {
  fail([`Cannot read the translation folder ${dir}: ${error.code ?? error.message}`]);
}
const files = entries.filter((name) => /^messages\..+\.xlf$/.test(name)).sort();
if (files.length === 0) fail([`No translation files (messages.<locale>.xlf) in ${dir}.`]);

const problems = [];
for (const name of files) {
  const xml = await readFile(join(dir, name), 'utf8');
  for (const [, id, body] of xml.matchAll(unitPattern)) {
    const source = plain(sourcePattern.exec(body)?.[1] ?? '');
    const target = targetPattern.exec(body);
    const state = target ? statePattern.exec(target[1])?.[1] : undefined;
    let reason;
    if (!target) reason = 'no <target>';
    else if (!(target[2] ?? '').trim()) reason = 'empty <target>';
    else if (state && !done.has(state)) reason = `state="${state}"`;
    if (reason) problems.push(`${name}: ${reason} for "${source}" (id ${id})`);
  }
}

if (problems.length > 0) {
  fail([
    `Untranslated texts (${problems.length}):`,
    ...problems.map((problem) => `  - ${problem}`),
    'Translate them in the file named above, then build again.',
  ]);
}

console.log(`Translations complete: ${files.join(', ')}.`);
