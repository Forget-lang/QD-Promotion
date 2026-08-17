// G02 茶饮咖啡 · 内容数据 + 风格配置（2026-08-17 视觉升级版）
// 升级点：typography 落地 / horizontal 版式变体 / 文案打磨 / 背景纹理
import type { VideoData } from '../types';
import { ACCENT_CYAN, ACCENT_GREEN, ACCENT_ORANGE, GREEN } from '../palette';

export const g02: VideoData = {
  id: 'G02-TeaCoffee',
  style: {
    palette: 'mint-cool',    // 配色（极简薄荷，G02 行业 base）
    motion: 'buttery',       // 动画性格：柔和顺滑
    typography: 'clean',     // 字体性格：普惠体清爽现代
    transition: 'wipe',      // 转场：擦除
    hookStyle: 'number',     // 钩子：数字型（10 弹入）
  },
  scenes: [
    {
      type: 'hook', dur: 5,
      title: '一杯的钱，先收住十次的客',
      sub: '下午茶客流，不用靠降价',
    },
    {
      type: 'pain', dur: 10,
      title: '降价，只会把利润砍没',
      leftTitle: '打价格战',
      leftItems: ['越打越低，利润越薄', '老客等折扣才来', '拼完价格没沉淀'],
      rightTitle: '锁次数，锁住回头客',
      rightSub: '关键不是便宜，是来几次',
    },
    {
      type: 'solution', dur: 12,
      title: '次卡，把客人锁回来',
      layout: 'horizontal',  // 启用横向三卡版式（视觉升级）
      items: [
        { icon: 'cup', color: GREEN, title: '次数看得见', desc: '剩几次，卡包里一目了然' },
        { icon: 'check', color: ACCENT_CYAN, title: '扫码即扣', desc: '不用人工记，不怕漏' },
        { icon: 'gift', color: ACCENT_ORANGE, title: '能转赠', desc: '朋友来核销，就是新客' },
      ],
    },
    {
      type: 'flow', dur: 10,
      title: '一张次卡，老客帮你带新客',
      nodes: [
        { icon: 'cup', color: GREEN, title: '领次卡' },
        { icon: 'gift', color: ACCENT_ORANGE, title: '转赠朋友' },
        { icon: 'check', color: ACCENT_CYAN, title: '到店核销' },
        { icon: 'users', color: ACCENT_GREEN, title: '新客进池' },
      ],
      footnote: '转赠 = 老客帮你发券',
    },
    {
      type: 'grid', dur: 10,
      title: '两张券，把客流热起来',
      cards: [
        { icon: 'bolt', color: ACCENT_ORANGE, title: '随机金额券', desc: '群里抢券，气氛先热' },
        { icon: 'cup', color: GREEN, title: '套餐券', desc: '新品低门槛入口' },
        { icon: 'clock', color: ACCENT_CYAN, title: '定时开抢', desc: '倒计时造稀缺感' },
        { icon: 'users', color: ACCENT_GREEN, title: '闲时时段', desc: '下午空桌补起来' },
      ],
    },
    {
      type: 'panel', dur: 12,
      title: '用了之后，发生什么？',
      metrics: [
        { icon: 'users', color: ACCENT_GREEN, title: '回头客', dir: '↑', desc: '次卡锁住老客' },
        { icon: 'clock', color: ACCENT_CYAN, title: '空桌时段', dir: '↓', desc: '闲时被填上' },
        { icon: 'cash', color: GREEN, title: '复购', dir: '↑', desc: '来的次数变多' },
      ],
    },
    {
      type: 'cta', dur: 8,
      title: '券到卡包',
      sub: '再小的门店也可以制作电子券',
    },
  ],
};
