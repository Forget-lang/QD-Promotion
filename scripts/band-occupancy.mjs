/** 分带占用率诊断：把画面纵向切 12 带，每带算内容像素占比，定位空白区间 */
import { spawnSync } from 'node:child_process';
 * 分带占用率诊断：把画面纵向切 12 带，逐带算内容像素占比，定位"到底哪一段空"——
 * 占用率总数值不达标时先看这个，别猜（教训：G05 v3 曾对着已 70~90% 的中段反复"填满"无效）。
 * 用法：node scripts/band-occupancy.mjs <png|mp4>nimport { join } from 'node:path';
const FF = join(process.cwd(), 'video/node_modules/ffmpeg-static/ffmpeg');
const W = 108, H = 192, BANDS = 12;
const file = process.argv[2];
const r = spawnSync(FF, ['-hide_banner','-loglevel','error','-i',file,'-vf',`scale=${W}:${H}`,'-f','rawvideo','-pix_fmt','rgb24','-'],{maxBuffer:1<<26});
const px = r.stdout;
const at=(x,y,c)=>px[(y*W+x)*3+c];
// 背景色 = 四边中位数
const border=[];
for(let x=0;x<W;x++){border.push([x,0],[x,H-1]);}
for(let y=0;y<H;y++){border.push([0,y],[W-1,y]);}
const bg=[0,1,2].map(c=>border.map(([x,y])=>at(x,y,c)).sort((a,b)=>a-b)[Math.floor(border.length/2)]);
const bh = H/BANDS;
const out=[];
for(let b=0;b<BANDS;b++){
  let hit=0,tot=0;
  for(let y=Math.floor(b*bh);y<Math.floor((b+1)*bh);y++)for(let x=0;x<W;x++){
    tot++;
    const d=Math.max(Math.abs(at(x,y,0)-bg[0]),Math.abs(at(x,y,1)-bg[1]),Math.abs(at(x,y,2)-bg[2]));
    if(d>24)hit++;
  }
  out.push(Math.round(hit/tot*100));
}
console.log(`${file.split('/').pop()}: ${out.map((v,i)=>`${i*bh*10|0}px:${v}%`).join(' ')}`);
