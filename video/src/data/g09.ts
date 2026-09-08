// g09 宠物店（洗护美容）· 片1 · 数据（有声版 · 7 屏 · 2026-09-07 实测回填）
// S1 钩子 → S2 痛点·流失时间轴 → S3 制券①（次数+有效期）→ S4 制券②（核销间隔·讲透）→ S5 私密发放 → S6 结果·卡特写+核销流水 → S7 收尾·泡泡逐亮
// 背景 = bgImage 蓝绿光斑底（BG-ABS-004），由 VTemplate 垫底；屏组件透明叠内容。
// 字段名/组标题键用 k / v / head（对齐 check-ui-truth，次卡字段回 spec/card-fields.json 逐字取证）。数值均为示例。
// 布局指纹：每屏 layoutKind 均 ≠ g08 同 type（check-layout-diversity 零碰撞无豁免）。
// 音频 = TTS（seed-tts 原速）→ loudnorm -16 LUFS → atempo 1.2，实测见 audio/g09/；dur = voiceOffset 0.27 + voiceDur + 尾读缓冲（长读/数据/CTA 0.85~0.9s、其余 0.5s）；字幕句界 = 实测时长 × 字数占比。口播真源 = 本文件 subtitles 逐字稿（02-口播文案.md 为第 3 步过程稿）。
import type { Scene, VideoData } from '../types';

const scenes: Scene[] = [
  {
    type: 'hook', ui: 'g09-hook', layoutKind: 'hero-object', dur: 9.4, voiceOffset: 0.27, voiceDur: 8.64,
    payload: {
      badge: '示例',
      title: '洗完这一次，下回啥时候来？',
      sub: '别靠记性——一张次卡把次数据到明面上',
      cardName: '洗护5次卡',
      times: 5,
      usedTimes: 2,
      remainLabel: '还剩 3 次',
    },
    subtitles: [
      { text: '宠物店做的是回头生意，可洗完这一次，人下回啥时候来，你心里没数。', startFrame: 8, endFrame: 166 },
      { text: '别靠记性——一张次卡，让次数他自己看得见。', startFrame: 169, endFrame: 267 },
    ],
  },
  {
    type: 'pain', ui: 'g09-pain', layoutKind: 'flow', dur: 11.8, voiceOffset: 0.27, voiceDur: 11.0,
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
    subtitles: [
      { text: '宠物洗护是回头生意，可客人洗完这一次，说走就走了。', startFrame: 8, endFrame: 135 },
      { text: '三天后你忘了，客人也没想起你。', startFrame: 138, endFrame: 211 },
      { text: '一个月后该洗了，没人提一句。', startFrame: 214, endFrame: 282 },
      { text: '再后来，它就去了别家。', startFrame: 285, endFrame: 338 },
    ],
  },
  {
    type: 'fields', ui: 'g09-make', layoutKind: 'form', dur: 16.5, voiceOffset: 0.27, voiceDur: 15.32,
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
    subtitles: [
      { text: '先做一张洗护次卡，名字直接写"洗护5次卡"。', startFrame: 8, endFrame: 106 },
      { text: '每张包含次数填五次——洗澡两三周一次，五次刚好管住两三个月。', startFrame: 109, endFrame: 252 },
      { text: '有效期给到一百二十天，用得完，又不至于拖太久把卡睡死。', startFrame: 255, endFrame: 386 },
      { text: '每人限领一张，别让人一次囤一堆。', startFrame: 389, endFrame: 468 },
    ],
  },
  {
    type: 'fields', ui: 'g09-make', layoutKind: 'form', dur: 18.7, voiceOffset: 0.27, voiceDur: 17.54,
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
    subtitles: [
      { text: '关键在这行——限制核销间隔，打开。', startFrame: 8, endFrame: 78 },
      { text: '间隔设十四天，每两星期才能用一次。', startFrame: 81, endFrame: 162 },
      { text: '为什么不让他随便用？一周把五次用光，优惠一次就没了；间隔一卡，客人两三个月里常来常往。', startFrame: 165, endFrame: 374 },
      { text: '客人那边，卡上写着"间隔十四天可用一次"，他自己算得清下次哪天来。', startFrame: 377, endFrame: 534 },
    ],
  },
  {
    type: 'fields', ui: 'g09-make', layoutKind: 'form', dur: 15.4, voiceOffset: 0.27, voiceDur: 14.31,
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
    subtitles: [
      { text: '次卡跟优惠券不一样，不能公开领——只能一对一，私密发给办了这张卡的人。', startFrame: 8, endFrame: 170 },
      { text: '生成一个领取码，超时时间给宽一点，别把人家挡在外面。', startFrame: 173, endFrame: 296 },
      { text: '发放备注记上"张姐、金毛、洗护五次"，是谁的哪只宠物，一目了然。', startFrame: 299, endFrame: 437 },
    ],
  },
  {
    type: 'advance', ui: 'g09-result', layoutKind: 'hero-object', dur: 13.8, voiceOffset: 0.27, voiceDur: 12.67,
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
    subtitles: [
      { text: '客人那边，打开卡包，还剩几次清清楚楚。', startFrame: 8, endFrame: 112 },
      { text: '你这边，核销记录一页排开——第几次、哪天来的，节奏看得见。', startFrame: 115, endFrame: 265 },
      { text: '用到最后一次，还会提他一句，正好续下一张。', startFrame: 268, endFrame: 388 },
    ],
  },
  {
    type: 'cta', ui: 'g09-cta', layoutKind: 'hero-focus', dur: 7.5, voiceOffset: 0.27, voiceDur: 6.3,
    payload: {
      line: '把洗完这一次，变成接下来五次',
      times: 5,
      brand: '券到卡包',
      sub: '实体店的电子券工具',
    },
    subtitles: [
      { text: '次数看得见，节奏锁得住——不用你记，卡替他记。', startFrame: 8, endFrame: 115 },
      { text: '把洗完这一次，变成接下来五次。', startFrame: 118, endFrame: 197 },
    ],
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
  hasAudio: true,
};
