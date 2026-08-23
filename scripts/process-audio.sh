#!/bin/bash
# ============================================================================
# 音频后处理脚本 · J-cut 同步方案标准工具
# ============================================================================
#
# ⚠️ 环境注意（2026-08-22）：本机无系统 ffmpeg；Remotion 自带 ffmpeg 为
#    macOS 15 构建、macOS 14 无法运行（Abort trap）。请用 ffmpeg-static：
#    export PATH="$PWD/video/node_modules/ffmpeg-static:$PATH"
#    然后 bash scripts/process-audio.sh <输入目录> <输出目录>
#
# 用途：对 TTS 生成的原始语音做标准化后处理，用于 Remotion 视频配音
# 处理：响度归一化到 -16 LUFS（短视频行业标准）
#
# ⚠️ 重要原则（J-cut 方案，见 docs/internal/13号文档 §2.6）：
#   - 不裁剪首尾静音 → 保证第一个字和最后一个字 100% 完整
#   - 不做文件级淡入淡出 → 淡入淡出在 Remotion 代码层帧级控制
#   - 只做响度归一化 → 保证 7 段音量一致
#
# 用法：
#   export PATH="$PWD/video/node_modules/ffmpeg-static:$PATH"
#   bash scripts/process-audio.sh <输入目录> <输出目录>
#
# 示例：
#   bash scripts/process-audio.sh video/public/audio/raw video/public/audio
#
# 输入文件命名：s1_raw.wav, s2_raw.wav, ...
# 输出文件命名：s1.wav, s2.wav, ...
# ============================================================================

set -e

INPUT_DIR="$1"
OUTPUT_DIR="$2"

if [ -z "$INPUT_DIR" ] || [ -z "$OUTPUT_DIR" ]; then
  echo "用法：bash scripts/process-audio.sh <输入目录> <输出目录>"
  echo "示例：bash scripts/process-audio.sh video/public/audio/raw video/public/audio"
  exit 1
fi

if [ ! -d "$INPUT_DIR" ]; then
  echo "错误：输入目录不存在：$INPUT_DIR"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

echo "═══════════════════════════════════════"
echo " 音频后处理 · J-cut 标准方案"
echo " 处理：响度归一化 -16 LUFS"
echo " 原则：零裁剪、零淡入，保留原始完整内容"
echo "═══════════════════════════════════════"
echo ""
echo "输入：$INPUT_DIR"
echo "输出：$OUTPUT_DIR"
echo ""

count=0
for input in "$INPUT_DIR"/*.wav; do
  [ -f "$input" ] || continue

  filename=$(basename "$input")
  # s1_raw.wav → s1.wav
  outname=$(echo "$filename" | sed 's/_raw//')
  output="$OUTPUT_DIR/$outname"

  echo "[$outname] 响度归一化..."

  ffmpeg -y -i "$input" \
    -af "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=none" \
    "$output" 2>/dev/null

  orig_dur=$(ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$input" 2>/dev/null)
  final_dur=$(ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$output" 2>/dev/null)

  echo "  ✓ ${orig_dur}s → ${final_dur}s"
  count=$((count + 1))
done

echo ""
echo "═══════════════════════════════════════"
echo " 完成：处理了 ${count} 个文件"
echo " 输出目录：$OUTPUT_DIR"
echo "═══════════════════════════════════════"
