#!/usr/bin/env node
/**
 * 将本机 APPLET live source 固化为可提交的 Product Truth Snapshot。
 * 用法：
 *   node scripts/build-applet-snapshot.mjs ../applet <source-archive-sha256>
 *
 * 只复制产品源码事实集合（.vue/.js/.json），跳过第三方模块与构建产物；
 * 同时生成逐文件 SHA-256 manifest。CI 只消费提交后的 snapshot，不伪造 source。
 */
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const source = resolve(process.argv[2] || join(ROOT, '..', 'applet'));
const archiveSha256 = process.argv[3];
const target = join(ROOT, 'spec', 'product-truth', 'applet');
const manifestPath = join(ROOT, 'spec', 'product-truth', 'manifest.json');

if (!existsSync(source)) throw new Error(`APPLET source not found: ${source}`);
if (!/^[0-9a-f]{64}$/i.test(archiveSha256 || '')) {
  throw new Error('A verified source archive SHA-256 is required as the second argument.');
}

const allowed = /\.(vue|js|json)$/;
const ignored = new Set(['node_modules', 'unpackage', 'uni_modules']);
const files = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || ignored.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (allowed.test(name)) files.push(p);
  }
}

walk(source);
files.sort();
if (!files.length) throw new Error('No APPLET source files matched (.vue/.js/.json).');

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });

const entries = [];
for (const file of files) {
  const rel = relative(source, file).replaceAll('\\', '/');
  const out = join(target, rel);
  mkdirSync(resolve(out, '..'), { recursive: true });
  cpSync(file, out);
  const data = readFileSync(file);
  entries.push({ path: rel, sha256: createHash('sha256').update(data).digest('hex'), bytes: data.length });
}

const manifest = {
  snapshot_id: `APPLET-SNAPSHOT-${new Date().toISOString().slice(0, 10)}`,
  logical_source: 'APPLET',
  source_archive_sha256: archiveSha256.toLowerCase(),
  source_selection: 'all non-third-party .vue/.js/.json files under APPLET; node_modules/unpackage/uni_modules and dot-directories excluded',
  file_count: entries.length,
  content_bytes: entries.reduce((n, x) => n + x.bytes, 0),
  files: entries,
};
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`APPLET snapshot built: ${entries.length} files, ${manifest.content_bytes} bytes`);
console.log(`Manifest: ${relative(ROOT, manifestPath)}`);
