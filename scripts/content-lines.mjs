#!/usr/bin/env node
/**
 * scripts/content-lines.mjs · 内容线判定 ＋ 片→风格认领的唯一声明消费者
 *
 * 为什么要有它：CHANGE-20260920-031 实测发现"当前片"在本仓库有四套互不相同的机制
 * （index 导出顺序 / 文件名字符串排序 / `/^g\d+/` 正则 / 全局 mtime），
 * 而且多个脚本各自写死 `g` 前缀，非行业内容线会**静默漏检**。
 * 本模块把判线与顺序收敛为一处，脚本只读 `ref-registry.json` 的声明，
 * 不得自行写前缀正则，也不得在声明缺失时猜一个默认值。
 *
 * 风格层（CHANGE-20260923-039 批 4-2 / A2 方案 C）：片→风格认领同样只读 `ref-registry.styles`
 * 声明（`items[].piecePatterns` ＋ `defaultStyleId`），不在这里写死任何风格 id 或路径形态。
 *
 * 契约：CHANGE-20260920-031 §3.2（namespace + applicability）、§十 反例 1/2；
 *       CHANGE-20260923-039 §八.5、§二十五 25.1、§三十一 方案 C。
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export const loadRegistry = () =>
  JSON.parse(readFileSync(join(ROOT, 'scripts', 'ref-registry.json'), 'utf8'));

/**
 * 合法 applicability 声明值（枚举真源仍是 ref-registry.gateApplicability.values；这里只作兜底）。
 * 注意：`EXPLICIT_REQUIRED` 是 **defaultApplicability 专用策略值**（"该线不设默认、逐闸必须显式声明"），
 * **不是闸门结果态**——出现在 gateOverrides 一律拒绝（CHANGE-20260920-032 §3.5.1）。
 */
export const BUILTIN_APPLICABILITY = ['APPLY', 'OBSERVE', 'N/A', 'OWNER_PENDING', 'EXPLICIT_REQUIRED'];

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
    // 统一入口预检：gateOverrides **全量**校验，不等某个消费者用到那条线才发现。
    // 否则"非法值只在被消费时炸"会让一个只有别的闸门用到的坏账安静躺着（CHANGE-20260920-031 §3.2.1）。
    const overrides = reg?.gateApplicability?.gateOverrides || {};
    for (const [gate, byLine] of Object.entries(overrides)) {
      for (const [lineId, value] of Object.entries(byLine || {})) {
        assertApplicability(value, `gateApplicability.gateOverrides['${gate}']['${lineId}']`, reg);
        // 作用域校验（CHANGE-20260920-032 §3.5.1）：EXPLICIT_REQUIRED 只允许出现在 defaultApplicability。
        if (value === 'EXPLICIT_REQUIRED') {
          throw new Error(
            `content-lines：gateApplicability.gateOverrides['${gate}']['${lineId}'] 不允许使用 EXPLICIT_REQUIRED —— 它是 defaultApplicability 专用策略值（该线不设默认、逐闸必须声明），不是闸门结果态；请改为 APPLY / OBSERVE / N/A`,
          );
        }
      }
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
 * 特例（CHANGE-20260920-032 §3.5.1）：默认位为 `EXPLICIT_REQUIRED` 时**抛硬错误、不返回任何状态**——
 * 它表示"该线不设默认、逐闸必须显式声明"，未登记的新闸门绝不能因此静默得到 N/A。
 * 于是闸门只可能收到 APPLY / OBSERVE / N/A / OWNER_PENDING 四种结果。
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
  if (fallback === 'EXPLICIT_REQUIRED') {
    throw new Error(
      `content-lines：闸门「${gateKey}」尚未对内容线「${line.label || line.id}」声明适用性 —— 该线不设默认（EXPLICIT_REQUIRED）；请在 ref-registry.gateApplicability.gateOverrides['${gateKey}']['${line.id}'] 登记 APPLY / OBSERVE / N/A 后再运行（见 CHANGE-20260920-032 §3.5.1）`,
    );
  }
  return assertApplicability(fallback, `contentLines[${line.id}].defaultApplicability`, reg);
}

export const describeLine = (line) => `${line?.label || line?.id || '未知线'}(${line?.id || '-'})`;

export const basenameOf = (p) => basename(String(p ?? ''));

// ─────────────────────────────────────────────────────────────────────────────
// 风格层：片 → 风格认领（CHANGE-20260923-039 批 4-2 / A2 方案 C）
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 严格读取 `ref-registry.styles`：缺失或任一条目畸形即返回 null（调用方显式失败）。
 * 畸形＝缺 id / packPath / status / piecePatterns（空数组也算缺）/ gateApplicability。
 */
export function getStyles(reg = loadRegistry()) {
  const items = reg?.styles?.items;
  if (!Array.isArray(items) || !items.length) return null;
  for (const s of items) {
    if (!s || typeof s.id !== 'string' || !s.id) return null;
    if (typeof s.packPath !== 'string' || !s.packPath) return null;
    if (typeof s.status !== 'string' || !s.status) return null;
    if (!Array.isArray(s.piecePatterns) || !s.piecePatterns.length) return null;
    if (s.piecePatterns.some((p) => typeof p !== 'string' || !p)) return null;
    if (!s.gateApplicability || typeof s.gateApplicability !== 'object') return null;
  }
  return items;
}

/**
 * 一个风格的某闸门适用性；**未声明该闸门 = 硬错误**（沿用 EXPLICIT_REQUIRED 机制），
 * 不得静默当作 N/A，也不得继承别的风格（如 Remotion 帧设计）的判据。
 */
export function styleAppliesFor(reg, gateKey, style) {
  if (!style) throw new Error(`content-lines：闸门 ${gateKey} 拿到一个无法认领风格的片 —— 拒绝默认放行`);
  const v = style.gateApplicability?.[gateKey];
  if (v == null) {
    throw new Error(
      `content-lines：风格「${style.label || style.id}」尚未对本闸门声明适用性（风格不设默认适用性）——` +
        `请在 ref-registry.styles.items[id=${style.id}].gateApplicability 登记 APPLY / OBSERVE / N/A 后再运行（见 CHANGE-20260923-039 §三.7）`,
    );
  }
  return assertApplicability(v, `styles.items[id=${style.id}].gateApplicability['${gateKey}']`, reg);
}

/** outputs/ 下属于该片号的目录名（如 g11 → g11-烧烤）——供 piecePatterns 的 `{dir}` 解析 */
export function outputsDirsOf(pieceId, root = ROOT) {
  const out = [];
  let names = [];
  try { names = readdirSync(join(root, 'outputs')); } catch { return out; }
  for (const n of names) {
    if (!new RegExp(`^${String(pieceId)}(-|$)`, 'i').test(n)) continue;
    try { if (statSync(join(root, 'outputs', n)).isDirectory()) out.push(n); } catch { /* 忽略不可读项 */ }
  }
  return out;
}

/**
 * 从任意路径/标识提取「片号身份」（如 …/outputs/g11-烧烤/x.mp4 → g11）——豁免表查找等按内容线声明取，
 * **不写死 g/f 前缀**。匹配要求前缀前是路径分隔或串首（防 `config2` 被裸子串匹配成 `g2`）；
 * 未命中返回 null（调用方保持"无豁免"的行为，不得放宽成任意 `\w+\d+`）。
 */
export function pieceKeyOf(token, lines = getContentLines()) {
  const s = String(token ?? '');
  if (!lines) return null;
  for (const l of lines) {
    if (!l.outputPrefix) continue;
    const m = new RegExp(`(?:^|[/\\\\])${l.outputPrefix}\\d+`, 'i').exec(s);
    if (m) return m[0].replace(/^[/\\]/, '').toLowerCase();
  }
  return null;
}

/**
 * 片 → 风格认领（方案 C，2026-09-23 用户拍板）：
 *   ① 有风格以 `piecePatterns` 命中该片（模板 `{id}`＝片号、`{dir}`＝outputs 下该片目录名）
 *      → 命中 1 个：该风格（专属声明优先于缺省）；命中 ≥2 个：硬失败（拒绝猜）。
 *   ② 无命中 → 缺省 `styles.defaultStyleId`（缺省由声明给定，不靠推断；缺声明即硬失败）。
 * 返回 `{ style, matched, isDefault }`；`matched` ＝命中的声明路径（缺省时为 null）。
 */
export function claimStyleOfPiece(reg, { id, dirNames = [], root = ROOT } = {}) {
  const styles = getStyles(reg);
  if (!styles) throw new Error('content-lines：ref-registry.styles 缺失或条目畸形 —— 无法认领片风格，拒绝猜');
  const defaultId = reg?.styles?.defaultStyleId;
  if (!defaultId) throw new Error('content-lines：ref-registry.styles 未声明 defaultStyleId —— 拒绝为无专属声明的片猜一个风格');
  const fallback = styles.find((s) => s.id === defaultId);
  if (!fallback) throw new Error(`content-lines：styles.defaultStyleId=${defaultId} 不在 items 内 —— 声明自相矛盾`);
  const hits = [];
  for (const s of styles) {
    if (s.id === defaultId) continue;
    for (const tpl of s.piecePatterns) {
      const cands = tpl.includes('{dir}')
        ? dirNames.map((d) => tpl.replaceAll('{id}', String(id)).replaceAll('{dir}', d))
        : [tpl.replaceAll('{id}', String(id))];
      const hit = cands.find((c) => existsSync(join(root, c)));
      if (hit) { hits.push({ style: s, matched: hit }); break; }
    }
  }
  if (hits.length > 1) {
    throw new Error(
      `content-lines：片 ${id} 同时被多个风格声明命中（拒绝猜）——${hits.map((h) => `${h.style.id}（${h.matched}）`).join(' / ')}；` +
        '修法：一个片只能有一个风格身份，请厘清 piecePatterns（风格化片不得同时在 video/src/data 建屏级数据文件）',
    );
  }
  if (hits.length === 1) return { style: hits[0].style, matched: hits[0].matched, isDefault: false };
  return { style: fallback, matched: null, isDefault: true };
}
