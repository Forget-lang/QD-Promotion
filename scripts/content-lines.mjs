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

/** 合法 applicability 声明值（枚举真源仍是 ref-registry.gateApplicability.values；这里只作兜底） */
export const BUILTIN_APPLICABILITY = ['APPLY', 'OBSERVE', 'N/A', 'OWNER_PENDING'];

function applicabilityEnum(reg) {
  const declared = reg?.gateApplicability?.values;
  const keys = declared && Object.keys(declared).length ? Object.keys(declared) : BUILTIN_APPLICABILITY;
  return new Set(keys);
}

/**
 * 校验一个 applicability 取值。未注册值（OBSERVE2 / PENDING / OPTIONAL / 拼写错的 apply）
 * 一律硬失败——配置写错必须显眼，不能悄悄退化成某种合法态。
 * 注意：这与 gateAppliesFor 的"不猜默认值"是同一条纪律的两半。
 */
export function assertApplicability(value, where, reg = loadRegistry()) {
  const enumSet = applicabilityEnum(reg);
  if (value && enumSet.has(value)) return value;
  const key = value == null ? '(缺失或为空)' : `"${value}"`;
  throw new Error(
    `content-lines：${where} 的 applicability 取值 ${key} 不在已注册枚举内 —— 合法值：${[...enumSet].join(' / ')}；` +
      `新增态必须先登记进 ref-registry.gateApplicability.values`,
  );
}

/** 兜底枚举（registry 可读时以 gateApplicability.values 为真源） */
const FALLBACK_ENUM = BUILTIN_APPLICABILITY;
function enumKeysOf(text, reg) {
  if (reg?.gateApplicability?.values) return Object.keys(reg.gateApplicability.values);
  const m = text && text.match(/"gateApplicability"\s*:\s*\{\s*"values"\s*:\s*\{([^}]*)\}/);
  if (m) {
    const keys = [...m[1].matchAll(/"([A-Z_]+)"\s*:/g)].map((x) => x[1]);
    if (keys.length) return keys;
  }
  return FALLBACK_ENUM;
}

/**
 * 消费者统一入口：一次完成"读 registry → 解析 contentLines → 枚举校验"。
 * 契约 CHANGE-20260920-031 §3.2.1 要求：无论非法值出现在 defaultApplicability 还是
 * gateOverrides，所有闸门都必须得到**同一种可读诊断 ＋ exit=1**，不得抛未捕获堆栈。
 * 本函数因此自带 try/catch（含 registry JSON 本身损坏、contentLines 缺失等更早的失败点）。
 */
export function initContentLines({ label = 'content-lines', root = ROOT } = {}) {
  let reg;
  let raw;
  try {
    raw = readFileSync(join(root, 'scripts', 'ref-registry.json'), 'utf8');
    reg = JSON.parse(raw);
  } catch (e) {
    console.error(`❌ ${label}：无法读取或解析 scripts/ref-registry.json —— ${e.message}`);
    console.error('   判线声明源不可用，拒绝退回硬编码 g 前缀。');
    process.exit(1);
  }
  try {
    const lines = getContentLines(reg);
    if (!lines) {
      console.error(`❌ ${label}：ref-registry 未声明 contentLines —— 判线声明缺失，拒绝退回硬编码 g 前缀`);
      process.exit(1);
    }
    return { reg, lines, industry: lines.find((l) => l.id === 'industry') || null };
  } catch (e) {
    console.error(`❌ ${label}：内容线声明非法 —— ${e.message}`);
    console.error(
      `   合法值：${enumKeysOf(raw, reg).join(' / ')}；修法：校正 ref-registry.contentLines / gateApplicability。`,
    );
    process.exit(1);
  }
}

/** 取内容线声明；缺失时返回 null，由调用方显式失败——禁止静默回退到"行业线" */
export function getContentLines(reg = loadRegistry()) {
  const lines = Array.isArray(reg.contentLines) ? reg.contentLines : null;
  if (!lines || !lines.length) return null;
  return lines.map((l) => {
    assertApplicability(l.defaultApplicability, `contentLines[${l.id}].defaultApplicability`, reg);
    return { ...l, idPattern: l.idPattern ? new RegExp(l.idPattern, 'i') : null };
  });
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

/**
 * 线内数字编号（字符串序不可当线序用：`f90` 会排在 `g11` 之后）。
 * 边界（AI-A 在 B3 评审中提出，已固化为代码约束而非口头纪律）：
 * 只接受**裸片号或裸文件名**（g11 / g11.ts / f90.ts）。传入含路径分隔符的完整路径
 * （如 outputs/g11-烧烤/scene-02/x.png）会被拒——否则对"最后一个数字"取值会得到 02 而不是 11，
 * 排序键就悄悄错了。调用方必须先 lineOf 判线、再传片号身份来排序。
 */
export function lineNumericId(token, lines = getContentLines()) {
  const s = String(token ?? '');
  if (/[/\\]/.test(s)) {
    throw new Error(
      `content-lines：lineNumericId 不接受完整路径（收到 ${s}）—— 请先判线、再传裸片号/文件名作排序键`,
    );
  }
  let cand = s.replace(/\.(ts|tsx)$/i, '');
  if (lines) {
    const ok = lines.some((l) => l.idPattern && l.idPattern.test(cand));
    if (!ok) {
      throw new Error(`content-lines：排序键 ${token} 不是任何内容线的片号身份，拒绝用任意数字排序`);
    }
  }
  const m = cand.match(/(\d+)/g);
  return m ? Number(m[m.length - 1]) : -1;
}

/** 按 (内容线, 线内数字编号) 排序 —— 跨线顺序不由本函数决定，调用方必须先分线再各自排序 */
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
  const overrides = reg?.gateApplicability?.gateOverrides?.[gateKey];
  if (overrides && Object.prototype.hasOwnProperty.call(overrides, line.id)) {
    return assertApplicability(overrides[line.id], `gateApplicability.gateOverrides['${gateKey}']['${line.id}']`, reg);
  }
  const fallback = line.defaultApplicability;
  if (!fallback) {
    throw new Error(`content-lines：内容线 ${line.id} 未声明 defaultApplicability，拒绝猜默认值`);
  }
  return assertApplicability(fallback, `contentLines[${line.id}].defaultApplicability`, reg);
}

export const describeLine = (line) => `${line?.label || line?.id || '未知线'}(${line?.id || '-'})`;

export const basenameOf = (p) => basename(String(p ?? ''));
