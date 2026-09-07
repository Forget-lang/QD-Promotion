// g09 宠物店（洗护美容）· 片1 · 数据（无声逐屏阶段 · 7 屏）
// S1 钩子 → S2 痛点 → S3 制券①（次数+有效期）→ S4 制券②（核销间隔·讲透）→ S5 私密发放 → S6 结果 → S7 收尾
// 背景 = bgImage 蓝绿光斑底（BG-ABS-004），由 VTemplate 垫底；屏组件透明叠内容。
// 字段名/组标题键用 k / v / head（对齐 check-ui-truth，次卡字段回 spec/card-fields.json 逐字取证）。
// 次卡不是优惠券：制券屏不声明 couponType（⑥ 只认优惠券）。数值均为示例。
// hasAudio:false——无声逐屏阶段；dur 为占位估算（每屏 ≥10s 保证入场收敛可抽全内容帧），阶段二按 TTS 实测回填。
import type { Scene, VideoData } from '../types';

const scenes: Scene[] = [
  {
    type: 'hook', ui: 'g09-hook', layoutKind: 'hero-object', dur: 8.5,
    payload: {
      badge: '示例',
      title: '洗完这一次，下回啥时候来？',
      sub: '别靠记性——一张次卡把次数摆到明面上',
      cardName: '洗护5次卡',
      times: 5,
      usedTimes: 2,
      remainLabel: '还剩 3 次',
    },
  },
  {
    type: 'pain', ui: 'g09-pain', layoutKind: 'flow', dur: 9,
    payload: {
      title: '客人是怎么一步步走丢的',
      sub: '没有一张卡替他记，就全靠运气',
      nodes: [
        { time: '今天', text: '洗完这一次，客人离店' },
        { time: '3 天后', text: '你忘了，客人也没想起你' },
        { time: '一个月', text: '该洗了，没人提一句' },
        { time: '再后来', text: '它去了别家', lost: true },
      ],
    },
  },
  {
    type: 'fields', ui: 'g09-make', layoutKind: 'form', dur: 12,
    payload: {
      badge: '示例',
      cardName: '洗护5次卡',
      times: 5,
      validLabel: '有效期 120 天 · 每人限领 1 张',
      title: '制作这张洗护次卡',
      sub: '逐项设一下（数值为示例）',
      groups: [
        {
          head: '① 卡基本信息',
          rows: [
            { k: '次卡名称', v: '洗护5次卡' },
            { k: '制作数量', v: '100 张' },
            { k: '每人限领', v: '1 张' },
            { k: '每张包含次数', v: '5 次', hero: true, tag: '把一次变五次' },
          ],
        },
        {
          head: '② 期限',
          rows: [
            { k: '有效期类型', v: '自领券日起' },
            { k: '有效期', v: '120 天', indent: true },
          ],
        },
        {
          head: '③ 领取与转赠',
          rows: [
            { k: '允许转赠', v: '开' },
            { k: '填写手机号', v: '关' },
          ],
        },
      ],
    },
  },
  {
    type: 'fields', ui: 'g09-make', layoutKind: 'form', dur: 12,
    payload: {
      badge: '示例',
      cardName: '洗护5次卡',
      times: 5,
      validLabel: '打开核销间隔 · 每两周用一次',
      intervalHint: '14 天',
      title: '锁住到店节奏',
      sub: '别让客人一周把次数用光',
      groups: [
        {
          head: '② 期限',
          rows: [
            { k: '有效期类型', v: '自领券日起' },
            { k: '有效期', v: '120 天', indent: true },
          ],
        },
        {
          head: '③ 核销节奏',
          rows: [
            { k: '限制核销间隔', v: '开', hero: true, tag: '锁到店节奏' },
            { k: '核销间隔', v: '14 天', indent: true, tag: '两周来一次' },
          ],
        },
      ],
    },
  },
  {
    type: 'fields', ui: 'g09-make', layoutKind: 'form', dur: 10,
    payload: {
      badge: '示例',
      cardName: '洗护5次卡',
      times: 5,
      validLabel: '办卡人专属 · 领后此码失效',
      title: '只发给办卡的人',
      sub: '次卡仅私密发放（数值为示例）',
      groups: [
        {
          head: '① 发给谁',
          rows: [
            { k: '超时时间', v: '1 天' },
            { k: '发放方式', v: '二维码', hero: true, tag: '一对一' },
            { k: '发放备注', v: '张姐·金毛·洗护5次' },
          ],
        },
        {
          head: '② 领取设置',
          rows: [
            { k: '允许转赠', v: '开' },
            { k: '填写手机号', v: '关' },
          ],
        },
      ],
    },
  },
  {
    type: 'advance', ui: 'g09-result', layoutKind: 'hero-object', dur: 9,
    payload: {
      title: '设完，客人和你各看到什么',
      sub: '一张卡，把"下次还来"摆到明面上',
      cardName: '洗护5次卡',
      times: 5,
      usedTimes: 3,
      remainLabel: '还剩 2 次',
      log: [
        { n: 1, date: '8 月 12 日', done: true },
        { n: 2, date: '8 月 26 日', done: true },
        { n: 3, date: '9 月 9 日', done: true },
        { n: 4, date: '', done: false },
        { n: 5, date: '', done: false },
      ],
    },
  },
  {
    type: 'cta', ui: 'g09-cta', layoutKind: 'hero-focus', dur: 6.5,
    payload: {
      line: '把洗完这一次，变成接下来五次',
      times: 5,
      brand: '券到卡包',
      sub: '实体店的电子券工具',
    },
  },
];

export const g09: VideoData = {
  id: 'g09',
  style: {
    palette: 'deep-blue',
    motion: 'buttery',
    transition: 'reveal',
    hookStyle: 'story',
    bgImage: 'backgrounds/g09/bg.png',
    bgBlur: 0,
  },
  scenes,
  hasAudio: false,
};
