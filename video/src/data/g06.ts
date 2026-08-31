// g06 教培托管 · 片 1 ·「一套攻略三招」
// 分镜稿见 outputs/g06-教培托管/07-片1-分镜稿.md；payload 形状见 ../videos/g06/types.ts。
// 【判定单位 · 2026-08-30 用户拍板】一条视频 = 一个痛点 + 解决它的一套完整攻略，叙述线有头有尾。
//   本片三招：兑换券做体验引流 → 满减券只发给谈过的几家（走「指定手机号可领取」）→ 兑换券上开转赠奖励。
// 【样式冻结 · 2026-08-30 用户验收】十副骨架的 UI 与视觉已定版，本片只换内容：屏序 / 屏上信息 / 口播。渲染器与视觉不动，
//   因此每屏行数与口播句数严格对齐组件里既有的节拍表（make-basic 5 句、make-rules 取节拍表前 6 行＝3 组 5 句、
//   steps·chain·ledger 4 句、idea 3 句、cta 4 句）。make-rules 原排 7 行超出 1080×1920 可用高度
//   （中段两张卡是空框、提交钮最后才出），已按「讲不完就拆」压到 6 行。
// 【真值】屏上字段名与规则提示逐字取自 spec/coupon-fields.json（回 applet 源码取证，带行号）。
//   功能上不猜：表里没有的不上屏、不念。订阅消息六类见该表 messageReminders.types（2026-08-30 用户服务端口径）；
//   同日再确认：送达是支持的，**不再挂"顾客订阅过才收得到"这层保留说法**，六类都可以直接说会提醒 / 会到账通知
//   （站外生态词仍是硬禁，措辞只说"提醒""通知"，不带平台名）。转赠中可取消一项按该表 offScript 不进内容。
// 语速 ≤6 字/秒；12 屏 191.6 秒（按三招讲透倒推的实际值，不是配额）。
import type { VideoData } from '../types';

export const g06: VideoData = {
  id: 'g06',
  style: {
    palette: 'warm-orange',
    motion: 'snappy',
    transition: 'wipe',
    hookStyle: 'story',
    bgImage: 'backgrounds/g06/bg.png',
    bgBlur: 3,
  },
  hasAudio: false,
  scenes: [
    // ── S1 钩子 · 开学季校门口（样式与内容均沿用已验收版）──
    {
      type: 'hook',
      ui: 'g06-hook',
      dur: 11,
      darkText: true,
      subtitles: [
        { text: '开学那阵，托管班最忙。', startFrame: 8, endFrame: 71 },
        { text: '校门口发的传单，家长接了就走，一转身就没了下文。', startFrame: 71, endFrame: 203 },
        { text: '谁领了、来没来、有没有号码，一件都答不上。', startFrame: 203, endFrame: 316 },
      ],
      payload: {
        tag: '九月开学 · 小学校门口',
        title1: '一张传单',
        title2: '能留下什么',
        sub: '开学季 · 托管班校门口的一下午',
        bars: [
          { label: '哪几个家长领了', result: '不知道' },
          { label: '领了的孩子来没来', result: '查不到' },
          { label: '想打电话回访', result: '没号码' },
        ],
      },
    },
    // ── S2 痛点（沿用已验收版）──
    {
      type: 'pain',
      ui: 'g06-pain',
      dur: 9,
      darkText: true,
      subtitles: [
        { text: '家长答应来试一次，回家没人提，这事就搁下了。', startFrame: 8, endFrame: 133 },
        { text: '你想打电话再约，翻遍本子，一个号码都没留。', startFrame: 133, endFrame: 258 },
      ],
      payload: {
        tag: '校门口发完传单之后',
        title1: '家长说',
        title2: '来试一次',
        accent: '然后就没下文了',
        flyName: '托管半天体验 · 示例传单',
        flyBadge: '示例',
        flyTitle: '放学有人接 · 作业有人看 · 晚饭在店里吃',
        flyLines: [
          '凭这张传单，到店体验一个下午',
          '开学第一周 · 周一至周五',
        ],
        quotes: [
          { t1: '传单接了转身', t2: '塞进书包最底下' },
          { t1: '口头答应来试', t2: '到周末人没来' },
          { t1: '想打个电话回访', t2: '翻遍本子没号码' },
        ],
        foot: '口头的话落不成一件拿得出的东西 · 传单为示例 · 场景为演绎',
      },
    },
    // ── S3 攻略总览 · 三招（复用 g06-steps 骨架，3 行 4 句；替换原「思路」屏）──
    // 布局来源：ref-16 骨架不变，只把内容从"把试用写成一张券"换成这套攻略的三招全景。
    {
      type: 'steps',
      ui: 'g06-steps',
      dur: 15.0,
      darkText: true,
      subtitles: [
        { text: '这套攻略三招，一招设一张券。', startFrame: 8, endFrame: 78 },
        { text: '第一招做张兑换券，把「来试一次」写成家长拿得走的东西。', startFrame: 78, endFrame: 203 },
        { text: '第二招做张满减券，只发给你谈过的几家。', startFrame: 203, endFrame: 298 },
        { text: '第三招在兑换券上开转赠奖励，带同学的家长也得一张。', startFrame: 298, endFrame: 423 },
      ],
      payload: {
        tag: '这套攻略 · 三招',
        title: '三招设完，家长才留得住',
        sub: '一次体验，三处都设在券上',
        rows: [
          { act: '兑换券 · 先来试', desc: '「来试一次」写成一张券', res: '券在家长卡包里，写着能用到几号', mark: '第一招' },
          { act: '满减券 · 只给名单', desc: '只发给谈过的这几家', res: '名单外的家长，在这张券上领不到', mark: '第二招' },
          { act: '转赠 · 带人来', desc: '家长把券转给同学家长', res: '对方核销完，家长自动得一张奖励券', mark: '第三招' },
        ],
      },
    },
    // ── S4 制券① 兑换券 · 券面（沿用已验收的制券表单卡；分组标题改为我方序号）──
    {
      type: 'fields',
      ui: 'g06-make-basic',
      dur: 18.5,
      darkText: true,
      subtitles: [
        { text: '商户中心点制作优惠券，类型挑兑换券。', startFrame: 8, endFrame: 98 },
        { text: '优惠券名称把场景写进去，这一栏十八个字。', startFrame: 98, endFrame: 198 },
        { text: '兑换内容只有十个字，写下午托管一次。', startFrame: 198, endFrame: 288 },
        { text: '消费门槛填零元，引流就别设槛；数量先做两百张。', startFrame: 288, endFrame: 398 },
        { text: '一个下午管什么，写到使用须知里，那一栏能写五百个字。', startFrame: 398, endFrame: 523 },
      ],
      payload: {
        tag: '第一招 · 券面',
        navTitle: '制作兑换券',
        crumb: '商户中心 › 制作优惠券 › 类型：兑换券',
        groups: [
          {
            head: '① 券面',
            rows: [
              { k: '优惠券名称', v: '开学季下午托管体验', hint: '最多 18 个字 · 支持表情符号', kind: 'input' },
              { k: '兑换内容', v: '下午托管一次', hint: '例：冷饮一杯，最多 10 个字', kind: 'input' },
              { k: '消费门槛', v: '0 元', hint: '满多少元可用，0 为无门槛', kind: 'input' },
              { k: '制作数量', v: '200 张', hint: '最少 1 张，最多 1 万张', kind: 'input' },
            ],
          },
          {
            head: '② 服务明细写这儿',
            rows: [
              { k: '使用须知', v: '放学去校门口接 · 回来看着写作业 · 晚饭在店里吃', hint: '最多 500 个字 · 不会写？一键套用模版', kind: 'input' },
            ],
          },
        ],
        foot: '本页数值为示例配置',
      },
    },
    // ── S5 制券② 兑换券 · 期限与发放（三组六行五句；原七行超出本屏高度、中段两卡空框，已拆）──
    // 「填写手机号」整行移出本屏，由 S8 私密发放屏讲（那里它是被自动打开的那一颗开关，不重复占位）。
    {
      type: 'fields',
      ui: 'g06-make-rules',
      dur: 24.5,
      darkText: true,
      subtitles: [
        { text: '有效期类型选自领取日起几天内有效，天数填十四天。', startFrame: 8, endFrame: 120 },
        { text: '可用时段打开定制，只勾工作日下午三点半到六点半。', startFrame: 120, endFrame: 249 },
        { text: '发放方式选公开领取，这行定了改不了；每人限领总量填一张。', startFrame: 249, endFrame: 400 },
        { text: '到期提醒是开的，提前三天提醒家长一次。', startFrame: 400, endFrame: 534 },
        { text: '这些设完按「创建优惠券」，这张体验券就能发给家长了。', startFrame: 534, endFrame: 700 },
      ],
      payload: {
        tag: '第一招 · 期限与发放',
        navTitle: '制作兑换券',
        crumb: '制作优惠券 › 兑换券（续）',
        groups: [
          {
            head: '③ 期限',
            rows: [
              { k: '有效期类型', v: '自领取日起N天内有效', hint: '选固定有效期的话，这两行换成起止日期', kind: 'select' },
              { k: '有效期', v: '14 天', hint: '最少 1 天，最多 365 天', kind: 'input' },
              { k: '可用时段', v: '周一至周五 15:30–18:30', hint: '默认全天可用，可自定义周天及可用时段', kind: 'switch', on: true },
            ],
          },
          {
            head: '④ 发放方式',
            rows: [
              { k: '发放方式', v: '公开领取', hint: '创建后不可修改', kind: 'select' },
              { k: '每人限领总量', v: '1 张', hint: '这一行要先打开「限领总量」', kind: 'input' },
            ],
          },
          {
            head: '⑤ 到期提醒',
            rows: [
              { k: '到期提醒', v: '开', hint: '提前提醒选 3 天 · 到期前给家长发一条提醒', kind: 'switch', on: true },
            ],
          },
        ],
        submit: '创建优惠券',
        // foot 留空：六行 + 提交钮已占到 y≈1650，再写字会与按钮带重叠；
        // 公开领取 / 私密发放的整组差别由 S7 页脚与 S8 右栏承担。
        foot: '',
      },
    },
    // ── S6 设完之后 · 家长那边（复用 g06-idea 骨架 3 卡 3 句；替换原「步骤」流程屏）──
    // 原 S6 是"扫→存→核"走一遍流程，属页面顺序不是攻略，已删；这一屏只留由设置决定的结果。
    {
      type: 'idea',
      ui: 'g06-idea',
      dur: 14.0,
      darkText: true,
      subtitles: [
        { text: '券做好，进这张券点发放优惠券，选海报存下来贴门口。', startFrame: 8, endFrame: 128 },
        { text: '家长扫这个码，券进了他自己的卡包，写着能用到几号。', startFrame: 128, endFrame: 248 },
        { text: '号码进了客户列表；到期前三天，家长会收到一条提醒。', startFrame: 248, endFrame: 388 },
      ],
      payload: {
        eyebrow: '设完之后',
        title1: '家长那边',
        title2: '看到什么',
        reasons: [
          { title: '券在卡包里', sub: '券上写着「下午托管一次」', icon: 'stamp' },
          { title: '用到几号', sub: '自领取日起 14 天内有效', icon: 'clock' },
          { title: '到期提个醒', sub: '到期前三天提醒家长一次', icon: 'bell' },
        ],
        next: '第二招 · 满减券只发给谈过的几家',
        punch: '你不用挨个打电话问，券自己带着期限和提醒',
      },
    },
    // ── S7 制券③ 满减券 · 券面与私密发放（复用 g06-make-basic 卡形 4+1 行）──
    {
      type: 'fields',
      ui: 'g06-make-basic',
      dur: 17.5,
      darkText: true,
      subtitles: [
        { text: '第二招回到类型那一页，挑满减券。', startFrame: 8, endFrame: 88 },
        { text: '优惠券名称写清楚这张抵多少，十八个字以内。', startFrame: 88, endFrame: 193 },
        { text: '消费门槛按一学期的费用填一千，门槛挨着客单价，券才有分量。', startFrame: 193, endFrame: 333 },
        { text: '优惠金额填一百，制作数量三十张。', startFrame: 333, endFrame: 413 },
        { text: '发放方式选私密发放，这行同样改不了。', startFrame: 413, endFrame: 503 },
      ],
      payload: {
        tag: '第二招 · 券面',
        navTitle: '制作满减券',
        crumb: '制作优惠券 › 类型：满减券',
        groups: [
          {
            head: '① 券面',
            rows: [
              { k: '优惠券名称', v: '学期费用立减 100', hint: '最多 18 个字 · 支持表情符号', kind: 'input' },
              { k: '消费门槛', v: '1000 元', hint: '满多少元可用 · 例：消费满100减20', kind: 'input' },
              { k: '优惠金额', v: '100 元', hint: '满减券才有的这一行', kind: 'input' },
              { k: '制作数量', v: '30 张', hint: '最少 1 张，最多 1 万张', kind: 'input' },
            ],
          },
          {
            head: '② 发放方式',
            rows: [
              { k: '发放方式', v: '私密发放', hint: '创建后不可修改 · 适合一对一 / 给指定客户', kind: 'select' },
            ],
          },
        ],
        foot: '私密发放 · 一对一给指定的那几家',
      },
    },
    // ── S8 满减券 · 只给名单里的号（复用 g06-ledger 两栏清单，4 句）──
    {
      type: 'advance',
      ui: 'g06-ledger',
      dur: 18.5,
      darkText: true,
      subtitles: [
        { text: '在领券顾客信息里打开指定手机号可领取。', startFrame: 8, endFrame: 108 },
        { text: '号码导进去，每行一个，最多五百个，重复的自动跳过。', startFrame: 108, endFrame: 223 },
        { text: '这颗开关一开，填写手机号会自动打开并且锁死，名单外的家长领不到。', startFrame: 223, endFrame: 378 },
        { text: '发出去的是一对一领券码，家长领完，这个码就失效。', startFrame: 378, endFrame: 523 },
      ],
      payload: {
        tag: '第二招 · 只给这几家',
        title: '指定手机号可领取',
        sub: '在「领券顾客信息」这一组里',
        cols: [
          {
            head: '怎么设',
            tone: 'accent',
            items: [
              '打开「指定手机号可领取」，导入谈过的家长号码',
              '每行一个手机号，最多 500 个，重复的自动跳过',
              '开启后「填写手机号」自动打开，且关不掉',
              '仅输入的手机号可领取此券',
            ],
          },
          {
            head: '和公开领取的差别',
            tone: 'caramel',
            items: [
              '公开领取：看到的家长都能领，才有「允许分享」这行',
              '私密发放：只发给输进名单的人',
              '发出去的是一对一领券码，领完此码失效',
              '发放备注只有商家自己看得到',
            ],
          },
        ],
        punch: '只有输进名单的那些号能领',
      },
    },
    // ── S9 私密发放要设的数据（复用 g06-chain 时间线，3 节点 4 句）──
    {
      type: 'advance',
      ui: 'g06-chain',
      dur: 16.5,
      darkText: true,
      subtitles: [
        { text: '点开这张券的发放优惠券，选私密发放里的面对面二维码。', startFrame: 8, endFrame: 138 },
        { text: '发放数量最多十张，一对一发就填一张。', startFrame: 138, endFrame: 228 },
        { text: '超时时间选一天，过了点没人领，这码就失效，得重新发。', startFrame: 228, endFrame: 348 },
        { text: '发放备注写清楚是哪一波谈的，只有你自己看得到。', startFrame: 348, endFrame: 463 },
      ],
      payload: {
        tag: '第二招 · 发出去',
        title: '一对一发给这一家',
        sub: '券详情页点「发放优惠券」→ 私密发放',
        nodes: [
          { head: '面对面二维码', desc: '私密发放面板里选这一格，进来就是发放设置', note: '适合一对一 / 储值回馈 / 消费奖励 / 给指定客户' },
          { head: '发放数量 · 超时时间', desc: '数量 1~10 张，一对一就填 1 张；超时时间选 1 天', note: '超过有效期后，领取链接失效，需要重新发放' },
          { head: '发放备注', desc: '写「开学第一周谈的三家」', note: '选填，仅商家可见 · 客户领完，这个码就失效' },
        ],
        foot: '本页数值为示例配置',
      },
    },
    // ── S10 制券④ 分享与转赠（复用 g06-make-basic 卡形 3+1 行）──
    {
      type: 'fields',
      ui: 'g06-make-basic',
      dur: 19.0,
      darkText: true,
      subtitles: [
        { text: '第三招让家长带家长，先另做一张私密发放的券当奖品。', startFrame: 8, endFrame: 133 },
        { text: '回到这张兑换券，在分享与转赠里打开允许转赠。', startFrame: 133, endFrame: 243 },
        { text: '再打开开启转赠奖励。', startFrame: 243, endFrame: 298 },
        { text: '挑刚才那张奖品券，奖品券只能是私密发放的有效券。', startFrame: 298, endFrame: 418 },
        { text: '奖励不是在转赠那一下发，是第二个人核销之后才发。', startFrame: 418, endFrame: 538 },
      ],
      payload: {
        tag: '第三招 · 开关',
        navTitle: '制作兑换券',
        crumb: '制作优惠券 › 兑换券 › 分享与转赠',
        groups: [
          {
            head: '分享与转赠',
            rows: [
              { k: '允许转赠', v: '开', hint: '家长在自己券详情点「转赠给好友」', kind: 'switch', on: true },
              { k: '开启转赠奖励', v: '开', hint: '转赠后，受赠人领取并核销，再赠一张', kind: 'switch', on: true },
              { k: '转赠奖励券', v: '挑那张奖品券', hint: '仅可选择「私密发放」类型的有效优惠券', kind: 'select' },
            ],
          },
          {
            head: '先做的那张奖品券',
            rows: [
              { k: '发放方式', v: '私密发放', hint: '奖品券必须是一张有效的私密发放券 · 所以这招要两张券', kind: 'select' },
            ],
          },
        ],
        foot: '奖品券要先做好，这里才挑得到',
      },
    },
    // ── S11 链路走完 + 核销页三件（复用 g06-chain 时间线，3 节点 4 句）──
    {
      type: 'advance',
      ui: 'g06-chain',
      dur: 17.5,
      darkText: true,
      subtitles: [
        { text: '家长 A 把券转给同学的家长 B，这张券谁先领到算谁的。', startFrame: 8, endFrame: 133 },
        { text: 'B 领走，到店那天你一核销，券上标着转赠获得。', startFrame: 133, endFrame: 238 },
        { text: '要是这张券还在转赠中，页面会挡下来，写着暂不可核销。', startFrame: 238, endFrame: 363 },
        { text: 'B 一核销，A 的奖励券自动到账，A 也会收到到账通知。', startFrame: 363, endFrame: 498 },
      ],
      payload: {
        tag: '第三招 · 走完整条链',
        title: '家长 A 带来家长 B',
        sub: '开关在刚才那三行里，跑起来是这三步',
        nodes: [
          { head: 'A 转赠给 B', desc: 'A 在自己券详情点「转赠给好友」', note: '弹窗写着「仅首位领取好友可获得本券」' },
          { head: 'B 领取 · 到店核销', desc: '核销页券卡右下角标着「转赠获得」', note: '这一眼就知道这单是谁带来的' },
          { head: 'A 的奖励到账', desc: 'B 核销成功那一下，A 自动得那张奖品券', note: '这页显示「转赠奖励」状态：奖励成功 / 待补偿 / 失败', reward: true },
        ],
        foot: '本页数值为示例配置',
      },
    },
    // ── S12 收尾 · 三招收口 + 后台真词（复用 g06-cta）──
    {
      type: 'cta',
      ui: 'g06-cta',
      dur: 15.0,
      darkText: true,
      subtitles: [
        { text: '体验的孩子来了几个，看有效发放张数和核销率。', startFrame: 8, endFrame: 118 },
        { text: '谈过的几家报没报名，领券记录导出来对一对。', startFrame: 118, endFrame: 223 },
        { text: '带同学的这位，奖励券正在他卡包里等下一回。', startFrame: 223, endFrame: 328 },
        { text: '这学期的招生，从做一张券开始。券到卡包。', startFrame: 328, endFrame: 423 },
      ],
      payload: {
        title1: '一套攻略',
        title2: '三招设完',
        strips: [
          { name: '兑换券 · 下午托管一次', role: '来体验' },
          { name: '满减券 · 只给名单里的号', role: '给谈过的' },
          { name: '转赠奖励 · 家长带家长', role: '带新生' },
        ],
        brand: '券到卡包',
        sub: '有效发放张数 · 核销率 · 导出领券记录',
      },
    },
  ],
};
