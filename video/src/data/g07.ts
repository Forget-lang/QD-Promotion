// g07 咖啡茶饮 · 片1 · 数据（有声版 · 2026-09-03 阶段二回填）
// 回填链：逐屏 TTS（seed-tts；speed_ratio 无效不用）→ loudnorm -16LUFS → atempo 1.2（定稿值）→ ffprobe 屏时长；
//   句界 = 实测时长 × 字数占比（g06 同法）；dur = voiceOffset + voiceDur + 尾读缓冲（长读/数据/CTA 屏 0.85~0.9s，其余 0.45~0.6s）。
//   实测各屏语速 4.9~5.9 字/秒，零超线。音频在 video/public/audio/g07/s1~s9.wav。
// 每屏 ui 带 g07- 前缀并在 videos/g07 注册；payload 形状见 videos/g07/types.ts。
// 字段名逐字回 spec/coupon-fields.json；金额/张数/天数均为示例值（屏上顶部标注，口播数字用中文）。
import type { Scene, VideoData } from '../types';

const scenes: Scene[] = [
  {
    type: 'hook', ui: 'g07-hook', dur: 8.6, voiceOffset: 0.27, voiceDur: 7.85,
    payload: {
      tag: '咖啡茶饮 · 拉新复购',
      title1: '券发出去了，',
      title2: '人怎么不回头？',
      accent: '',
      sub: '先别怪客人——问题常常出在券的那一栏，门槛',
      ticketName: '某咖啡店 · 示例',
      ticketBadge: '无门槛',
      ticketLine: '0 元领一杯',
    },
    subtitles: [
      { text: '很多咖啡店老板发完券都纳闷，人是来了，怎么不回头？', startFrame: 8, endFrame: 136 },
      { text: '先别怪客人，问题常常出在券的那一栏，门槛。', startFrame: 138, endFrame: 244 },
    ],
  },
  {
    type: 'pain', ui: 'g07-pain', dur: 8.2, voiceOffset: 0.27, voiceDur: 7.52,
    payload: {
      tag: '无门槛的坑',
      title1: '无门槛白送，',
      title2: '招来只占便宜的',
      accent: '像在请客',
      ticketName: '某咖啡店 · 示例',
      ticketBadge: '无门槛',
      ticketTitle: '0 元领一杯',
      ticketLines: ['消费门槛：0 元', '长期有效 · 随时可领', '客人：喝完就走'],
      quotes: [
        { t1: '来的人不少', t2: '客单没提上去' },
        { t1: '发得越多', t2: '越像在请客' },
      ],
    },
    subtitles: [
      { text: '无门槛的券，谁都想白拿一杯，喝完就走，你一分钱客单没提。', startFrame: 8, endFrame: 136 },
      { text: '这种券发得越多，越像在请客，不像在做生意。', startFrame: 138, endFrame: 234 },
    ],
  },
  {
    type: 'fields', ui: 'g07-make-basic', dur: 19.7, voiceOffset: 0.27, voiceDur: 18.54,
    payload: {
      tag: '示例',
      navTitle: '制作满减券',
      couponType: '满减券',
      crumb: '券到卡包 · 拉新复购 · 数值为示例',
      groups: [
        {
          head: '① 券面',
          rows: [
            { k: '优惠券名称', v: '到店咖啡券', hint: '最多 18 字 · 场景直接写进名字' },
            { k: '消费门槛', v: '满 35 元可用', hero: true, tag: '分水岭', hint: '0 为无门槛' },
            { k: '优惠金额', v: '8 元', hint: '满 35 才能用，省 8 元' },
            { k: '制作数量', v: '200 张', hint: '库存 1~10000' },
          ],
        },
        {
          head: '② 期限',
          rows: [
            { k: '有效期类型', v: '自领取日起 N 天内有效' },
            { k: '有效期', v: '7 天', hint: '最少 1 天，最多 365 天' },
          ],
        },
      ],
      callout: {
        l1: '门槛填 0 = 白送引流，招来只占便宜的',
        l2: '门槛设成 35 元（≈客单价）= 来了就得消费一次',
        tag: '这一栏，就是「拉新还是提客单」的分水岭',
      },
    },
    subtitles: [
      { text: '我们重做一张券，从券面这一栏开始设。', startFrame: 8, endFrame: 105 },
      { text: '券名直接写清场景，比如到店咖啡券。', startFrame: 107, endFrame: 198 },
      { text: '关键在门槛这一栏，别填零，填零就是白送。', startFrame: 200, endFrame: 303 },
      { text: '门槛设成客单价满三十五，优惠金额减八块，数量先做两百张。', startFrame: 305, endFrame: 457 },
      { text: '有效期选领后七天，客人领了就得尽快来。', startFrame: 459, endFrame: 564 },
    ],
  },
  {
    type: 'mechanism', ui: 'g07-mech', dur: 13.8, voiceOffset: 0.27, voiceDur: 13,
    payload: {
      tag: '门槛对比',
      title1: '同样发券，',
      title2: '门槛不同',
      accent: '',
      sub: '门槛填法不一样，来的人完全不一样',
      leftHead: '门槛填 0',
      leftItems: ['人人来白拿', '你贴钱', '客单没提'],
      leftNote: '招来只占便宜的',
      rightHead: '满 35 才能用',
      rightItems: ['来的都要消费', '减 8 块换一单', '客单提上去'],
      rightNote: '减 8 块，换一单生意',
      punch: '这一栏，就是拉新还是提客单的分水岭',
    },
    subtitles: [
      { text: '同样发券，门槛填法不一样，来的人完全不一样。', startFrame: 8, endFrame: 112 },
      { text: '左边无门槛，人人来白拿，你贴钱。', startFrame: 114, endFrame: 185 },
      { text: '右边满三十五，来的都是要消费的，减八块换一单生意。', startFrame: 187, endFrame: 307 },
      { text: '这一栏，就是拉新还是提客单的分水岭。', startFrame: 309, endFrame: 398 },
    ],
  },
  {
    type: 'fields', ui: 'g07-issue', dur: 9.8, voiceOffset: 0.27, voiceDur: 9.02,
    payload: {
      tag: '发放方式',
      title: '怎么发出去？',
      sub: '这张要拉新，选公开领取',
      pickHead: '公开领取',
      pickDesc: '看到的人都能领',
      pickPoints: ['谁看到都能领', '存成海报贴门口', '路人顺手就领'],
      otherHead: '私密发放',
      otherDesc: '只发给指定的人，另一套玩法',
      result: '公开领取：把券存成海报贴门口，谁看到都能领',
    },
    subtitles: [
      { text: '这张要拉新，发放方式选公开领取，谁看到都能领。', startFrame: 8, endFrame: 117 },
      { text: '存成海报贴门口，路人顺手就领了；只发给指定人是另一套，今天先不碰。', startFrame: 119, endFrame: 279 },
    ],
  },
  {
    type: 'advance', ui: 'g07-chain', dur: 12.4, voiceOffset: 0.27, voiceDur: 11.22,
    payload: {
      tag: '复购开关',
      title: '用一张，再得一张',
      sub: '把一次客变成回头客',
      nodes: [
        { head: '开启核销后赠券', desc: '在核销限制里打开这颗开关', note: '核销后立奖本券一张' },
        { head: '客人这次用掉券', desc: '到店核销成功', note: '顾客侧显示：核销奖励 · 到店核销后可再得本券一张', reward: true },
        { head: '自动再得一张', desc: '系统马上再给一张同款，直接到账', note: '他多半就会再来一趟' },
      ],
    },
    subtitles: [
      { text: '最后开一个开关，把一次客变成回头客，核销后赠券。', startFrame: 8, endFrame: 117 },
      { text: '打开它，客人这次把券用掉，系统马上再给他一张一样的，直接到账。', startFrame: 119, endFrame: 259 },
      { text: '他为了用掉第二张，多半就会再来一趟。', startFrame: 261, endFrame: 345 },
    ],
  },
  {
    type: 'steps', ui: 'g07-steps', dur: 15.1, voiceOffset: 0.27, voiceDur: 14.19,
    payload: {
      tag: '各方看到什么',
      title: '发出去之后',
      sub: '顾客那边、你核销那一下',
      rows: [
        { act: '顾客领到', desc: '一张满 35 才能用的券', res: '用完又自动多一张', mark: '顾客侧' },
        { act: '你核销时', desc: '扫他的码一验', res: '能不能用、是不是别人转来的，都写得清清楚楚', mark: '核销页' },
        { act: '到期前', desc: '券快过期那天', res: '给他发一条提醒，再跑一趟', mark: '提醒' },
      ],
    },
    subtitles: [
      { text: '发出去之后，客人看到的是，一张满三十五才能用的券，用完又自动多一张。', startFrame: 8, endFrame: 166 },
      { text: '你核销时扫他的码一验，这张能不能用、是不是别人转来的，页面上写得清清楚楚。', startFrame: 168, endFrame: 342 },
      { text: '到期前再给他发一条提醒，让他再跑一趟。', startFrame: 344, endFrame: 434 },
    ],
  },
  {
    type: 'mechanism', ui: 'g07-ledger', dur: 11.2, voiceOffset: 0.27, voiceDur: 10,
    payload: {
      tag: '商家后台',
      title: '发得怎么样，两个数',
      sub: '不用猜，后台摆在那',
      cols: [
        { head: '发券业绩', tone: 'accent', items: ['有效发放张数', '核销率', '有效发放且核销张数'] },
        { head: '核销业绩', tone: 'brown', items: ['本店核销张数', '按门店 / 员工看', '可导出记录'] },
      ],
      punch: '发出去有没有人来，看核销率就知道',
    },
    subtitles: [
      { text: '在后台不用猜，发出去多少张、有人真来核销没有，两个数就摆在那。', startFrame: 8, endFrame: 144 },
      { text: '有效发放张数配着核销率看有没有人来，本店核销张数看这一阵来了多少单。', startFrame: 146, endFrame: 308 },
    ],
  },
  {
    type: 'cta', ui: 'g07-cta', dur: 9.8, voiceOffset: 0.27, voiceDur: 8.67,
    payload: {
      title1: '一张券，',
      title2: '拉新又复购',
      strips: [
        { name: '门槛设对', role: '提客单' },
        { name: '公开发出去', role: '拉新' },
        { name: '限期领了就来', role: '促到店' },
        { name: '用完再送一张', role: '带回头' },
      ],
      brand: '券到卡包',
      sub: '实体店的电子券工具',
    },
    subtitles: [
      { text: '门槛设对、公开发出去、限期领了就来、用完再送一张，拉新和复购一张券办齐。', startFrame: 8, endFrame: 190 },
      { text: '券到卡包，实体店的电子券工具。', startFrame: 192, endFrame: 268 },
    ],
  },
];

export const g07: VideoData = {
  id: 'g07',
  style: {
    palette: 'caramel',
    motion: 'buttery',
    transition: 'dissolve',
    hookStyle: 'question',
  },
  scenes,
  hasAudio: true,
};
