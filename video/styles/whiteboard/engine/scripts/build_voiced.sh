#!/usr/bin/env bash
# build_voiced.sh —— 白板风格"带语音成片"一键链（通段的执行入口）
#
# 链路：口播稿(vo.json) → 逐句 TTS(scripts/tts.mjs) → 语音驱动时间轴(make_timeline.py)
#       → 引擎渲染无声片 → ffmpeg 合音轨 → 带语音成片
#
# 用法：在《片目录》放 vo.json（示例见同目录 README / probe/vo.json），然后
#   bash video/styles/whiteboard/engine/scripts/build_voiced.sh <片目录>
#
# 约定：vo.json 的 lines[].wav 为相对片目录的路径；TTS 输出目录由本脚本创建并回填。

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENGINE="$(dirname "$HERE")"
ROOT="$(cd "$ENGINE/../../../.." && pwd)"        # promotion/（engine→whiteboard→styles→video→promotion）
PIECE="${1:-}"
[ -z "$PIECE" ] && { echo "用法：build_voiced.sh <片目录>"; exit 1; }
PIECE="$(cd "$PIECE" && pwd)"
CFG="$PIECE/vo.json"
[ -f "$CFG" ] || { echo "缺少 $CFG"; exit 1; }

ENV_PY="$ENGINE/.venv/bin/python"
[ -x "$ENV_PY" ] || { echo "引擎环境未就绪：先跑 python3 $ENGINE/scripts/prepare_env.py"; exit 1; }

echo "=== 1/4 逐句 TTS ==="
"$ENV_PY" - "$CFG" "$ROOT" <<'PY'
import json, subprocess, sys, os
cfg, root = json.load(open(sys.argv[1], encoding='utf-8')), sys.argv[2]
piece = os.path.dirname(os.path.abspath(sys.argv[1]))
for ln in cfg['lines']:
    wav_abs = ln['wav'] if os.path.isabs(ln['wav']) else os.path.join(piece, ln['wav'])
    os.makedirs(os.path.dirname(wav_abs), exist_ok=True)
    rel = os.path.relpath(wav_abs, os.path.join(root, 'video/public/audio'))
    r = subprocess.run(['node', os.path.join(root, 'scripts/tts.mjs'), ln['text'], rel,
                        str(ln.get('speed', 1.0))], cwd=root, capture_output=True, text=True)
    ok = '已保存' in r.stdout
    print(f"  {ln['element']:<14} {'✓' if ok else '✗'} {rel}")
    if not ok:
        print(r.stdout[-800:], r.stderr[-800:]); sys.exit(1)
PY

echo "=== 2/4 语音驱动时间轴 ＋ 3/4 渲染 ＋ 4/4 合音轨 ==="
"$ENV_PY" "$HERE/make_timeline.py" "$CFG"

echo "=== 完成 ==="
