#!/usr/bin/env node
/** Materialize the committed APPLET truth snapshot for CI and non-local agents. */
import { readFileSync, mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SNAPSHOT = join(ROOT, 'spec', 'product-truth', 'applet-snapshot.json');
const TARGET = join(ROOT, '..', 'applet');

if (existsSync(join(TARGET, '.product-truth-snapshot'))) rmSync(TARGET, { recursive: true, force: true });
if (!existsSync(SNAPSHOT)) throw new Error(`Missing APPLET snapshot: ${SNAPSHOT}`);
const raw = readFileSync(SNAPSHOT, 'utf8').trim();
const data = JSON.parse(gunzipSync(Buffer.from(raw, 'base64')).toString('utf8'));
if (data.sourceId !== 'APPLET' || !data.files || typeof data.files !== 'object') throw new Error('Invalid APPLET snapshot');

for (const [rel, entry] of Object.entries(data.files)) {
  const out = join(TARGET, rel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, entry.content, 'utf8');
}
writeFileSync(join(TARGET, '.product-truth-snapshot'), `${data.archiveSha256}\n`, 'utf8');
console.log(`✅ APPLET truth materialized: ${Object.keys(data.files).length} files`);
console.log(`   sourceId=${data.sourceId}`);
console.log(`   archiveSha256=${data.archiveSha256}`);
console.log(`   target=${TARGET}`);
