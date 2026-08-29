// G05 节拍层：把"口播进行到第几句"变成画面可用的时钟（SKILL 第 5 步·三层运动的中层）
// 原则：节拍 = 口播句，不是画面元素；一句指向一个**区域**（区域可含多行），一屏指向次数不超过句数。
import { interpolate, useCurrentFrame } from 'remotion';
import type { Scene } from '../../types';

/** 当前帧落在第几句字幕上（-1 = 还没开始） */
export function useBeatIndex(scene: Scene): number {
  const f = useCurrentFrame();
  const lines = scene.subtitles ?? [];
  let idx = -1;
  for (let i = 0; i < lines.length; i++) if (f >= lines[i].startFrame) idx = i;
  return idx;
}

/**
 * 区域状态：给定"每句字幕指向哪个区域"的表，算出每个区域当前该呈现成什么样。
 * @param map  长度 = 字幕句数；map[i] = 第 i 句指向的区域序号（-1 表示这句不指向）
 * @param region 本元素所属区域序号
 */
export function useRegion(scene: Scene, map: number[], region: number): 'idle' | 'active' | 'done' {
  const idx = useBeatIndex(scene);
  const cur = idx >= 0 && idx < map.length ? map[idx] : -1;
  if (cur === region) return 'active';
  // 该区域被指向过的最后一句已过 → done（回到正常呈现，不压暗，信息要一直可读）
  const lastPointed = map.lastIndexOf(region);
  if (lastPointed >= 0 && idx > lastPointed) return 'done';
  return 'idle';
}

/** 纯函数版：在列表渲染里安全调用（不要在循环里用 useRegion，那是 hook in loop） */
export function regionState(map: number[], beatIdx: number, region: number): 'idle' | 'active' | 'done' {
  const cur = beatIdx >= 0 && beatIdx < map.length ? map[beatIdx] : -1;
  if (cur === region) return 'active';
  const lastPointed = map.lastIndexOf(region);
  if (lastPointed >= 0 && beatIdx > lastPointed) return 'done';
  return 'idle';
}

/** 区域强调样式：active 提亮 + 轻微放大，idle/done 一致可读（画面写全，嘴上只讲主线） */
export const regionStyle = (state: 'idle' | 'active' | 'done') => ({
  transform: state === 'active' ? 'scale(1.025)' : 'scale(1)',
  opacity: state === 'idle' ? 0.88 : 1,
});

/**
 * 底层持续微动（每屏必挂，消灭死帧）：整屏缓推 + 呼吸摆动 + 漂移。
 * @param durFrames 本屏总帧数（缓推走完全程）
 * @param phase     多元素错相（同屏内 0/1/2…，避免整屏同相 = 一块板子在动）
 */
export const useMicroMotion = (durFrames: number, phase = 0) => {
  const f = useCurrentFrame();
  return {
    zoom: 1 + interpolate(f, [0, durFrames], [0, 0.02], { extrapolateRight: 'clamp' }),
    breathe: Math.sin((f + phase * 7) / 26),
    sway: Math.sin((f + phase * 5) / 22),
    drift: Math.sin((f + phase * 13) / 34),
  };
};
