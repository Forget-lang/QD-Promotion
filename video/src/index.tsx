import { Composition, registerRoot, staticFile } from 'remotion';
import { VTemplate, computeTotalFrames } from './VTemplate';
import { FPS } from './palette';
import * as videoModules from './data';
import { BundleOpenBench } from './bench/BundleOpenBench';
import { BenchPain, BenchMech } from './bench/BenchScreens';
import { BenchTable } from './bench/BenchTable';
import { G07Bench } from './bench/G07Bench';
import { R01, R02, R03, R04, R05, R06, R08, R09, R10 } from './bench/BenchRefsA';
import { R11, R12, R13, R14, R16, R17, R18, R19 } from './bench/BenchRefsB';
import { G06CoverDy, G06CoverXhs, G06CoverSohu } from './covers/G06Cover';
import type { VideoData } from './types';

// ── 注入项目商用字体（@font-face，Remotion 渲染前自动等待 document.fonts.ready）──
const FONT_CSS = `
@font-face {
  font-family: 'Alibaba PuHuiTi 3';
  src: url('${staticFile('fonts/AlibabaPuHuiTi-3-55-Regular.ttf')}') format('truetype');
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'Alibaba PuHuiTi 3';
  src: url('${staticFile('fonts/AlibabaPuHuiTi-3-65-Medium.ttf')}') format('truetype');
  font-weight: 500;
  font-display: swap;
}
@font-face {
  font-family: 'Alibaba PuHuiTi 3';
  src: url('${staticFile('fonts/AlibabaPuHuiTi-3-85-Bold.ttf')}') format('truetype');
  font-weight: 700;
  font-display: swap;
}
@font-face {
  font-family: 'Alibaba PuHuiTi 3';
  src: url('${staticFile('fonts/AlibabaPuHuiTi-3-95-ExtraBold.ttf')}') format('truetype');
  font-weight: 800;
  font-display: swap;
}
@font-face {
  font-family: 'DeyiHei';
  src: url('${staticFile('fonts/得意黑.ttf')}') format('truetype');
  font-weight: 900;
  font-display: swap;
}
@font-face {
  font-family: 'Alimama FangYuan';
  src: url('${staticFile('fonts/阿里妈妈方圆体.ttf')}') format('truetype');
  font-weight: 400;
  font-display: swap;
}
`;

// 收集所有视频数据（从 data/index.ts 统一导出）
const videos: VideoData[] = Object.values(videoModules);

const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 全局字体声明 */}
      <style dangerouslySetInnerHTML={{ __html: FONT_CSS }} />
      {/* 一条视频一条 Composition；封面在 src/covers/ 建好后在此注册 */}
      {/* g06 三平台封面（抖音 9:16 / 小红书 3:4 / 搜狐 16:9，代码渲染文字） */}
      <Composition id="g06-cover-dy" component={G06CoverDy} fps={FPS} width={1080} height={1920} durationInFrames={1} />
      <Composition id="g06-cover-xhs" component={G06CoverXhs} fps={FPS} width={1080} height={1440} durationInFrames={1} />
      <Composition id="g06-cover-sohu" component={G06CoverSohu} fps={FPS} width={1920} height={1080} durationInFrames={1} />
      {/* 一屏标杆（质感验证用，非交付片） */}
      <Composition id="BENCH-bundle-open" component={BundleOpenBench} fps={FPS} width={1080} height={1920} durationInFrames={150} />
      <Composition id="BENCH-pain" component={BenchPain} fps={FPS} width={1080} height={1920} durationInFrames={150} />
      <Composition id="BENCH-mech" component={BenchMech} fps={FPS} width={1080} height={1920} durationInFrames={150} />
      <Composition id="BENCH-table" component={BenchTable} fps={FPS} width={1080} height={1920} durationInFrames={150} />
      {/* g07 咖啡茶饮 · 一屏标杆（质感验证，非交付片） */}
      <Composition id="BENCH-g07-coffee" component={G07Bench} fps={FPS} width={1080} height={1920} durationInFrames={210} />
      {([["BENCH-r01", R01], ["BENCH-r02", R02], ["BENCH-r03", R03], ["BENCH-r04", R04], ["BENCH-r05", R05], ["BENCH-r06", R06], ["BENCH-r08", R08], ["BENCH-r09", R09], ["BENCH-r10", R10], ["BENCH-r11", R11], ["BENCH-r12", R12], ["BENCH-r13", R13], ["BENCH-r14", R14], ["BENCH-r16", R16], ["BENCH-r17", R17], ["BENCH-r18", R18], ["BENCH-r19", R19]] as const).map(([id, C]) => (
        <Composition key={id} id={id} component={C} fps={FPS} width={1080} height={1920} durationInFrames={90} />
      ))}
      {videos.map((video) => (
        <Composition
          key={video.id}
          id={video.id}
          component={VTemplate}
          fps={FPS}
          width={1080}
          height={1920}
          durationInFrames={computeTotalFrames(video)}
          defaultProps={{ video }}
        />
      ))}
    </>
  );
};

registerRoot(RemotionRoot);
