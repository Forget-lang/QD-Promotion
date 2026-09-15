#!/usr/bin/env node
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT=join(dirname(fileURLToPath(import.meta.url)),'..');
const APPLET=join(ROOT,'..','applet');
const SNAPSHOT=join(ROOT,'spec','product-truth','applet-ui-snapshot-20260915.json');
const DATA=join(ROOT,'video','src','data');
const norm=s=>String(s).replace(/\s+/g,'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'");
const keys=s=>[...s.matchAll(/(?:^|[{,\s])k:\s*'([^']+)'/g)].map(m=>m[1]);
const groups=s=>{let o=[],c=null;for(const m of s.matchAll(/(?:^|[{,\s])(head|k):\s*'([^']+)'/g)){if(m[1]==='head'){c={head:m[2],rows:[]};o.push(c)}else if(c)c.rows.push(m[2])}return o};
const scenes=s=>{const a=[...s.matchAll(/ui:\s*'([^']+)'/g)].map(m=>({ui:m[1],i:m.index}));return a.map((x,i)=>{const b=s.slice(x.i,i+1<a.length?a[i+1].i:s.length);return{ui:x.ui,type:(b.match(/couponType:\s*'([^']+)'/)||[])[1]||null,keys:keys(b)}})};
if(!existsSync(DATA)){console.error(`❌ 找不到数据目录：${DATA}`);process.exit(1)}
let corpus=new Set(),mode='';
if(existsSync(APPLET)){const walk=d=>{for(const e of readdirSync(d,{withFileTypes:true})){if(['uni_modules','node_modules','unpackage'].includes(e.name)||e.name.startsWith('.'))continue;const p=join(d,e.name);if(e.isDirectory())walk(p);else if(/\.(vue|js|json)$/.test(e.name))for(const line of readFileSync(p,'utf8').split(/\r?\n/))for(const q of line.matchAll(/["']([^"'\\\n]{2,80})["']/g))if(/[\u4e00-\u9fff]/.test(q[1]))corpus.add(norm(q[1]))}};walk(APPLET);mode='live ../applet'}
else if(existsSync(SNAPSHOT)){const s=JSON.parse(readFileSync(SNAPSHOT,'utf8'));for(const x of s.labels||[])corpus.add(norm(x));mode=`R10 snapshot ${s.snapshot_id}`}
else{console.error('❌ 无 APPLET live source，也无 R10 Product Truth snapshot');process.exit(1)}
const tables=[['spec/coupon-fields.json','优惠券'],['spec/card-fields.json','次卡']].filter(([p])=>existsSync(join(ROOT,p))).map(([p,tag])=>({tag,json:JSON.parse(readFileSync(join(ROOT,p),'utf8'))}));
const native=new Map(),all=new Set();for(const {json} of tables){for(const f of json.fields||[])if(f.label)all.add(f.label);for(const g of json.createGroups||[]){for(const r of g.rows||[])all.add(r);if(g.title)native.set(g.title,g.rows||[])}}
const face=new Set(['原价','券面额','优惠金额','折扣','兑换内容','随机最小金额','随机最大金额']);const types=new Map((tables[0]?.json.couponTypes||[]).map(t=>[t.label,new Set(t.faceFields||[])]));
const files=readdirSync(DATA).filter(f=>f.endsWith('.ts')),missing=[],mis=[],undeclared=[],tm=[],tmiss=[];let total=0;
for(const f of files){const s=readFileSync(join(DATA,f),'utf8');for(const k of keys(s)){total++;if(!corpus.has(norm(k)))missing.push(`${f} k:'${k}'`)}for(const g of groups(s)){const n=g.head.replace(/^[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳]\s*/,'').trim();const rows=native.get(n);if(rows)for(const r of g.rows)if(!rows.some(x=>x===r||x.startsWith(r)||r.startsWith(x)))mis.push(`${f} 「${g.head}」 k:'${r}'`)}for(const sc of scenes(s)){const used=sc.keys.filter(k=>face.has(k));if(!sc.type){if(used.length)undeclared.push(`${f} ${sc.ui}: ${used.join('/')}`);continue}const allow=types.get(sc.type);if(!allow)continue;const w=used.filter(k=>!allow.has(k));if(w.length)tm.push(`${f} ${sc.ui}: ${w.join('/')}`);const m=[...allow].filter(k=>!used.includes(k));if(m.length)tmiss.push(`${f} ${sc.ui}: ${m.join('/')}`)}}
console.log('\n══════════════ 上屏真实性闸门 ══════════════\n');console.log(`产品事实源：${mode}`);console.log(`数据文件：${files.join(', ')}`);console.log(`① 字段名逐字取证 ${missing.length?'❌':'✅'} —— ${missing.length?missing.length+' 个未取证':'命中 '+total+' 个字段名'}`);missing.forEach(x=>console.log('   '+x));console.log(`③ 分组归属 ${mis.length?'❌':'✅'} —— ${mis.length?mis.length+' 处错误':'通过'}`);mis.forEach(x=>console.log('   '+x));console.log(`⑥ 券种↔面额字段配对 ${(tm.length+tmiss.length+undeclared.length)?'❌':'✅'} —— ${tm.length+tmiss.length+undeclared.length?tm.length+tmiss.length+undeclared.length+' 处错误':'通过'}`);[...tm,...tmiss,...undeclared].forEach(x=>console.log('   '+x));if(mode.startsWith('R10'))console.log('⑤ 真值表自证 ⚠️ —— CI 以 R10 快照的归档哈希与证据文件哈希追溯，不伪造 ../applet 目录；本层不因缺失 CI 源码目录而放行未知字段。');else console.log('⑤ 真值表自证 ✅ —— live source 模式由本地源码直接取证（表级异常仍由现有真值表审计负责）。');
if(missing.length||mis.length||tm.length||tmiss.length||undeclared.length){console.log('\n❌ 上屏真实性闸门未通过。');process.exit(1)}console.log('\n✅ 上屏真实性闸门通过。');process.exit(0);
