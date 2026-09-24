#!/usr/bin/env node
/**
 * Negative test for T3（CHANGE-20260924-056）：Gate 必须真实扫到风格包专属产物，
 * 且适用性按风格声明取值；线 × 非缺省风格的合成规则未定稿时**拒绝猜**。
 *
 * 为什么需要它：白板片的产物落在 `outputs/{dir}/whiteboard/`（子目录），旧版 gate-all 只扫
 * 片目录**顶层** mp4 ⇒ 会打印"⏭️ 跳过（暂无成片）"并让汇总显示通过——即"文档说测了、实际没测"。
 * 本测试用 fixture 证明：① 子目录产物能被扫到；② 缺省风格片仍走线级声明（零漂移）；
 * ③ 教程线 × 非缺省风格 = 响亮失败，不得静默选一种合成口径。
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getContentLines, probeTargetFor } from './content-lines.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'qd-style-scan-'));

const registry = {
  contentLines: [
    { id: 'industry', label: '行业场景攻略', outputPrefix: 'g', idPattern: '^g\\d+$', defaultApplicability: 'APPLY' },
    { id: 'tutorial', label: '产品功能教程', outputPrefix: 'f', idPattern: '^f\\d+$', defaultApplicability: 'EXPLICIT_REQUIRED' },
  ],
  gateApplicability: {
    values: {
      APPLY: '按现行判据执行',
      OBSERVE: '照测不判红',
      'N/A': '不适用',
      OWNER_PENDING: 'Owner 未建立',
      EXPLICIT_REQUIRED: '逐闸必须显式声明',
    },
    gateOverrides: {
      'gate-all-motion-observation': { tutorial: 'OBSERVE' },
      'gate-all-safearea-observation': { tutorial: 'OBSERVE' },
    },
  },
  styles: {
    defaultStyleId: 'remotion-components',
    items: [
      {
        id: 'whiteboard',
        label: '白板手绘',
        packPath: 'video/styles/whiteboard/',
        status: 'experimental',
        piecePatterns: ['outputs/{dir}/whiteboard/'],
        gateApplicability: {
          'gate-all-safearea-observation': 'APPLY',
          'gate-all-motion-observation': 'OBSERVE',
        },
      },
      {
        id: 'remotion-components',
        label: '信息卡·组件驱动',
        packPath: 'video/styles/remotion-components/',
        status: 'active',
        piecePatterns: ['video/src/data/{id}.ts'],
        gateApplicability: {
          'gate-all-safearea-observation': 'APPLY',
          'gate-all-motion-observation': 'APPLY',
        },
      },
    ],
  },
};

const write = (rel, content = '') => {
  const p = path.join(tempRoot, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};
const dirOf = (name) => [{ name, path: path.join(tempRoot, 'outputs', name) }];

write('scripts/ref-registry.json', JSON.stringify(registry, null, 2));
// 白板片：产物只在风格专属子目录里（顶层无 mp4）——旧口径扫不到的那一种
write('outputs/g98-测试/whiteboard/demo-无声成片.mp4', 'fake');
// 缺省风格片：顶层 mp4（既有口径）
write('video/src/data/g97.ts', '// fixture');
write('outputs/g97-默认/g97-默认-有声成片.mp4', 'fake');
// 教程线 + 非缺省风格：合成规则未定稿 → 必须抛错
write('outputs/f98-教程/whiteboard/demo.mp4', 'fake');

const reg = JSON.parse(fs.readFileSync(path.join(tempRoot, 'scripts', 'ref-registry.json'), 'utf8'));
const lines = getContentLines(reg);
const industry = lines.find((l) => l.id === 'industry');
const tutorial = lines.find((l) => l.id === 'tutorial');

const failures = [];
const check = (cond, msg) => { if (!cond) failures.push(msg); };

// ① T3 核心：风格专属子目录内的 mp4 必须被扫到（旧口径此处 found=false ⇒ 静默跳过）
const wb = probeTargetFor(reg, {
  gateKey: 'gate-all-motion-observation',
  artifactKind: 'videos',
  line: industry,
  dirs: dirOf('g98-测试'),
  root: tempRoot,
});
check(wb.found, '① 风格专属子目录内的 mp4 未被扫到 —— T3 修复失效（旧口径会静默跳过）');
check(
  wb.found && /whiteboard\/demo-无声成片\.mp4$/.test(wb.artifacts.videos[0] || ''),
  `① 命中产物不是风格专属子目录里那支：${wb.found ? wb.artifacts.videos[0] : '(未命中)'}`,
);
check(wb.found && wb.searched.some((s) => s.includes('outputs/g98-测试/whiteboard/')), '① 未测清单缺少风格产物根的查证路径');
check(wb.found && !wb.isDefault && wb.style.id === 'whiteboard', '① 片风格认领不是 whiteboard');

// ② 适用性按风格声明取值（白板 motion＝OBSERVE），不再套用行业线默认 APPLY
check(wb.found && wb.applies === 'OBSERVE', `② 白板片适用性应取风格声明 OBSERVE，实得 ${wb.found ? wb.applies : '(未命中)'}`);

// ③ 缺省风格片：走线级声明（APPLY），且既有顶层寻址不变（零漂移）
const def = probeTargetFor(reg, {
  gateKey: 'gate-all-motion-observation',
  artifactKind: 'videos',
  line: industry,
  dirs: dirOf('g97-默认'),
  root: tempRoot,
});
check(def.found && def.isDefault, '③ 缺省风格片未被认领为缺省');
check(def.found && def.applies === 'APPLY', `③ 缺省风格片应取线级 APPLY，实得 ${def.found ? def.applies : '(未命中)'}`);

// ④ 线 × 非缺省风格：合成规则未定稿 ⇒ 拒绝猜（必须抛错）
let threw = null;
try {
  probeTargetFor(reg, {
    gateKey: 'gate-all-motion-observation',
    artifactKind: 'videos',
    line: tutorial,
    dirs: dirOf('f98-教程'),
    root: tempRoot,
  });
} catch (e) {
  threw = e;
}
check(threw !== null, '④ 教程线 × 非缺省风格未抛错 —— 静默选了一种未定稿的合成口径');
check(threw !== null && /合成规则/.test(threw.message), `④ 抛错原因不是"合成规则未定稿"：${threw && threw.message}`);
if (threw) console.log(`   （④ 预期抛错已捕获：${threw.message.slice(0, 80)}…）`);

// ⑤ 产物缺失：found=false 且 searched 仍列出查证路径 —— gate-all 的「未测清单」据此留痕（跳过≠通过）
const empty = probeTargetFor(reg, {
  gateKey: 'gate-all-safearea-observation',
  artifactKind: 'frames',
  line: industry,
  dirs: dirOf('g98-测试'),
  root: tempRoot,
});
check(empty.found === false, '⑤ 无静帧产物时不应报 found=true');
check(
  empty.searched.some((s) => s.includes('outputs/g98-测试/whiteboard/')),
  '⑤ 未测时未列出风格产物根的查证路径 —— 未测清单会失去可核对性',
);

fs.rmSync(tempRoot, { recursive: true, force: true });

if (failures.length) {
  console.error('STYLE-SCAN NEGATIVE TEST FAIL:');
  for (const f of failures) console.error(`   - ${f}`);
  process.exit(1);
}
console.log('STYLE-SCAN NEGATIVE TEST PASS: 风格子目录产物可扫、适用性按风格取值、缺省零漂移、线×风格未定稿必拒。');
