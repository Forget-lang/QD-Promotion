#!/usr/bin/env node
/**
 * 豆包语音合成 2.0 TTS 调用脚本（v3 单向流式 API）
 * 用法：node scripts/tts.mjs <文本> <输出文件名> [语速 1.0=正常]
 * 示例：node scripts/tts.mjs "你好世界" s1.wav
 *
 * API 返回格式：NDJSON（每行一个 JSON 对象）
 *   - 多个 audio chunk（code=0, data=base64音频数据）
 *   - sentence 信息（code=0, data=null, sentence={...}）
 *   - 最终状态（code=20000000, message="OK"）
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// 手动加载 .env（避免依赖 dotenv）
function loadEnv() {
  const envPath = path.join(projectRoot, '.env');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const API_KEY = process.env.VOLC_TTS_API_KEY;
const SPEAKER_ID = process.env.SPEAKER_ID || 'zh_female_vv_uranus_bigtts';
const RESOURCE_ID = process.env.RESOURCE_ID || 'seed-tts-2.0';

if (!API_KEY) {
  console.error('错误：未找到 VOLC_TTS_API_KEY，请检查 .env 文件');
  process.exit(1);
}

const text = process.argv[2];
const outputFile = process.argv[3];
const speedRatio = parseFloat(process.argv[4] || '1.0');

if (!text || !outputFile) {
  console.error('用法：node scripts/tts.mjs <文本> <输出文件名> [语速]');
  console.error('示例：node scripts/tts.mjs "你好世界" s1.wav');
  process.exit(1);
}

const outputDir = path.join(projectRoot, 'video/public/audio');
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, outputFile);

/**
 * 调用 v3 单向流式 TTS API
 */
async function synthesize(text, outputPath, speedRatio = 1.0) {
  const reqid = `g02_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const body = {
    reqid,
    req_params: {
      text,
      speaker: SPEAKER_ID,
      audio_params: {
        format: 'wav',
        sample_rate: 24000,
        speed_ratio: speedRatio,
      },
    },
  };

  console.log(`正在合成："${text.slice(0, 30)}${text.length > 30 ? '...' : ''}"`);
  console.log(`音色：${SPEAKER_ID}`);
  console.log(`语速：${speedRatio}`);

  const resp = await fetch('https://openspeech.bytedance.com/api/v3/tts/unidirectional', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': API_KEY,
      'X-Api-Resource-Id': RESOURCE_ID,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error(`API 请求失败：${resp.status} ${resp.statusText}`);
    console.error(errText.slice(0, 500));
    process.exit(1);
  }

  // v3 API 返回 NDJSON：每行一个 JSON 对象
  // 多个 audio data chunk + sentence info + final status
  const respText = await resp.text();
  const lines = respText.split('\n').filter(l => l.trim());

  let audioChunks = 0;
  const audioBuffers = [];
  let finalCode = -1;
  let finalMessage = '';

  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      if (obj.code === 0 && obj.data && typeof obj.data === 'string') {
        // 音频数据块 — 逐个解码再拼接（避免 base64 拼接后解码出错）
        audioBuffers.push(Buffer.from(obj.data, 'base64'));
        audioChunks++;
      } else if (obj.code === 20000000) {
        // 成功完成
        finalCode = obj.code;
        finalMessage = obj.message;
      } else if (obj.code !== 0) {
        // 错误
        finalCode = obj.code;
        finalMessage = obj.message;
      }
    } catch (e) {
      // 跳过无法解析的行
      console.warn(`警告：跳过无法解析的行，前 100 字符：${line.slice(0, 100)}`);
    }
  }

  if (finalCode !== 20000000 && finalCode !== -1) {
    console.error(`TTS 错误：code=${finalCode}, message=${finalMessage}`);
    process.exit(1);
  }

  if (audioBuffers.length === 0) {
    console.error('错误：未获取到音频数据');
    console.error(`响应行数：${lines.length}`);
    process.exit(1);
  }

  // 拼接所有音频块
  const audioBuffer = Buffer.concat(audioBuffers);
  writeFileSync(outputPath, audioBuffer);

  // 计算时长（24kHz, 16bit, mono = 48000 bytes/sec）
  const dataSize = audioBuffer.length;
  const estimatedDuration = dataSize / 48000;

  console.log(`✓ 已保存：${outputPath}`);
  console.log(`  音频块数：${audioChunks}`);
  console.log(`  文件大小：${(dataSize / 1024).toFixed(1)} KB`);
  console.log(`  预估时长：${estimatedDuration.toFixed(2)} 秒（以 ffprobe 为准）`);

  return estimatedDuration;
}

await synthesize(text, outputPath, speedRatio);
