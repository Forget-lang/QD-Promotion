"""
扫描图标素材整棵树，输出每个文件的尺寸/帧数/平均色/色方差，
用于区分"纹理/图案（背景层候选）"vs"离散插画/图标sprite（插画候选）"。

判定启发（粗略，待人工复看异常样本）：
- 高色方差 + 复杂构图 → 可能是图标sprite或离散插画
- 中等色方差 + 大尺寸无缝图案 → 纹理（背景层）
- 单帧 gif 且色方差低 → 多半是动画纹理
"""
import os, csv, sys
from pathlib import Path
from collections import Counter

try:
    from PIL import Image
except ImportError:
    print("NEED_PIL", flush=True)
    sys.exit(2)

ROOT = Path(r"D:/Project/quandao/图标素材")
OUT_DIR = Path(r"D:/Project/quandao/.workbuddy/tmp")
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_CSV = OUT_DIR / "图标素材_清单.csv"

ALLOWED = {".png", ".jpg", ".jpeg", ".gif", ".psd"}

rows = []
errs = []
for p in sorted(ROOT.rglob("*")):
    if p.is_dir():
        continue
    ext = p.suffix.lower()
    if ext not in ALLOWED:
        continue
    rel = str(p.relative_to(ROOT)).replace("\\", "/")
    size_kb = round(p.stat().st_size / 1024, 1)
    try:
        im = Image.open(p)
        w, h = im.size
        frames = getattr(im, "n_frames", 1)
        im_rgb = im.convert("RGB").resize((96, 96))
        px = list(im_rgb.getdata())
        n = len(px)
        mr = sum(c[0] for c in px) / n
        mg = sum(c[1] for c in px) / n
        mb = sum(c[2] for c in px) / n
        vr = sum((c[0] - mr) ** 2 for c in px) / n
        vg = sum((c[1] - mg) ** 2 for c in px) / n
        vb = sum((c[2] - mb) ** 2 for c in px) / n
        std = round((vr + vg + vb) / 3, 1)
        rows.append({
            "path": rel,
            "ext": ext,
            "kb": size_kb,
            "w": w,
            "h": h,
            "frames": frames,
            "aspect": round(w / h, 2) if h else 0,
            "mean_rgb": f"({mr:.0f},{mg:.0f},{mb:.0f})",
            "std": std,
        })
    except Exception as e:
        errs.append((rel, str(e)[:60]))

with open(OUT_CSV, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["path", "ext", "kb", "w", "h", "frames", "aspect", "mean_rgb", "std"])
    w.writeheader()
    for r in rows:
        w.writerow(r)

print(f"TOTAL: {len(rows)} files scanned")
print("BY_EXT:", dict(Counter(r["ext"] for r in rows)))
# 看看尺寸分布
print("TOP_DIRS:", dict(Counter(Path(r["path"]).parent.as_posix() for r in rows).most_common(8)))
# 高方差候选（可能含 sprite / 离散插画）
high = sorted(rows, key=lambda r: -r["std"])[:15]
print("\nHIGH_STD (top15, 可能是图标sprite/插画):")
for r in high:
    print(f"  std={r['std']:>6}  {r['w']}x{r['h']}  {r['ext']}  {r['mean_rgb']}  {r['path']}")
# 低方差候选（纯色 / 近纯纹理背景）
low = sorted([r for r in rows if r["std"] < 200], key=lambda r: r["std"])[:10]
print("\nLOW_STD (bottom10, 近纯色/极简背景):")
for r in low:
    print(f"  std={r['std']:>6}  {r['w']}x{r['h']}  {r['ext']}  {r['mean_rgb']}  {r['path']}")
# 多帧 gif（可能是动画插画）
multif = [r for r in rows if r["ext"] == ".gif" and r["frames"] > 1]
print(f"\nMULTI_FRAME_GIFS: {len(multif)}")
for r in sorted(multif, key=lambda r: -r["frames"])[:10]:
    print(f"  frames={r['frames']:>3}  {r['w']}x{r['h']}  {r['kb']}kb  {r['path']}")

if errs:
    print(f"\nERRS: {len(errs)}")
    for r, e in errs[:5]:
        print(f"  {r}: {e}")
print(f"\nCSV: {OUT_CSV}")