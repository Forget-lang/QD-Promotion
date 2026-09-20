#!/usr/bin/env node
/**
 * scripts/content-lines.mjs · 内容线判定的唯一声明源
 *
 * 为什么要有它：CHANGE-20260920-031 实测发现"当前片"在本仓库有四套互不相同的机制
 * （index 导出顺序 / 文件名字符串排序 / `/^g\d+/` 正则 / 全局 mtime），
 * 而且多个脚本各自写死 `g` 前缀，非行业内容线会**静默漏检**。
 * 本模块把判线与顺序收敛为一处，脚本只读 `ref-registry.json` 的声明，
 * 不得自行写前缀正则，也不得在声明缺失时猜一个默认值。
 *
 * 契约：CHANGE-20260920-031 §3.2（namespace + applicability）、§十 反例 1/2。
 */
import { readFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export const loadRegistry = () =>
  JSON.parse(readFileSync(join(ROOT, 'scripts', 'ref-registry.json'), 'utf8'));

/** 取内容线声明；缺失时返回 null，由调用方显式失败——禁止静默回退到"行业线" */
export function getContentLines(reg = loadRegistry()) {
  const lines = Array.isArray(reg.contentLines) ? reg.contentLines : null;
  if (!lines || !lines.length) return null;
  return lines.map((l) => ({
    ...l,
    idPattern: l.idPattern ? new RegExp(l.idPattern, 'i') : null,
  }));
}

/** 从任意标识（片号 / 文件名 / 相对路径 / 绝对路径）解析所属内容线；无法归属返回 null，不猜 */
export function lineOf(token, lines = getContentLines()) {
  if (!lines) return null;
  const s = String(token ?? '');
  for (const l of lines) {
    if (!l.idPattern) continue;
    if (l.idPattern.test(s)) return l;
    // 目录/路径形态（outputs/g11-烧烤/…、.tmp-fixture/outputs/f90-功能/…）：
    // 按"路径段以 outputPrefix + 数字开头"匹配，避免各脚本再各自写一遍前缀正则。
    const prefix = l.outputPrefix;
    if (prefix && new RegExp(`(^|[/\\\\])${prefix}\\d+`, 'i').test(s)) return l;
  }
  return null;
}

/** 线内数字编号（字符串序不可当线序用：`f90` 会排在 `g11` 之后）；解析失败返回 -1 */
export function lineNumericId(token) {
  const m = String(token ?? '').match(/(\d+)/g);
  return m ? Number(m[m.length - 1]) : -1;
}

/** 按线内数字编号升序排序（原地排序，返回同数组） */
export function sortByLineNumeric(items, keyOf = (x) => x) {
  return items.sort((a, b) => lineNumericId(keyOf(a)) - lineNumericId(keyOf(b)));
}

/**
 * 某个闸门对某条内容线是否适用 —— 声明优先，缺失即报错（拒绝隐式 applicability）。
 * 查找顺序：gateOverrides[gateKey] → 该线 defaultApplicability。
 */
export function gateAppliesFor(reg, gateKey, line) {
  if (!line) {
    throw new Error(
      `content-lines：闸门 ${gateKey} 拿到一个无法归属内容线的目标 —— 判线声明缺失或目标命名不在声明内，拒绝默认放行（见 CHANGE-20260920-031 §3.2）`,
    );
  }
  const override = reg?.gateApplicability?.gateOverrides?.[gateKey]?.[line.id];
  if (override) return override;
  const fallback = line.defaultApplicability;
  if (!fallback) {
    throw new Error(`content-lines：内容线 ${line.id} 未声明 defaultApplicability，拒绝猜默认值`);
  }
  return fallback;
}

export const describeLine = (line) => `${line?.label || line?.id || '未知线'}(${line?.id || '-'})`;

export const basenameOf = (p) => basename(String(p ?? ''));
