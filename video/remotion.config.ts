import { Config } from '@remotion/cli/config';

// 编码显式锁死（2026-09-03）：不吃默认值，防版本升级导致口径漂移
Config.setCodec('h264');
Config.setCrf(18);
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
