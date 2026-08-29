import { Composition, registerRoot, staticFile } from 'remotion';
import { VTemplate, computeTotalFrames } from './VTemplate';
import { FPS } from './palette';
import * as videoModules from './data';
import { BundleOpenBench } from './bench/BundleOpenBench';
import { BenchPain, BenchMech } from './bench/BenchScreens';
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
      {/* 一屏标杆（质感验证用，非交付片） */}
      <Composition id="BENCH-bundle-open" component={BundleOpenBench} fps={FPS} width={1080} height={1920} durationInFrames={150} />
      <Composition id="BENCH-pain" component={BenchPain} fps={FPS} width={1080} height={1920} durationInFrames={150} />
      <Composition id="BENCH-mech" component={BenchMech} fps={FPS} width={1080} height={1920} durationInFrames={150} />
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
