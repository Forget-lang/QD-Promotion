// 模板注册表：设计稿环节选模板的入口；盘点由 scripts/list-assets.mjs 从本目录实时生成
import type { VideoTemplate } from './types';
import { T01 } from './T01-机制讲解型';
import { T02 } from './T02-时段流量型';
import { T03 } from './T03-产品卡面型';

export const TEMPLATES: VideoTemplate[] = [T01, T02, T03];
