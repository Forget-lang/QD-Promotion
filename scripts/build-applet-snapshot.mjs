#!/usr/bin/env node
/**
 * 将 APPLET 源固化为可提交的 Product Truth Snapshot（单文件归档 ＋ 清单）。
 * 用法：
 *   node scripts/build-applet-snapshot.mjs ../applet --live                  # 本机 live source 输入（CHANGE-20260923-044 起）
 *   node scripts/build-applet-snapshot.mjs ../applet <source-archive-sha256> # 来源 archive（如 applet.zip）输入
 *
 * 产物（committed 形态＝只有这两个文件）：
 *   spec/product-truth/applet/source.tar.xz  —— 范围内 .vue/.js/.json（排除 node_modules/unpackage/uni_modules/点目录）
 *   spec/product-truth/applet/manifest.json  —— 来源身份（archive SHA-256 或 live 源集摘要）＋逐文件 path/sha256/bytes
 *
 * 纪律（R10 §4）：来源可核验、逐文件可回溯、CI 只消费提交后的 snapshot，不伪造 source。
 */
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const liveMode = args.includes('--live');
const positional = args.filter((a) => !a.startsWith('--'));
const source = resolve(positional[0] || join(ROOT, '..', 'applet'));
const archiveSha256 = liveMode ? null : positional[1];
const target = join(ROOT, 'spec', 'product-truth', 'applet');
const manifestPath = join(target, 'manifest.json');

if (!existsSync(source)) throw new Error(`APPLET source not found: ${source}`);
if (!liveMode && !/^[0-9a-f]{64}$/i.test(archiveSha256 || '')) {
  throw new Error('archive 模式需要一个已核验来源 archive 的 SHA-256（第二个参数）；本机 live source 重建请显式加 --live。');
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

const sha256OfFile = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');

// 1) 暂存目录写入范围内文件（不直接写进仓库，最终只落 tar ＋ manifest）
const staging = mkdtempSync(join(tmpdir(), 'applet-snapshot-'));
const entries = [];
for (const file of files) {
  const rel = relative(source, file).replaceAll('\\', '/');
  const out = join(staging, rel);
  mkdirSync(resolve(out, '..'), { recursive: true });
  cpSync(file, out);
  entries.push({ path: rel, sha256: sha256OfFile(file), bytes: statSync(file).size });
}

// 2) 打包（GNU tar 可用时用确定性参数：排序＋固定 mtime/owner；bsdtar 退回普通打包，SHA 由 manifest 记录）
const today = new Date().toISOString().slice(0, 10);
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
const tarPath = join(target, 'source.tar.xz');
const isGnuTar = (spawnSync('tar', ['--version'], { encoding: 'utf8' }).stdout || '').includes('GNU tar');
const tarArgs = isGnuTar
  ? ['-cJf', tarPath, '--sort=name', `--mtime=${today} 00:00:00 UTC`, '--owner=0', '--group=0', '--numeric-owner', '-C', staging, '.']
  : ['-cJf', tarPath, '-C', staging, '.'];
const tarRun = spawnSync('tar', tarArgs, { stdio: 'inherit' });
if (tarRun.status !== 0) throw new Error(`tar failed with status ${tarRun.status}`);
rmSync(staging, { recursive: true, force: true });

// 3) live 模式：源集摘要（对「路径＋内容 SHA-256」排序串取 SHA-256）＝来源身份，替代 archive SHA-256
const sourceTreeSha256 = createHash('sha256')
  .update(entries.map((e) => `${e.path}\0${e.sha256}\n`).join(''))
  .digest('hex');

const manifest = {
  source_archive: liveMode ? '本机 live source（../applet）' : 'archive（zip/tar）',
  archive_sha256: liveMode ? null : archiveSha256.toLowerCase(),
  source_tree_sha256: sourceTreeSha256,
  provenance_note: liveMode
    ? '本次输入＝本机 live source（无来源 archive）：source_tree_sha256＝对「相对路径＋内容 SHA-256」排序串取 SHA-256 的源集摘要，作来源身份；archive_sha256 留空（R10 §4 的 archive 位仅 archive 模式使用）'
    : '本次输入＝来源 archive：archive_sha256＝该 archive 的 SHA-256；source_tree_sha256 同时记录源集摘要',
  snapshot_archive: 'source.tar.xz',
  snapshot_sha256: sha256OfFile(tarPath),
  file_count: entries.length,
  scope: 'all .vue/.js/.json source files, excluding node_modules, unpackage, uni_modules, .git and macOS metadata',
  generated_at: today,
  verification: [
    'snapshot sha256 recorded above',
    `snapshot contains exactly ${entries.length} source files`,
    'snapshot excludes .git and generated dependency/build directories',
    'per-file path/sha256/bytes listed below (R10 §4)',
  ],
  files: entries,
};
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`APPLET snapshot built: ${entries.length} files`);
console.log(`tar: ${relative(ROOT, tarPath)}（${manifest.snapshot_sha256.slice(0, 16)}…）`);
console.log(`manifest: ${relative(ROOT, manifestPath)}（source_tree_sha256 ${sourceTreeSha256.slice(0, 16)}…）`);
