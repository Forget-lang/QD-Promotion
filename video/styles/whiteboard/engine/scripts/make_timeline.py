#!/usr/bin/env python3
"""make_timeline.py —— 语音驱动时间轴 + 音轨合成（白板风格 · 通段的一环）

输入：vo.json（见同目录 README 示例）
输出：① 已回填 startMs/durationMs 的 annotation ② 与时间轴对齐的单轨 wav
不调用 TTS（TTS 由 build_voiced.sh 调 scripts/tts.mjs），本脚本只做"量时长 → 排时间轴 → 合音轨"。

用法：<engine>/.venv/bin/python make_timeline.py vo.json
"""
import json, os, subprocess, sys, wave
import numpy as np

SR = 24000


def read_wav_mono24k(path):
    w = wave.open(path)
    n, sr, ch = w.getnframes(), w.getframerate(), w.getnchannels()
    d = np.frombuffer(w.readframes(n), dtype=np.int16)
    if ch > 1:
        d = d.reshape(-1, ch).mean(1).astype(np.int16)
    if sr != SR:  # 线性重采样
        idx = np.linspace(0, len(d) - 1, int(len(d) * SR / sr))
        d = np.interp(idx, np.arange(len(d)), d).astype(np.int16)
    return d


def main(cfg_path):
    cfg = json.load(open(cfg_path, encoding='utf-8'))
    lead, tail = cfg.get('leadMs', 400) / 1000, cfg.get('tailMs', 800) / 1000
    base = os.path.dirname(os.path.abspath(cfg_path))

    segs, durs = [], []
    for ln in cfg['lines']:
        p = ln['wav'] if os.path.isabs(ln['wav']) else os.path.join(base, ln['wav'])
        d = read_wav_mono24k(p)
        segs.append(d); durs.append(len(d) / SR)
        print(f"  {ln['element']:<14} {durs[-1]:.2f}s  ← {p.split('/')[-1]}")

    total = lead + sum(durs) + tail
    track = np.zeros(int(total * SR), dtype=np.int16)
    t, starts = lead, []
    for d in segs:
        starts.append(t)
        track[int(t * SR):int(t * SR) + len(d)] = d
        t += len(d) / SR
    track_path = os.path.join(base, cfg.get('outTrack', 'voiced-track.wav'))
    w = wave.open(track_path, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(track.tobytes()); w.close()
    print(f"音轨 → {os.path.basename(track_path)}  共 {total:.2f}s（lead {lead} ＋ 语音 {sum(durs):.2f} ＋ 尾 {tail}）")

    ann = json.load(open(os.path.join(base, cfg['baseAnnotation']), encoding='utf-8'))
    ann['sceneId'] = cfg.get('sceneId', ann.get('sceneId', 'voiced'))
    ann['sceneDurationMs'] = int(total * 1000)
    by_id = {e['id']: e for e in ann['elements']}
    for k, ln in enumerate(cfg['lines']):
        el = by_id.get(ln['element'])
        if el is None:
            print(f"  [!] annotation 里没有元素 {ln['element']}，跳过", file=sys.stderr); continue
        el['reveal']['startMs'] = int(starts[k] * 1000)
        el['reveal']['durationMs'] = int(durs[k] * 1000)
    out_ann = os.path.join(base, cfg.get('outAnnotation', 'voiced.annotation.json'))
    json.dump(ann, open(out_ann, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f"时间轴 → {os.path.basename(out_ann)}  sceneDurationMs={ann['sceneDurationMs']}")

    # 一步到位：渲染无声片 → 合音轨（若 cfg 给了输出名）
    if cfg.get('outFinal'):
        silent = os.path.join(base, cfg.get('outSilent', 'voiced-silent.mp4'))
        engine = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        png = os.path.join(base, cfg['scenePng'])
        hand = os.path.join(engine, 'assets', 'drawing-hand.png')
        r = subprocess.run([sys.executable, os.path.join(engine, 'scripts', 'render_stream_whiteboard.py'),
                            png, out_ann, silent, hand, '--ink-path', 'grid', '--color-fill', 'contour-wipe',
                            '--cap-long-edge', '1920', '--fps', '30'], capture_output=True, text=True)
        if r.returncode != 0:
            print(r.stdout[-1500:], r.stderr[-1500:]); sys.exit(1)
        final = os.path.join(base, cfg['outFinal'])
        m = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', silent, '-i', track_path,
                            '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', final],
                           capture_output=True, text=True)
        if m.returncode != 0:
            print(m.stderr[-1500:]); sys.exit(1)
        print(f"成片 → {os.path.basename(final)}  （无声片 {os.path.basename(silent)} 保留）")


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'vo.json')
