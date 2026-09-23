#!/usr/bin/env python3
"""批 2.5 验证片段（g11 同题蒸馏 · 30s）——线稿由绘制代码产出。
内容：烧烤店「周中闲时」——周五满座 vs 周一空桌 → 诊断 → 机制（到点开抢＋工作日限定）→ 回暖。
本脚本只负责"画"：分幕、元素顺序、时间信息由《导演稿》给定（见 director-sheet-30s.md）。
风格：纸底 #F5EBD7 ＋ 深灰素描线 ＋ 红/橙/蓝少量点缀；源图不出现任何文字/数字。
"""
import json, math, random
from PIL import Image, ImageDraw

W, H = 1280, 720
PAPER = (245, 235, 215)
INK = (62, 62, 62)
MUTED = (150, 148, 142)
RED = (198, 72, 62)
ORANGE = (222, 141, 46)
BLUE = (74, 112, 170)
random.seed(20260923)

img = Image.new("RGB", (W, H), PAPER)
d = ImageDraw.Draw(img)

def L(p1, p2, w=3, c=INK, j=1.5):
    x1, y1 = p1; x2, y2 = p2
    n = max(2, int(math.hypot(x2-x1, y2-y1)//12))
    pts = [(x1+(x2-x1)*i/n+random.uniform(-j,j), y1+(y2-y1)*i/n+random.uniform(-j,j)) for i in range(n+1)]
    d.line(pts, fill=c, width=int(round(w)), joint="curve")

def poly(pts, w=3, c=INK, close=True, j=1.4):
    for i in range(len(pts)-1):
        L(pts[i], pts[i+1], w, c, j)
    if close:
        L(pts[-1], pts[0], w, c, j)

def E(cx, cy, rx, ry, w=3, c=INK, j=1.3, n=72):
    pts = [(cx+rx*math.cos(2*math.pi*i/n)+random.uniform(-j,j), cy+ry*math.sin(2*math.pi*i/n)+random.uniform(-j,j)) for i in range(n+1)]
    d.line(pts, fill=c, width=int(round(w)), joint="curve")

def R(box, w=3, c=INK, r=14):
    x0, y0, x1, y1 = box
    d.arc((x0, y0, x0+2*r, y0+2*r), 180, 270, fill=c, width=w)
    d.arc((x1-2*r, y0, x1, y0+2*r), 270, 360, fill=c, width=w)
    d.arc((x1-2*r, y1-2*r, x1, y1), 0, 90, fill=c, width=w)
    d.arc((x0, y1-2*r, x0+2*r, y1), 90, 180, fill=c, width=w)
    L((x0+r, y0), (x1-r, y0), w, c); L((x1, y0+r), (x1, y1-r), w, c)
    L((x1-r, y1), (x0+r, y1), w, c); L((x0, y1-r), (x0, y0+r), w, c)

def person(cx, cy, s=1.0, seat=False):
    """简笔人：头 + 躯干(梯形) + 四肢（曲线）"""
    E(cx, cy-46*s, 13*s, 14*s, 3, INK)
    poly([(cx-13*s, cy-30*s), (cx+13*s, cy-30*s), (cx+10*s, cy+4*s), (cx-10*s, cy+4*s)], 3, INK)
    if seat:
        L((cx-9*s, cy-30*s), (cx-20*s, cy-8*s), 2.6); L((cx+10*s, cy-30*s), (cx+20*s, cy-8*s), 2.6)
        L((cx-7*s, cy+3*s), (cx-16*s, cy+22*s), 2.6); L((cx+7*s, cy+3*s), (cx+16*s, cy+22*s), 2.6)
    else:
        L((cx-9*s, cy-30*s), (cx-22*s, cy-6*s), 2.6); L((cx+10*s, cy-30*s), (cx+22*s, cy-6*s), 2.6)
        L((cx-6*s, cy+4*s), (cx-12*s, cy+34*s), 2.6); L((cx+6*s, cy+4*s), (cx+12*s, cy+34*s), 2.6)

def table(cx, cy, s=1.0):
    E(cx, cy, 42*s, 11*s, 3, INK)                     # 桌面
    L((cx-26*s, cy+8*s), (cx-30*s, cy+54*s), 3)       # 桌腿
    L((cx+26*s, cy+8*s), (cx+30*s, cy+54*s), 3)

def chair(cx, cy, s=1.0, flip=False):
    dx = -1 if flip else 1
    L((cx+dx*40*s, cy-24*s), (cx+dx*40*s, cy+30*s), 3)
    L((cx+dx*40*s, cy-4*s), (cx+dx*18*s, cy-4*s), 3)

def spark(cx, cy, s=1.0, c=RED):
    for a in range(0, 360, 45):
        r1, r2 = 6*s, 14*s
        L((cx+r1*math.cos(math.radians(a)), cy+r1*math.sin(math.radians(a))),
          (cx+r2*math.cos(math.radians(a)), cy+r2*math.sin(math.radians(a))), 2.4, c, 0.8)

def clock(cx, cy, r=34, marks=True):
    E(cx, cy, r, r, 3, INK)
    if marks:
        for k in range(12):
            a = 2*math.pi*k/12
            d.ellipse((cx+(r-9)*math.cos(a)-2, cy+(r-9)*math.sin(a)-2,
                       cx+(r-9)*math.cos(a)+2, cy+(r-9)*math.sin(a)+2), fill=INK)
    L((cx, cy), (cx+r*0.45, cy-r*0.5), 3, RED, 0.6)   # 分针（红，点缀）
    L((cx, cy), (cx-r*0.35, cy-r*0.55), 3, INK, 0.6)  # 时针

def bulb(cx, cy, s=1.0):
    E(cx, cy, 20*s, 22*s, 3, ORANGE)
    L((cx-9*s, cy+20*s), (cx+9*s, cy+20*s), 3, ORANGE)
    L((cx-6*s, cy+27*s), (cx+6*s, cy+27*s), 3, ORANGE)
    for a in (200, 250, 290, 340):
        L((cx+30*s*math.cos(math.radians(a)), cy+30*s*math.sin(math.radians(a))),
          (cx+40*s*math.cos(math.radians(a)), cy+40*s*math.sin(math.radians(a))), 2.4, ORANGE, 0.7)

def coupon(cx, cy, w=120, h=54):
    R((cx-w//2, cy-h//2, cx+w//2, cy+h//2), 3, ORANGE, 12)
    d.ellipse((cx+w//2-7, cy-7, cx+w//2+7, cy+7), fill=PAPER, outline=ORANGE, width=2)
    for x in range(int(cx-w//2)+18, int(cx+w//2)-14, 20):
        d.ellipse((x-2, cy-2, x+2, cy+2), fill=ORANGE)

def phone(cx, cy, s=1.0):
    R((cx-40*s, cy-70*s, cx+40*s, cy+70*s), 3, INK, 10)
    L((cx-40*s, cy-52*s), (cx+40*s, cy-52*s), 2)
    L((cx-40*s, cy+56*s), (cx+40*s, cy+56*s), 2)

def snow(cx, cy, s=1.0, c=BLUE):
    for a in (0, 60, 120):
        L((cx-12*s*math.cos(math.radians(a)), cy-12*s*math.sin(math.radians(a))),
          (cx+12*s*math.cos(math.radians(a)), cy+12*s*math.sin(math.radians(a))), 2.2, c, 0.6)

def arrow_up(cx, cy, s=1.0, c=ORANGE):
    L((cx, cy+18*s), (cx, cy-18*s), 3, c)
    poly([(cx-9*s, cy-6*s), (cx, cy-19*s), (cx+9*s, cy-6*s)], 3, c, close=False)

def shrug(cx, cy, s=1.0):
    """老板挠头：一只手抬到头侧"""
    E(cx, cy-40*s, 14*s, 15*s, 3, INK)
    poly([(cx-14*s, cy-24*s), (cx+14*s, cy-24*s), (cx+11*s, cy+16*s), (cx-11*s, cy+16*s)], 3, INK)
    L((cx+8*s, cy-20*s), (cx+22*s, cy-40*s), 2.8)      # 抬起的右手
    E(cx+24*s, cy-44*s, 6*s, 6*s, 2.6, INK)
    L((cx-11*s, cy-22*s), (cx-24*s, cy-2*s), 2.8)
    L((cx-7*s, cy+15*s), (cx-13*s, cy+52*s), 2.8)
    L((cx+7*s, cy+15*s), (cx+13*s, cy+52*s), 2.8)
    for k in (-1, 1):                                  # 困惑小线
        L((cx+k*22*s, cy-62*s), (cx+k*30*s, cy-72*s), 2.2, MUTED, 0.5)

def storefront(x0, y0, x1, y1):
    R((x0, y0, x1, y1), 3, INK, 16)
    L((x0-14, y0), (x1+14, y0), 4)                     # 雨棚梁
    for i in range(4):
        t = i/3
        x = x0 + t*(x1-x0)
        L((x, y0), (x+34, y0-26), 3, RED)              # 雨棚褶（红点缀）
    R((x0+(x1-x0)*0.36, y0+((y1-y0)*0.55), x0+(x1-x0)*0.64, y1), 3, INK, 8)  # 门

# ============ E1 店面 + 时钟 ============
storefront(60, 140, 330, 330)
clock(300, 150, 30)

# ============ E2 周五满座 ============
for i, tx in enumerate((470, 600, 730)):
    table(tx, 230, 0.86)
    person(tx-16, 208, 0.62, seat=True)
    person(tx+20, 208, 0.62, seat=True)
    chair(tx-40, 250, 0.8, flip=True); chair(tx+40, 250, 0.8)
spark(430, 130, 0.9, RED); spark(760, 150, 0.8, ORANGE)

# ============ E3 周一空桌 ============
for tx in (840, 950, 1060):
    table(tx, 230, 0.86)
    chair(tx-40, 250, 0.8, flip=True); chair(tx+40, 250, 0.8)
snow(1160, 130, 1.0, BLUE); snow(830, 132, 0.8, BLUE)

# ============ E4 老板挠头 + 灯泡 ============
shrug(150, 560, 1.05)
bulb(300, 470, 1.15)

# ============ E5 券 + 时钟 + 手机（到点开抢）============
clock(440, 520, 30)
coupon(620, 470, 130, 58)
arrow_up(620, 555, 1.0, ORANGE)
phone(760, 560, 0.8)

# ============ E6 回暖满座 ============
for tx in (860, 980, 1100):
    table(tx, 560, 0.86)
    person(tx-16, 538, 0.62, seat=True)
    person(tx+20, 538, 0.62, seat=True)
spark(838, 460, 0.9, RED); spark(1150, 470, 0.9, ORANGE)

img.save("scene-01.png")

ann = {
  "sceneId": "demo-30s",
  "canvas": {"width": W, "height": H},
  "storyBasis": "烧烤店周中闲时：周五满座 vs 周一空桌 → 老板诊断（缺的是来的理由）→ 机制（到点开抢＋工作日限定）→ 回暖。内容蒸馏自 g11 同题，仅作批 2.5 链路验证，不作交付。",
  "sceneDurationMs": 28000,
  "elements": [
    {"id": "e1_shop", "label": "店面与时钟", "sequence": 1, "narrativeRole": "场景铺垫（导演稿节点1）", "subtitle": "",
     "type": "structure", "region": {"x": 40, "y": 100, "width": 320, "height": 250},
     "reveal": {"direction": "top_to_bottom", "startMs": 600, "durationMs": 3400, "maskPaddingPx": 24, "protectedRegions": []},
     "handPath": {"start": [200, 110], "end": [200, 340], "easing": "easeInOut"}},
    {"id": "e2_friday", "label": "周五满座", "sequence": 2, "narrativeRole": "对比高点（导演稿节点2）", "subtitle": "",
     "type": "character", "region": {"x": 415, "y": 105, "width": 360, "height": 245},
     "reveal": {"direction": "left_to_right", "startMs": 4200, "durationMs": 4300, "maskPaddingPx": 24, "protectedRegions": []},
     "handPath": {"start": [425, 230], "end": [765, 230], "easing": "easeInOut"}},
    {"id": "e3_monday", "label": "周一空桌", "sequence": 3, "narrativeRole": "对比低点（导演稿节点3）", "subtitle": "",
     "type": "structure", "region": {"x": 790, "y": 105, "width": 450, "height": 245},
     "reveal": {"direction": "left_to_right", "startMs": 8700, "durationMs": 4300, "maskPaddingPx": 24, "protectedRegions": []},
     "handPath": {"start": [800, 230], "end": [1230, 230], "easing": "easeInOut"}},
    {"id": "e4_boss", "label": "老板挠头与灯泡", "sequence": 4, "narrativeRole": "转折（导演稿节点4：观众以为要打折）", "subtitle": "",
     "type": "character", "region": {"x": 55, "y": 380, "width": 300, "height": 300},
     "reveal": {"direction": "top_to_bottom", "startMs": 13200, "durationMs": 3800, "maskPaddingPx": 24, "protectedRegions": []},
     "handPath": {"start": [150, 390], "end": [150, 670], "easing": "easeInOut"}},
    {"id": "e5_mechanism", "label": "券·到点·领取", "sequence": 5, "narrativeRole": "机制兑现（导演稿节点5：不打折，到点开抢＋工作日限定）", "subtitle": "",
     "type": "object", "region": {"x": 385, "y": 400, "width": 430, "height": 280},
     "reveal": {"direction": "left_to_right", "startMs": 17200, "durationMs": 5300, "maskPaddingPx": 24, "protectedRegions": []},
     "handPath": {"start": [395, 520], "end": [805, 520], "easing": "easeInOut"}},
    {"id": "e6_recover", "label": "回暖满座", "sequence": 6, "narrativeRole": "结果与收口（导演稿节点6）", "subtitle": "",
     "type": "character", "region": {"x": 830, "y": 430, "width": 410, "height": 250},
     "reveal": {"direction": "left_to_right", "startMs": 22700, "durationMs": 4600, "maskPaddingPx": 24, "protectedRegions": []},
     "handPath": {"start": [840, 560], "end": [1230, 560], "easing": "easeInOut"}}
  ]
}
json.dump(ann, open("scene-01.annotation.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print("OK: scene-01.png + scene-01.annotation.json")
