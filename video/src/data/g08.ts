// g08 火锅 · 片1 · 数据（有声版 · 8 屏 · 2026-09-07 实测回填）
// S1 钩子 → S2 痛点 → S3 制券·中秋券 → S4 到期提醒 → S5 发出去 → S6 接力券 → S7 结果 → S8 收尾
// 背景 = bgImage 朱红海浪纹（BG-GEO-002），由 VTemplate 垫底；屏组件透明叠内容。
// 字段名/组标题键用 k / v / head（对齐 check-ui-truth）；只在含面额字段的制券屏声明 couponType。
// 音频 = TTS（seed-tts 原速）→ loudnorm -16 LUFS → atempo 1.2，实测见 audio/g08/；dur = voiceOffset 0.27 + voiceDur + 尾读缓冲（长读/数据/CTA 0.85~0.9s、其余 0.5s）；字幕句界 = 实测时长 × 字数占比（g06/g07 同法）。口播真源 = 本文件 subtitles 逐字稿（02-口播文案.md 为第 3 步过程稿；品牌句只上屏不口播，分镜精切口径）。
import type { Scene, VideoData } from '../types';

const scenes: Scene[] = [
  {
    type: 'hook', ui: 'g08-hook', layoutKind: 'card-list', dur: 7.8, voiceOffset: 0.27, voiceDur: 7.0,
    payload: {
      badge: '示例',
      title: '假期一过，店里就空',
      sub: '会做生意的老板，赶的是一张带到期日的券',
      couponName: '中秋家宴券',
      validityType: '固定有效期',
      expireDate: '10 月 7 日',
      highlight: '过期自动作废 = 紧迫感',
    },
    subtitles: [
      { text: '火锅店老板最怕假期结束', startFrame: 8, endFrame: 72 },
      { text: '七天天天满座，一过完就空', startFrame: 75, endFrame: 139 },
      { text: '会做生意的，赶的是带到期日的券', startFrame: 142, endFrame: 222 },
    ],
  },
  {
    type: 'pain', ui: 'g08-pain', layoutKind: 'compare-list', dur: 9.8, voiceOffset: 0.27, voiceDur: 8.98,
    payload: {
      title: '为什么临时打折留不住人',
      sub: '三种常见做法，节后全归零',
      items: [
        { act: '临时打折', fail: '当天见效，节一过没人记得' },
        { act: '印海报发出去', fail: '看一眼就划走，留不下凭证' },
        { act: '节日当天才做券', fail: '顾客来不及领，白忙一场' },
      ],
    },
    subtitles: [
      { text: '临时折扣当天见效，节一过就没人记得', startFrame: 8, endFrame: 104 },
      { text: '海报看一眼就划走，留不下任何凭证', startFrame: 107, endFrame: 192 },
      { text: '等当天才现做券，顾客根本来不及领', startFrame: 195, endFrame: 280 },
    ],
  },
  {
    type: 'fields', ui: 'g08-make', layoutKind: 'card-list', dur: 9.5, voiceOffset: 0.27, voiceDur: 8.35,
    payload: {
      couponType: '满减券',
      badge: '示例',
      title: '制作中秋家宴券',
      sub: '节前七天备好的档期券',
      icon: 'gift',
      groups: [
        {
          head: '① 券面',
          rows: [
            { k: '优惠券名称', v: '中秋家宴券' },
            { k: '消费门槛', v: '满 150 元可用' },
            { k: '优惠金额', v: '减 30 元' },
            { k: '制作数量', v: '200 张' },
          ],
        },
        {
          head: '② 期限',
          rows: [
            { k: '有效期类型', v: '固定有效期', hero: true, tag: '节日专属' },
            { k: '有效开始时间', v: '9 月 25 日', indent: true },
            { k: '有效结束时间', v: '10 月 7 日', indent: true },
          ],
        },
        {
          head: '③ 领取上限',
          rows: [
            { k: '每人限领总量', v: '1 张' },
          ],
        },
      ],
    },
    subtitles: [
      { text: '节前七天，把中秋的券先做出来', startFrame: 8, endFrame: 87 },
      { text: '有效期选固定，锁在中秋到假期结束', startFrame: 90, endFrame: 180 },
      { text: '每人限领一张，更多客人能领到', startFrame: 183, endFrame: 262 },
    ],
  },
  {
    type: 'fields', ui: 'g08-make', layoutKind: 'card-list', dur: 6.8, voiceOffset: 0.27, voiceDur: 5.98,
    payload: {
      title: '中秋券 · 到期提醒',
      sub: '提前三天提醒，掐着日子来',
      icon: 'clock',
      groups: [
        {
          head: '① 到期提醒',
          rows: [
            { k: '到期提醒', v: '开', hero: true },
            { k: '提前提醒', v: '提前 3 天', indent: true },
          ],
        },
      ],
    },
    subtitles: [
      { text: '再把到期提醒打开，提前提醒选三天', startFrame: 8, endFrame: 97 },
      { text: '吃火锅要订位，当天才说来不及安排', startFrame: 100, endFrame: 189 },
    ],
  },
  {
    type: 'fields', ui: 'g08-make', layoutKind: 'card-list', dur: 6, voiceOffset: 0.27, voiceDur: 5.2,
    payload: {
      title: '节前把它发出去',
      sub: '生成活动海报贴门口，客人扫码即领',
      groups: [
        {
          head: '① 发放方式',
          rows: [
            { k: '发放方式', v: '公开领取', hero: true },
          ],
        },
        {
          head: '② 领取时间',
          rows: [
            { k: '领取开始时间', v: '9 月 18 日' },
            { k: '领取结束时间', v: '10 月 7 日' },
          ],
        },
      ],
    },
    subtitles: [
      { text: '发放方式选公开领取', startFrame: 8, endFrame: 61 },
      { text: '领取开始时间设节前，提前几天就能抢', startFrame: 64, endFrame: 165 },
    ],
  },
  {
    type: 'fields', ui: 'g08-make', layoutKind: 'card-list', dur: 10.3, voiceOffset: 0.27, voiceDur: 9.17,
    payload: {
      couponType: '满减券',
      badge: '示例',
      title: '节后回店券',
      sub: '和中秋券贴进同一张活动海报',
      icon: 'gift',
      groups: [
        {
          head: '① 券面',
          rows: [
            { k: '优惠券名称', v: '节后回店券' },
            { k: '消费门槛', v: '满 100 元可用' },
            { k: '优惠金额', v: '减 20 元' },
          ],
        },
        {
          head: '② 期限',
          rows: [
            { k: '有效期类型', v: '自领取次日起N天内有效', hero: true, tag: '隔天生效' },
            { k: '有效期', v: '7 天', indent: true },
          ],
        },
      ],
    },
    subtitles: [
      { text: '节后那张回店券，节前也备好', startFrame: 8, endFrame: 80 },
      { text: '有效期选次日起：当天用不了，隔天才能用', startFrame: 83, endFrame: 189 },
      { text: '就这一字之差，节末高峰被匀到了平时', startFrame: 192, endFrame: 286 },
    ],
  },
  {
    type: 'advance', ui: 'g08-result', layoutKind: 'two-column', dur: 8.3, voiceOffset: 0.27, voiceDur: 7.19,
    payload: {
      title: '做完，两边各看到什么',
      sub: '节前做的券，节后还在替你留客',
      sides: [
        { who: '顾客那边', icon: 'gift', items: ['券在卡包里，到期前收到提醒', '节后又多了一张回店券', '到店出示卡包里的券就能用'] },
        { who: '你这边', icon: 'check', items: ['后台核销数、核销率摆在那', '这个节日做没做对，两个数看清', '领取、核销明细都能导出'] },
      ],
    },
    subtitles: [
      { text: '客人那边：券在卡包里，到期前收到提醒', startFrame: 8, endFrame: 112 },
      { text: '你这边：后台核销数、核销率，两个数看清', startFrame: 115, endFrame: 225 },
    ],
  },
  {
    type: 'cta', ui: 'g08-cta', layoutKind: 'cta-statement', dur: 6.9, voiceOffset: 0.27, voiceDur: 5.67,
    payload: {
      line: '节日的客人，就留住了',
      brand: '券到卡包',
      sub: '实体店的电子券工具',
    },
    subtitles: [
      { text: '固定有效期锁档期、提前三天提醒', startFrame: 8, endFrame: 87 },
      { text: '次日起的接力券——节日的客人就留住了', startFrame: 90, endFrame: 179 },
    ],
  },
];

export const g08: VideoData = {
  id: 'g08',
  style: {
    palette: 'warm-orange',
    motion: 'snappy',
    transition: 'reveal',
    hookStyle: 'story',
    bgImage: 'backgrounds/g08/bg.png',
    bgBlur: 0,
  },
  scenes,
  hasAudio: true,
};
