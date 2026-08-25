// G04 美容院 · 疗程后送卡锁客 + 闺蜜转赠裂变（2026-08-25 无声版）
// 玩法：P-01 送卡锁客（主）+ P-02 闺蜜裂变（辅）
// 风格五维：berry-purple + snappy + friendly + slide + contrast（与 G03 基线 5/5 不同）
// 场景序列：hook → pain → cardface → bracket-group → grid(多层分区) → transfer → panel → cta
// 2026-08-25 改：S1 手写高亮 / S2 编号列表 / S3 cardface 深色卡面 / S4 括号分组 / S5 多层分区（R3 §5.6 呈现手法，去卡片流）
// 背景图：BG-ABS-003 粉雾网格渐变底（浅底 → 全片 darkText: true，blur=0）
//
// 字幕 = 口播全文（01 文档⑤，598 字，语义断句每行 10-20 字，E-013/E-014）；
// 无声版时间轴按行字数占比均匀分布（占位），有声版按 TTS 实测回填精修。
// dur 为设计稿预估值（时长深度结果论），最终 TTS 实测回填。
import type { VideoData } from '../types';
import { PALETTES } from '../palette';

const A = PALETTES['berry-purple'].accent;      // 粉紫主色
const A2 = PALETTES['berry-purple'].accentDark;  // 深紫（S5 同色系变化用）

export const g04: VideoData = {
  id: 'G04-Beauty-SendCard',
  hasAudio: true,
  style: {
    palette: 'berry-purple',
    motion: 'snappy',
    typography: 'friendly',
    transition: 'slide',
    hookStyle: 'contrast',
    bgImage: 'backgrounds/g04/bg.png',
    bgBlur: 0,
  },
  scenes: [
    // ── S1 钩子：卖卡 VS 送卡（contrast 型，12.2s = 366 帧）──
    {
      type: 'hook',
      darkText: true,
      dur: 11.6,
      voiceDur: 11.54,
      voiceOffset: 0,
      title: '还在推销办卡？',
      leftTitle: '卖卡',
      rightTitle: '送卡',
      sub: '很多顾客一听办卡就警惕',
      subtitles: [
        { text: '美容院还在推销办卡？', startFrame: 0, endFrame: 52 },
        { text: '很多顾客一听办卡就警惕。一提办卡，', startFrame: 52, endFrame: 142 },
        { text: '不少顾客就打退堂鼓；不推吧，', startFrame: 142, endFrame: 215 },
        { text: '店里又没收入。顾客不是讨厌卡，', startFrame: 215, endFrame: 294 },
        { text: '是怕被套住、怕跑路。', startFrame: 294, endFrame: 346 },
      ],
    },

    // ── S2 痛点：老板最头疼的三件事（12.5s = 375 帧）──
    {
      type: 'pain',
      darkText: true,
      layout: 'numbered-list',
      dur: 14.3,
      voiceDur: 14.2,
      voiceOffset: 0,
      title: '老板最头疼的三件事',
      leftTitle: '推销办卡',
      leftItems: [
        '一提办卡，不少顾客就打退堂鼓',
        '办了卡，充完钱就很少再来，卡睡死半年',
        '推销太多，顾客更警惕',
      ],
      leftItemsSub: [
        '推得越狠，顾客跑得越快',
        '钱锁住了，人却不来了',
        '越推销，越像套路',
      ],
      rightSub: '钱没锁住，口碑还受影响',
      subtitles: [
        { text: '就算办了卡，不少人充完钱就很少再来，', startFrame: 0, endFrame: 100 },
        { text: '卡睡死半年用不完，钱没锁住，', startFrame: 100, endFrame: 177 },
        { text: '口碑还受影响。老板最头疼三件事：', startFrame: 177, endFrame: 266 },
        { text: '一提办卡顾客就犯难，办了卡顾客不常来，', startFrame: 266, endFrame: 371 },
        { text: '推销太多顾客更警惕。', startFrame: 371, endFrame: 426 },
      ],
    },

    // ── S3 核心思路：别卖卡了，送（cardface 次卡磁条卡面，15.5s = 465 帧）──
    // 御紫 #3E2060 卡面（applet 9 色主题之一，美业）；次数大字是焦点，全参数贴画面（V-R09）
    {
      type: 'cardface',
      darkText: true,
      dur: 18.3,
      voiceDur: 18.21,
      voiceOffset: 0,
      title: '别卖卡了，送',
      sub: '送一张六次养护卡',
      cardName: '六次养护卡',
      cardType: '次卡',
      merchantName: '美容院',
      times: 6,
      total: 6,
      validLabel: '有效期 90 天',
      cardTheme: '#3E2060',
      cardFields: [
        { icon: 'clock', label: '核销间隔', value: '3 天' },
        { icon: 'users', label: '发放方式', value: '私密发放 · 可转赠' },
      ],
      useTips: [
        { icon: 'check', text: '到店出示：顾客出示卡，店员扫码核销' },
        { icon: 'clock', text: '间隔三天：两次到店至少隔 3 天' },
        { icon: 'gift', text: '用不完转赠：卡可转赠闺蜜，到店即新客' },
        { icon: 'users', text: '到期提醒：到期前自动提醒顾客' },
      ],
      subtitles: [
        { text: '换个思路，别卖卡了，送。做完护理，', startFrame: 0, endFrame: 94 },
        { text: '送一张六次养护卡。', startFrame: 94, endFrame: 143 },
        { text: '顾客对送的东西心理负担小，收得开心，', startFrame: 143, endFrame: 243 },
        { text: '来得自然。把卡从商品变成福利，', startFrame: 243, endFrame: 325 },
        { text: '推销味淡了，信任感就回来了。', startFrame: 325, endFrame: 403 },
        { text: '次卡按次核销，看得见用得完，', startFrame: 403, endFrame: 480 },
        { text: '顾客心里有数，不怕被套。', startFrame: 480, endFrame: 546 },
      ],
    },

    // ── S4 具体步骤：三步就送出去（bracket-group 括号分组，18.4s = 552 帧）──
    // R3 §5.6 呈现手法 ref-05：左竖排标签 + 大括号聚合 + 右字段明细，重点高亮；可截图抄作业
    {
      type: 'bracket-group',
      darkText: true,
      dur: 16.3,
      voiceDur: 16.22,
      voiceOffset: 0,
      title: '三步就送出去',
      sub: '做完项目，送卡就到手',
      bracketGroups: [
        { index: '1', label: '说送卡', detail: '话术：「今天护理做得不错，送您一张养护卡」' },
        { index: '2', label: '做养护卡', detail: '次数 6 次 | 核销间隔 3 天 | 有效期 90 天', highlight: true },
        { index: '3', label: '私密发放', detail: '一对一发到顾客手机 | 领后链接失效' },
      ],
      subtitles: [
        { text: '操作只要三步。第一步，顾客做完项目，', startFrame: 0, endFrame: 89 },
        { text: '你把送卡当福利说出口：今天护理做得不错，', startFrame: 89, endFrame: 187 },
        { text: '送您一张养护卡。第二步，', startFrame: 187, endFrame: 246 },
        { text: '手机上做一张六次养护卡，设六次、', startFrame: 246, endFrame: 325 },
        { text: '核销间隔三天、有效期九十天。第三步，', startFrame: 325, endFrame: 413 },
        { text: '私密发放，一对一发到顾客手机。', startFrame: 413, endFrame: 487 },
      ],
    },

    // ── S5 为什么有用：数字焦点卡（16.4s = 492 帧）──
    // title 放数字焦点（3 天/6 次/90 天/转赠），desc 放解释；区别于 G03 图标卖点卡
    {
      type: 'grid',
      darkText: true,
      layout: 'multi-section',
      cardVariant: 'number-focus',
      dur: 16.7,
      voiceDur: 16.69,
      voiceOffset: 0,
      title: '为什么这招好使',
      cards: [
        { icon: 'clock', color: A, title: '3 天', desc: '核销间隔 · 顾客每三天能来一次，卡不睡死' },
        { icon: 'check', color: A2, title: '6 次', desc: '一张卡九十天到店六次，每次都是增项机会' },
        { icon: 'clock', color: A, title: '90 天', desc: '有效期 · 三个月慢慢耗完' },
        { icon: 'users', color: A2, title: '转赠', desc: '用不完送闺蜜，闺蜜到店 = 新客' },
      ],
      subtitles: [
        { text: '为什么这招好使？核销间隔设三天，', startFrame: 0, endFrame: 81 },
        { text: '顾客每三天就能来一次，卡不容易睡死；', startFrame: 81, endFrame: 172 },
        { text: '一张卡九十天到店六次，', startFrame: 172, endFrame: 228 },
        { text: '每次都是加项目的机会。同样是预付锁客，', startFrame: 228, endFrame: 324 },
        { text: '充值顾客容易怕跑路，', startFrame: 324, endFrame: 374 },
        { text: '送卡顾客心理负担小——效果差不多，', startFrame: 374, endFrame: 461 },
        { text: '心理门槛低一半。', startFrame: 461, endFrame: 501 },
      ],
    },

    // ── S6 进阶：转赠闺蜜（transfer 首次启用，12.7s = 381 帧）──
    {
      type: 'transfer',
      darkText: true,
      dur: 11.2,
      voiceDur: 11.19,
      voiceOffset: 0,
      title: '用不完？转赠闺蜜',
      transferFrom: '顾客',
      transferTo: '闺蜜',
      sub: '闺蜜到店 = 你的新客',
      points: [
        '卡包点转赠，发给闺蜜',
        '闺蜜领取，到店出示核销',
        '闺蜜核销，你多了个新客',
      ],
      subtitles: [
        { text: '卡用不完也没关系，转赠给闺蜜。', startFrame: 0, endFrame: 72 },
        { text: '闺蜜拿着卡到店，就是你的新客。', startFrame: 72, endFrame: 144 },
        { text: '老带新不用求人，', startFrame: 144, endFrame: 182 },
        { text: '转赠这个动作自己就完成了。一张卡，', startFrame: 182, endFrame: 264 },
        { text: '带来一个闺蜜，闺蜜又能带闺蜜。', startFrame: 264, endFrame: 336 },
      ],
    },

    // ── S7 数据：后台看得见（不填具体数字，13.7s = 411 帧）──
    {
      type: 'panel',
      darkText: true,
      layout: 'ranking',
      dur: 12.0,
      voiceDur: 11.18,
      voiceOffset: 0,
      title: '效果好不好，数据说话',
      footnote: '领取明细、核销明细，都能导出 Excel',
      metrics: [
        { icon: 'users', color: A, title: '员工业绩', dir: '↑', desc: '谁发券多、谁核销多，排行看得见' },
        { icon: 'gift', color: A2, title: '门店对比', dir: '↑', desc: '多门店发券/核销排名，一目了然' },
        { icon: 'check', color: A, title: '渠道效果', dir: '↑', desc: '哪个渠道带来的客人最多' },
      ],
      subtitles: [
        { text: '效果好不好，数据说话。发了多少张、', startFrame: 0, endFrame: 80 },
        { text: '核销了多少张、谁转赠的、', startFrame: 80, endFrame: 137 },
        { text: '哪个渠道来的客人多，后台都看得见。', startFrame: 137, endFrame: 217 },
        { text: '不用拍脑袋猜，数据会告诉你哪一步对了，', startFrame: 217, endFrame: 307 },
        { text: '哪一步要调。', startFrame: 307, endFrame: 335 },
      ],
    },

    // ── S8 CTA：品牌收尾（自然收尾，9.7s = 291 帧）──
    {
      type: 'cta',
      darkText: true,
      dur: 10.1,
      voiceDur: 8.52,
      voiceOffset: 0.5,
      title: '券到卡包',
      sub: '把推销变成送福利的电子券工具',
      subtitles: [
        { text: '券到卡包，把推销变成送福利的电子券工具。', startFrame: 0, endFrame: 98 },
        { text: '做完项目送一张养护卡，顾客来得勤，', startFrame: 98, endFrame: 182 },
        { text: '卡不容易睡死，闺蜜还能带新客。', startFrame: 182, endFrame: 256 },
      ],
    },
  ],
};
