// 临时：g06 帧表（屏数从 `video/src/data/g06.ts` 现读，当前 12 屏）+ 每屏"内容全在"的静帧取样帧（末句口播入场后再走骨架各自的尾巴）
// 注意：`outputs/g06-教培托管/07-片1-分镜稿.md` §一 与 `00-交付说明.md` 把本脚本当作帧号复算真源引用，删它前先改那两处指路。
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('../video/src/data/g06.ts', import.meta.url), 'utf8');
const blocks = [...src.matchAll(/ui:\s*'([\w-]+)'([\s\S]*?)(?=ui:\s*'[\w-]+'|$)/g)];
const FPS = 30, OVERLAP = 12;
// make-rules 的页脚淡入区间是 bf(4)+56 → +78，取样必须过 78；其余骨架末句入场 30 帧即内容全在
const TAIL = { 'g06-make-rules': 80 };
const rows = blocks.map((b) => {
  const dur = Number(b[2].match(/dur:\s*([\d.]+)/)[1]);
  const subs = [...b[2].matchAll(/startFrame:\s*(\d+)/g)].map((m) => Number(m[1]));
  return { ui: b[1], dur, frames: Math.floor(dur * FPS), lastSub: Math.max(...subs) };
});
const total = rows.reduce((n, r) => n + r.frames, 0) - OVERLAP * (rows.length - 1);
let cum = 0;
rows.forEach((r, n) => {
  const start = n === 0 ? 0 : cum - OVERLAP * n;
  cum += r.frames;
  const still = Math.min(start + r.lastSub + (TAIL[r.ui] || 30), start + r.frames - 18);
  console.log(`S${n + 1}\t${r.ui.padEnd(17)}\tstart=${String(start).padStart(4)} frames=${r.frames}\t末句入场=${r.lastSub}\tstill=${still}`);
  if (n === rows.length - 1) console.log(`\n成片 ${total} 帧 = ${(total / FPS).toFixed(1)} 秒`);
});
