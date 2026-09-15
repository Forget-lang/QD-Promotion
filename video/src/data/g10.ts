// g10 · 美容沙龙 · 老带新裂变 · 视频数据（有声版 · 6 屏 · 2026-09-11 实测回填）
// style：berry-purple + 粉晕光弧底 + slide 转场 + contrast 钩子 + bouncy 动效（整套反 g09，见 03-母题一页.md）
// 每屏 ui 必填、指向 videos/g10/index.tsx 注册组件；k: 字段名逐字回 create.vue（506/511/518）；数值为示例（画面零面包屑、零示例标）。
// 音频 = TTS（seed-tts 原速）→ loudnorm -16 LUFS → atempo 1.2，实测见 audio/g10/；dur = voiceOffset 0.27 + voiceDur + 尾读缓冲（长读/数据/CTA 0.9s、其余 0.5s）；字幕句界 = 实测时长 × 字数占比（长句按 ——/， 自然停顿拆卡，单卡 ≤2 行容量）。口播真源 = 本文件 subtitles 逐字稿（02-口播文案.md 为第 3 步过程稿）。
import type { VideoData } from '../types';

export const g10: VideoData = {
  id: 'g10',
  hasAudio: true,
  style: {
    palette: 'berry-purple',
    motion: 'bouncy',
    transition: 'slide',
    hookStyle: 'contrast',
    bgImage: 'backgrounds/g10/bg.png',
    bgBlur: 0,
  },
  scenes: [
    {
      type: 'hook',
      ui: 'g10-hook',
      layoutKind: 'hero-focus',
      dur: 12.4, // 0.27 + 11.667 + 0.5
      voiceOffset: 0.27,
      voiceDur: 11.667,
      payload: {

        titleA: '客人夸上天，',
        titleB: '不带闺蜜来？',
        titleBHi: '不带闺蜜',
        sub: '不是她不帮你，是你手里没一张能让她顺手转给闺蜜的券。',
        cardName: '闺蜜护理体验券',
        cardTag: '可转赠',
        validHint: '15 天内有效',
        buttonLabel: '转赠给好友',
      },
      subtitles: [
        { text: '开美容院的，客人做完护理把你夸上天，你说"下回带闺蜜来呀"——她笑着说好，然后，没有然后了。', startFrame: 8, endFrame: 230 },
        { text: '不是她不帮你，是你手里没一张能让她顺手转给闺蜜的券。', startFrame: 233, endFrame: 358 },
      ],
    },
    {
      type: 'idea',
      ui: 'g10-idea',
      layoutKind: 'two-column',
      dur: 20.5, // 0.27 + 19.330 + 0.9
      voiceOffset: 0.27,
      voiceDur: 19.330,
      payload: {

        title: '为什么她不开口？',
        left: { head: '群里甩来的券', lines: [
          { t: '白给的东西，谁都不稀罕', s: '领完就丢进卡包吃灰' },
          { t: '当废纸扔进卡包', s: '领完就忘，占着名额' },
          { t: '发一圈没人领', s: '越群发越掉价' },
          { t: '像在推销', s: '老客反而不想转' },
        ] },
        right: { head: '亲手转赠', lines: [
          { t: '她送的是人情', s: '亲手递出去的才有分量' },
          { t: '闺蜜觉得占了便宜', s: '熟人体验，两头体面' },
          { t: '带人还有奖励券', s: '闺蜜核销后自动到账' },
          { t: '下次还愿意开口', s: '有来有往才长久' },
        ] },
        leftVerdict: '结果：没有第二次',
        rightVerdict: '结果：两头都体面',
        bottom: '给她一个带人、自己也划算的理由。',
      },
      subtitles: [
        { text: '你想想自己：群里甩过来的券，你领过几张？领完又用过几张？白给的东西，谁都不稀罕。', startFrame: 8, endFrame: 211 },
        { text: '可要是你闺蜜亲手把一张券发到你手机上，说"这家我做过、不错，你拿去试试"——你去不去？', startFrame: 214, endFrame: 395 },
        { text: '等你真去了、扫了码，她那边自动就多一张券——一来一回，她得了好处，你得了生意。', startFrame: 398, endFrame: 588 },
      ],
    },
    {
      type: 'fields',
      ui: 'g10-make-basic',
      layoutKind: 'hero-object',
      dur: 21.7, // 0.27 + 20.501 + 0.9
      voiceOffset: 0.27,
      voiceDur: 20.501,
      payload: {

        couponType: '兑换券',
        ribbon: '护理体验 · 邀请卡',
        cardName: '闺蜜护理体验券',
        fields: [
          { k: '兑换内容', v: '深层清洁护理', hero: true },
          { k: '发放方式', v: '私密发放' },
          { k: '每人限领总量', v: '1 张' },
          { k: '有效期', v: '15 天' },
        ],
        noticeK: '使用须知',
        noticeLines: ['· 深层清洁 + 肩颈放松', '· 约 60 分钟 · 需提前预约', '· 每位闺蜜首享一次'],
        notes: [
          { t: '兑换内容 · 只有 10 个字', b: '装不下服务明细，明细写进使用须知，这是兑换券最容易讲错的一条。', hi: '明细写进使用须知' },
          { t: '发放方式 · 先发给老客', b: '私密发放一对一给到老客，她才能转赠给闺蜜；此项创建后改不了。', hi: '她才能转赠给闺蜜' },
          { t: '有效期 · 给个期限', b: '设 15 天，逼老客及时转赠、闺蜜及时到店，券不睡死。', hi: '券不睡死' },
        ],
        caution: '这套玩法天生要两张券：这张体验券当转赠物，还得另做一张私密券当奖励。',
      },
      subtitles: [
        { text: '在券到卡包里，先做这张体验券：券种选兑换券，兑换内容写"深层清洁护理"——', startFrame: 8, endFrame: 190 },
        { text: '记住这里只有十个字，服务明细全写进使用须知。', startFrame: 193, endFrame: 298 },
        { text: '发放方式一定选"私密发放"，一对一发给真愿意开口的老客；别全店刷屏，老客反而不好意思转。', startFrame: 301, endFrame: 510 },
        { text: '有效期给十五天，够她约个周末，也逼她别一直拖。', startFrame: 513, endFrame: 623 },
      ],
    },
    {
      type: 'fields',
      ui: 'g10-make-gift',
      layoutKind: 'mechanism-diagram',
      dur: 22.0, // 0.27 + 20.839 + 0.9
      voiceOffset: 0.27,
      voiceDur: 20.839,
      payload: {

        title: '再打开转赠和奖励',
        rows: [
          { k: '允许转赠', switchOn: true },
          { k: '开启转赠奖励', switchOn: true },
          { k: '转赠奖励券', v: '私密券', note: '仅可选择「私密发放」类型的有效优惠券' },
        ],
        mechTitle: '转赠链路',
        mechNodes: [
          { t: '体验券', s: '老客先领到' },
          { t: '闺蜜', s: '领进卡包' },
          { t: '奖励券', s: '老客卡包多一张', hi: true },
        ],
        mechArrows: ['转赠', '核销'],
        timingNote: '闺蜜核销后 · 自动到账',
      },
      subtitles: [
        { text: '真正的杀招在这。打开"允许转赠"，再打开"开启转赠奖励"，系统会问你奖励哪张券——', startFrame: 8, endFrame: 204 },
        { text: '所以提前另外做一张私密券，专门当奖品。', startFrame: 207, endFrame: 294 },
        { text: '记死一个关键：这张奖励券，不是一转出去就到账，是闺蜜到店扫码核销之后，才自动进老客的卡包。', startFrame: 297, endFrame: 509 },
        { text: '她带人，落着实打实的好处；你锁客，赚着实打实的回头。', startFrame: 512, endFrame: 633 },
      ],
    },
    {
      type: 'advance',
      ui: 'g10-flow',
      layoutKind: 'flow',
      dur: 10.1, // 0.27 + 9.344 + 0.5
      voiceOffset: 0.27,
      voiceDur: 9.344,
      payload: {

        title: '串起来就一条线',
        nodes: [
          { t1: '老客', t2: '领到券', note: '一对一发到手' },
          { t1: '转赠', t2: '给好友', note: '亲手转给闺蜜' },
          { t1: '闺蜜', t2: '领进卡包', note: '先到先得一张' },
          { t1: '到店', t2: '核销', note: '扫码开始护理' },
          { t1: '奖励券', t2: '自动到账', note: '你不用追客', hi: true },
        ],
      },
      subtitles: [
        { text: '串起来就一条线：老客领券、点"转赠给好友"，闺蜜领进卡包、到店核销，老客自动收一张奖励券——', startFrame: 8, endFrame: 230 },
        { text: '全程你不用追任何一个人。', startFrame: 233, endFrame: 288 },
      ],
    },
    {
      type: 'cta',
      ui: 'g10-cta',
      layoutKind: 'cta-statement',
      dur: 7.0, // 0.27 + 5.839 + 0.9
      voiceOffset: 0.27,
      voiceDur: 5.839,
      payload: {

        lines: [
          { text: '老带新' },
          { text: '不是求她帮忙' },
          { text: '是给她一个' },
          { text: '带人也划算的台阶', hi: '划算' },
        ],
        cardRibbon: '护理体验 · 邀请卡',
        cardName: '闺蜜护理体验券',
        cardTag: '可转赠',
        validHint: '15 天内有效',
      },
      subtitles: [
        { text: '老带新，从来不是求老客帮忙，', startFrame: 8, endFrame: 82 },
        { text: '是给她一个——带人、自己也划算的台阶。', startFrame: 85, endFrame: 183 },
      ],
    },
  ],
};
