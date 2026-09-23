#!/usr/bin/env python3
"""技术可行性探针（039 批 3 前置，仓库外执行）：
验证『线稿由绘制代码产出 → 白板引擎渲染』这条链路是否成立。
产出：probe.png（线稿）+ probe.annotation.json（标注）。不写任何文字（风格包硬约束：源图禁文字）。
"""
import json, math, random
from PIL import Image, ImageDraw

W, H = 1280, 720
PAPER = (245, 235, 215)      # #F5EBD7
INK   = (62, 62, 62)
ACC_R = (200, 70, 60)        # 少量概念色点缀（红）
ACC_O = (225, 140, 45)       # 橙
ACC_B = (70, 110, 170)       # 蓝

random.seed(20260923)
img = Image.new("RGB", (W, H), PAPER)
d = ImageDraw.Draw(img)

def j_line(p1, p2, w=3, color=INK, jitter=1.6):
    """带手抖的线，模拟手绘"""
    x1, y1 = p1; x2, y2 = p2
    steps = max(2, int(math.hypot(x2 - x1, y2 - y1) // 14))
    pts = []
    for i in range(steps + 1):
        t = i / steps
        pts.append((x1 + (x2 - x1) * t + random.uniform(-jitter, jitter),
                    y1 + (y2 - y1) * t + random.uniform(-jitter, jitter)))
    d.line(pts, fill=color, width=w, joint="curve")

def j_rect(box, w=3, color=INK):
    x0, y0, x1, y1 = box
    j_line((x0, y0), (x1, y0), w, color)
    j_line((x1, y0), (x1, y1), w, color)
    j_line((x1, y1), (x0, y1), w, color)
    j_line((x0, y1), (x0, y0), w, color)

def j_ellipse(center, rx, ry, w=3, color=INK):
    cx, cy = center
    pts = []
    n = 64
    for i in range(n + 1):
        a = 2 * math.pi * i / n
        pts.append((cx + rx * math.cos(a) + random.uniform(-1.4, 1.4),
                    cy + ry * math.sin(a) + random.uniform(-1.4, 1.4)))
    d.line(pts, fill=color, width=w, joint="curve")

# ---- 元素A：店面（场景铺垫）----
j_rect((80, 200, 430, 580))
j_line((60, 200), (450, 200), 4)                       # 雨棚横梁
j_line((80, 380), (430, 380), 2)                       # 门楣
j_rect((200, 420, 320, 580))                           # 门
j_line((260, 420), (260, 580), 2)                      # 门缝
j_rect((120, 230, 390, 290))                           # 招牌（空板，不写字）
for i in range(5):                                     # 雨棚褶
    x = 70 + i * 90
    j_line((x, 200), (x + 45, 175), 3, ACC_R)

# ---- 元素B：时钟 + 老板（关键人/物）----
j_ellipse((620, 250), 62, 62)
j_line((620, 250), (620, 205), 3)                      # 分针
j_line((620, 250), (658, 268), 3)                      # 时针
for k in range(12):
    a = 2 * math.pi * k / 12
    d.ellipse((620 + 54 * math.cos(a) - 2, 250 + 54 * math.sin(a) - 2,
               620 + 54 * math.cos(a) + 2, 250 + 54 * math.sin(a) + 2), fill=INK)
# 老板（简笔人物）
j_ellipse((790, 400), 30, 32)                          # 头
j_line((790, 432), (790, 530), 3)                      # 身体
j_line((790, 455), (745, 500), 3)                      # 左臂
j_line((790, 455), (838, 498), 3)                      # 右臂
j_line((790, 530), (760, 590), 3)                      # 左腿
j_line((790, 530), (820, 590), 3)                      # 右腿
d.ellipse((782, 392, 788, 398), fill=INK)              # 眼
d.ellipse((794, 392, 800, 398), fill=INK)

# ---- 元素C：空桌椅（动作冲突/现状）----
for i, x in enumerate((960, 1120)):
    j_ellipse((x, 470), 52, 16)                        # 桌面
    j_line((x - 34, 486), (x - 40, 560), 3)            # 桌腿
    j_line((x + 34, 486), (x + 40, 560), 3)
    j_line((x - 84, 500), (x - 84, 560), 3)            # 椅子背
    j_line((x - 84, 520), (x - 56, 520), 3)
    j_line((x + 84, 500), (x + 84, 560), 3)
    j_line((x + 56, 520), (x + 84, 520), 3)

# ---- 元素D：券（结果/工具出现）----
j_rect((480, 90, 700, 190), 3, ACC_O)
j_line((500, 140), (680, 140), 2, ACC_O)               # 虚线位（示意，不写字）
for x in range(500, 681, 24):
    d.ellipse((x - 2, 138, x + 2, 142), fill=ACC_O)
j_ellipse((700, 140), 12, 12, 3, ACC_O)                # 券角圆孔
j_line((480, 90), (470, 80), 2, ACC_B)                 # 蓝色小点缀（动势）

img.save("/tmp/srt-wb-probe/probe.png")

ann = {
  "sceneId": "probe-01",
  "canvas": {"width": W, "height": H},
  "storyBasis": "探针：店面与时钟（场景铺垫）→ 老板（关键人物）→ 空桌椅（现状冲突）→ 券（工具出现）。仅验证链路，不作内容交付。",
  "sceneDurationMs": 8000,
  "elements": [
    {"id": "shop", "label": "店面与时钟", "sequence": 1, "narrativeRole": "场景铺垫",
     "subtitle": "", "type": "structure",
     "region": {"x": 55, "y": 165, "width": 400, "height": 425},
     "reveal": {"direction": "top_to_bottom", "startMs": 300, "durationMs": 2000,
                "maskPaddingPx": 22, "protectedRegions": []},
     "handPath": {"start": [255, 175], "end": [255, 585], "easing": "easeInOut"}},
    {"id": "boss", "label": "老板（简笔人物）", "sequence": 2, "narrativeRole": "关键人物",
     "subtitle": "", "type": "character",
     "region": {"x": 700, "y": 355, "width": 180, "height": 245},
     "reveal": {"direction": "top_to_bottom", "startMs": 2400, "durationMs": 1700,
                "maskPaddingPx": 22, "protectedRegions": []},
     "handPath": {"start": [790, 365], "end": [790, 595], "easing": "easeInOut"}},
    {"id": "empty_tables", "label": "空桌椅", "sequence": 3, "narrativeRole": "现状冲突",
     "subtitle": "", "type": "structure",
     "region": {"x": 860, "y": 440, "width": 340, "height": 130},
     "reveal": {"direction": "left_to_right", "startMs": 4200, "durationMs": 1600,
                "maskPaddingPx": 22, "protectedRegions": []},
     "handPath": {"start": [870, 505], "end": [1190, 505], "easing": "easeInOut"}},
    {"id": "coupon", "label": "券", "sequence": 4, "narrativeRole": "工具出现",
     "subtitle": "", "type": "object",
     "region": {"x": 455, "y": 70, "width": 265, "height": 135},
     "reveal": {"direction": "left_to_right", "startMs": 6100, "durationMs": 1300,
                "maskPaddingPx": 22, "protectedRegions": []},
     "handPath": {"start": [465, 140], "end": [715, 140], "easing": "easeInOut"}}
  ]
}
json.dump(ann, open("/tmp/srt-wb-probe/probe.annotation.json", "w", encoding="utf-8"),
          ensure_ascii=False, indent=2)
print("OK: probe.png + probe.annotation.json")
