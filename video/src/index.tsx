import { Composition, registerRoot, staticFile } from 'remotion';
import { VTemplate, computeTotalFrames } from './VTemplate';
import { FPS } from './palette';
import * as videoModules from './data';
import { G03CoverA, G03CoverB, G03CoverSohu } from './covers/g03cover';
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
      {/* G03 发布封面（竖版 A/B + 搜狐横版头图） */}
      <Composition id="G03-Cover-A" component={G03CoverA} fps={FPS} width={1080} height={1920} durationInFrames={1} />
      <Composition id="G03-Cover-B" component={G03CoverB} fps={FPS} width={1080} height={1920} durationInFrames={1} />
      <Composition id="G03-Cover-Sohu" component={G03CoverSohu} fps={FPS} width={1920} height={1080} durationInFrames={1} />
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
