// G05 社区少儿美术班 · 券包让家长自己挑 + 沉睡老学员唤醒（2026-08-28 v2 · 阶段一画面验证，无声版）
// 玩法：P-11 券包自选降门槛（主）+ P-09 沉睡老客唤醒（辅）
// 视觉语言：「画室作品墙 / 蜡笔与纸张」——九屏全部走 videos/g05/ 本片专属渲染器（pipeline §2.1.0）
//   v1 有 6/9 屏复刻已产出视频，被用户否决；v2 除 S9 品牌收尾（CTA 屏例外，已登记 similarityExemptions）外全部新建
// 风格五维：deep-blue + bouncy + clean + zoom + story ｜ 背景 BG-ABS-002 浅底 → 全片 darkText: true
// dur 按口播实测字数（588 字）ceil01(字数÷6) + extraHold；绝对帧已扣 TransitionSeries 每屏 12 帧重叠
// 字幕 = 口播全文按语义断句（每行 10-20 字），无声版按字数占比占位，有声版按 TTS 实测精修
import type { VideoData } from '../types';

export const g05: VideoData = {
  id: 'G05-KidsArt-SelfPick',
  hasAudio: false,
  style: {
    palette: 'deep-blue',
    motion: 'bouncy',
    typography: 'clean',
    transition: 'zoom',
    hookStyle: 'story',
    bgImage: 'backgrounds/g05/bg.png',
    bgBlur: 0,
  },
  scenes: [
    // ── S1 钩子 · 速写纸 + 大字主标 ──
    {
      type: 'hook',
      ui: 'g05-scene-card',
      darkText: true,
      dur: 8.4,
      voiceOffset: 0,
      payload: {
        tag: '九月 · 放学后的校门口',
        title: '家长摆摆手就走了',
        sub: '不是课不好，是这种推法很容易被拒绝',
      },
      subtitles: [
        { text: '九月的校门口，', startFrame: 0, endFrame: 30 },
        { text: '你手里拿着体验课的单子，', startFrame: 30, endFrame: 86 },
        { text: '家长笑着摆摆手就走了。', startFrame: 86, endFrame: 136 },
        { text: '不是课不好，', startFrame: 136, endFrame: 161 },
        { text: '是陌生推销这种形式，', startFrame: 161, endFrame: 207 },
        { text: '在今天很容易被拒绝。', startFrame: 207, endFrame: 252 },
      ],
    },

    // ── S2 痛点 · 便签墙（两层：现象 + 后果小字）──
    {
      type: 'pain',
      ui: 'g05-note-wall',
      darkText: true,
      dur: 11.5,
      voiceOffset: 0,
      payload: {
        notes: [
          { text: '单子发了不少，问的人没几个', paper: 'yellow', fasten: 'pin' },
          { text: '体验课约好了，一句有事就爽约', sub: '老师的时间一直耗在等人上', paper: 'blue', fasten: 'pin' },
          { text: '课包卖出去，孩子两周不来', sub: '课时耗不动，续费也就没了下文', paper: 'cream', fasten: 'clip' },
        ],
        conclusion: '问题不在优惠，在推法',
      },
      subtitles: [
        { text: '美术班老板最头疼的，', startFrame: 0, endFrame: 45 },
        { text: '通常是三件事。', startFrame: 45, endFrame: 75 },
        { text: '单子发了不少，', startFrame: 75, endFrame: 105 },
        { text: '回来问的人没几个；', startFrame: 105, endFrame: 145 },
        { text: '体验课约好了，', startFrame: 145, endFrame: 175 },
        { text: '家长一句有事就爽约；', startFrame: 175, endFrame: 220 },
        { text: '课包卖出去了，', startFrame: 220, endFrame: 250 },
        { text: '孩子两周不来，', startFrame: 250, endFrame: 280 },
        { text: '课时耗不动，', startFrame: 280, endFrame: 305 },
        { text: '续费也就没了下文。', startFrame: 305, endFrame: 345 },
      ],
    },

    // ── S3 核心思路 · 分叉路径（上支纸团 / 下支券卡为焦点）──
    {
      type: 'solution',
      ui: 'g05-fork-path',
      darkText: true,
      dur: 9.2,
      voiceOffset: 0,
      payload: {
        left: { label: '塞课包', note: '一口气给几张，家长反而不领' },
        right: { label: '自己挑', note: '三张选一张，只担一种的成本' },
      },
      subtitles: [
        { text: '换个思路。', startFrame: 0, endFrame: 20 },
        { text: '别把课塞给家长，', startFrame: 20, endFrame: 55 },
        { text: '让家长自己挑。', startFrame: 55, endFrame: 85 },
        { text: '三张券装进一个券包，', startFrame: 85, endFrame: 130 },
        { text: '领取方式设成自选一种，', startFrame: 130, endFrame: 181 },
        { text: '家长挑自己想要的那张，', startFrame: 181, endFrame: 231 },
        { text: '你只承担一种的成本。', startFrame: 231, endFrame: 276 },
      ],
    },

    // ── S4 具体步骤 · 画架三步（合规锚点屏：红色贴纸承载「不支持公开扫码领取」）──
    {
      type: 'flow',
      ui: 'g05-easel-steps',
      darkText: true,
      dur: 16.0,
      voiceOffset: 0,
      payload: {
        steps: [
          { no: '1', title: '选三张互补的券', detail: '体验课兑换券 / 报名满减券 / 画材折扣券' },
          { no: '2', title: '做成券包', detail: '领取方式：自选一种｜每人限领 1 个' },
          { no: '3', title: '私密发放', detail: '台卡加好友自动发券｜老师一对一私发' },
        ],
        sticker: '券包不支持公开扫码领取',
      },
      subtitles: [
        { text: '具体三步。', startFrame: 0, endFrame: 20 },
        { text: '第一步，选三张互补的券：', startFrame: 20, endFrame: 70 },
        { text: '一张体验课兑换券、', startFrame: 70, endFrame: 110 },
        { text: '一张报名能用的满减券、', startFrame: 110, endFrame: 160 },
        { text: '一张画材折扣券。', startFrame: 160, endFrame: 195 },
        { text: '第二步，做成券包，', startFrame: 195, endFrame: 230 },
        { text: '领取方式选自选一种，', startFrame: 230, endFrame: 275 },
        { text: '每人限领一个。', startFrame: 275, endFrame: 305 },
        { text: '第三步，券包只能私密发，', startFrame: 305, endFrame: 355 },
        { text: '台卡上写清楚，', startFrame: 355, endFrame: 385 },
        { text: '家长扫了加老师好友，', startFrame: 385, endFrame: 430 },
        { text: '券包自动发到他手机上。', startFrame: 430, endFrame: 480 },
      ],
    },

    // ── S5 干货字段 · 表单纸（画面展示 ≠ 口播，四条参数留画面供截图）──
    {
      type: 'usetips',
      ui: 'g05-form-sheet',
      darkText: true,
      dur: 14.7,
      voiceOffset: 0,
      payload: {
        rows: [
          { label: '券名称', value: '不超过 18 个字', sticker: '字段', note: '家长一眼看懂' },
          { label: '有效期', value: '领取当日起 30 天', note: '跨过整个报名季' },
          { label: '库存', value: '300 个（示例）', note: '按班容量改' },
          { label: '使用须知', value: '体验课需提前与老师约时间', sticker: '须知', mark: true, note: '只写文字说明' },
          { label: '报名抵扣', value: '满减券线下报名时抵扣', note: '不涉及在线收款' },
        ],
      },
      subtitles: [
        { text: '几个细节别漏。', startFrame: 0, endFrame: 30 },
        { text: '券名称十八个字以内，', startFrame: 30, endFrame: 75 },
        { text: '库存按三百个设，', startFrame: 75, endFrame: 110 },
        { text: '有效期选领取后三十天，', startFrame: 110, endFrame: 160 },
        { text: '正好跨过整个报名季。', startFrame: 160, endFrame: 205 },
        { text: '使用须知里写明', startFrame: 205, endFrame: 241 },
        { text: '体验课要先跟老师约时间，', startFrame: 241, endFrame: 296 },
        { text: '满减券报名时线下抵扣。', startFrame: 296, endFrame: 346 },
        { text: '这些只是文字说明，', startFrame: 346, endFrame: 386 },
        { text: '家长看完知道怎么用就行。', startFrame: 386, endFrame: 441 },
      ],
    },

    // ── S6 券包 · 三券并排自选（中间那张 = 被选中）──
    {
      type: 'cardface',
      ui: 'g05-bundle-faces',
      darkText: true,
      dur: 9.5,
      voiceOffset: 0,
      payload: {
        bundleName: '秋季新生美术礼包',
        claimNote: '自选一种 · 每人限领 1 个',
        tickets: [
          { band: 'red', name: '体验课兑换券', value: '1 节 45 分钟', valid: '有效期 30 天' },
          { band: 'yellow', name: '报名满减券', value: '满 800 减 80', valid: '有效期 30 天' },
          { band: 'blue', name: '画材折扣券', value: '画材 9 折', valid: '有效期 60 天' },
        ],
        chosen: 1,
        footer: '领完拆成三张独立的券，用了哪张、还剩哪张看得清',
      },
      subtitles: [
        { text: '家长打开券包，', startFrame: 0, endFrame: 30 },
        { text: '三张券摆在眼前，', startFrame: 30, endFrame: 65 },
        { text: '挑一张领，', startFrame: 65, endFrame: 85 },
        { text: '其余的不用他操心。', startFrame: 85, endFrame: 125 },
        { text: '领完之后，', startFrame: 125, endFrame: 145 },
        { text: '券会拆成一张张独立的券，', startFrame: 145, endFrame: 200 },
        { text: '用了哪张、还剩哪张，', startFrame: 200, endFrame: 240 },
        { text: '手机上看得清清楚楚。', startFrame: 240, endFrame: 285 },
      ],
    },

    // ── S7 进阶唤醒 · 名册漏斗（P-09 唯一落位屏；④ 到期提醒为焦点）──
    {
      type: 'solution',
      ui: 'g05-sieve',
      darkText: true,
      dur: 12.9,
      voiceOffset: 0,
      payload: {
        roster: { rows: 12, sticker: '60 天没来' },
        actions: [
          { no: '1', label: '筛名单', detail: '领取记录按时间筛，挑出还没来核销的' },
          { no: '2', label: '做限时券', detail: '老学员回归体验券｜有效期 15 天' },
          { no: '3', label: '一对一私发', detail: '私密发放｜一次最多 10 张' },
          { no: '4', label: '到期提醒', detail: '提前 3 天自动提醒家长', highlight: true },
        ],
      },
      subtitles: [
        { text: '再往前一步。', startFrame: 0, endFrame: 25 },
        { text: '老学员很久不来，', startFrame: 25, endFrame: 60 },
        { text: '很多不是退班，', startFrame: 60, endFrame: 90 },
        { text: '是忙忘了。', startFrame: 90, endFrame: 111 },
        { text: '从领取记录按时间', startFrame: 111, endFrame: 151 },
        { text: '筛出六十天没用券的家长，', startFrame: 151, endFrame: 206 },
        { text: '私发一张回归券，', startFrame: 206, endFrame: 241 },
        { text: '设十五天有效，', startFrame: 241, endFrame: 271 },
        { text: '到期前第三天再提醒一次。', startFrame: 271, endFrame: 327 },
        { text: '谁回来了、谁还没用，', startFrame: 327, endFrame: 367 },
        { text: '记录都在。', startFrame: 367, endFrame: 387 },
      ],
    },

    // ── S8 为什么有用 · 调色盘引线（右侧无容器；整屏无任何数字指标）──
    {
      type: 'panel',
      ui: 'g05-palette',
      darkText: true,
      dur: 14.0,
      voiceOffset: 0,
      payload: {
        wells: [
          { color: 'blue', icon: 'check', title: '三张券，各管一步', desc: '体验课先来，报名券接着用，画材券留到后面' },
          { color: 'yellow', icon: 'gift', title: '一次只核一种', desc: '家长挑一张用，另外两张留在包里' },
          { color: 'grey', icon: 'search', title: '哪张有人领，看得见', desc: '领取、核销都有记录，能按券码查' },
        ],
        footnote: '每人限领 1 个，先挑一张用',
      },
      subtitles: [
        { text: '为什么家长更容易答应？', startFrame: 0, endFrame: 53 },
        { text: '家长抵触的往往不是优惠，', startFrame: 53, endFrame: 112 },
        { text: '是被动推销和被绑定。', startFrame: 112, endFrame: 159 },
        { text: '选择权交给他，', startFrame: 159, endFrame: 191 },
        { text: '决策压力就下来了。', startFrame: 191, endFrame: 234 },
        { text: '每张券谁领了、谁核销了，', startFrame: 234, endFrame: 287 },
        { text: '后台按券分开记，', startFrame: 287, endFrame: 324 },
        { text: '下次做活动，', startFrame: 324, endFrame: 351 },
        { text: '哪张该留、哪张该换，', startFrame: 351, endFrame: 393 },
        { text: '看记录说话。', startFrame: 393, endFrame: 420 },
      ],
    },

    // ── S9 CTA · 共享 CtaScene（CTA 屏例外已登记 similarityExemptions；不诱导关注、不写导流字样）──
    {
      type: 'cta',
      darkText: true,
      dur: 4.4,
      voiceOffset: 0.5,
      title: '券到卡包',
      sub: '做券、发券、核销、看记录，一个工具',
      subtitles: [
        { text: '券到卡包，', startFrame: 0, endFrame: 31 },
        { text: '做券、发券、核销、看记录，', startFrame: 31, endFrame: 101 },
        { text: '一个工具。', startFrame: 101, endFrame: 132 },
      ],
    },
  ],
};
