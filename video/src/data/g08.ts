// g08 火锅 · 片1 · 数据（无声版 · 一屏标杆阶段）
// 标杆屏 = 三选项对照表（有效期类型三选一）
import type { Scene, VideoData } from '../types';

const scenes: Scene[] = [
  {
    type: 'mechanism', ui: 'g08-compare', dur: 8,
    payload: {
      tag: '有效期三选',
      title: '节日做券，有效期别选错',
      sub: '三种类型，对应三种生意节奏',
      cols: [
        {
          no: '01',
          head: '固定有效期',
          tag: '节日档',
          useCase: '节日/店庆等有日期的活动，压档期用',
          downside: '日常券用它=过期浪费',
          recommended: true,
          pickSignal: '有明确日期的活动，就选它',
          example: '中秋家宴券只在中秋到国庆假期之间能用',
          curveType: 'festival',
          statA: { label: '紧迫感', value: '★★★' },
          statB: { label: '灵活度', value: '★☆☆' },
        },
        {
          no: '02',
          head: '自领取日起 N 天',
          tag: '催到店',
          useCase: '想催顾客领完快点来',
          downside: '节末领的券当天挤高峰',
          pickSignal: '想让顾客领完快点来，选它',
          example: '顾客领完券，7天之内得来吃一顿',
          curveType: 'rush',
          statA: { label: '紧迫感', value: '★★☆' },
          statB: { label: '灵活度', value: '★★☆' },
        },
        {
          no: '03',
          head: '自领取次日起 N 天',
          tag: '节后接力',
          useCase: '节后接力：当天不抵、隔天生效',
          downside: '顾客当天想用用不了',
          pickSignal: '要把客流匀开，就选这个',
          example: '节末用完中秋券，第二天才能用回店券',
          curveType: 'spread',
          statA: { label: '紧迫感', value: '★☆☆' },
          statB: { label: '灵活度', value: '★★★' },
        },
      ],
      punch: '节日档就锁固定有效期，过期自动作废=紧迫感',
    },
    subtitles: [
      { text: '固定有效期——节日店庆压档期，过了自动作废', startFrame: 8, endFrame: 80 },
      { text: '自领取日起——催顾客领完快点来', startFrame: 82, endFrame: 150 },
      { text: '自领取次日起——节后接力，把客流匀进平时', startFrame: 152, endFrame: 240 },
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
  },
  scenes,
  hasAudio: false,
};
