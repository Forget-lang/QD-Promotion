#!/usr/bin/env python3
"""批 2.5 竖版补做：与横版同稿（director-sheet-30s.md），仅画幅改为交付规格 1080×1920（9:16）。
原因：横版 1280×720 只是渲染提速用的测试尺寸；抖音/小红书交付必须竖版（R3 §7.4「画幅 1080×1920 @30fps，9:16 竖版」）。
布局：2 列 × 3 行；揭示顺序＝左→右、上→下（对应导演稿六节点）。
"""
import json, math, random
from PIL import Image, ImageDraw

W, H = 1080, 1920
PAPER = (245, 235, 215); INK = (62, 62, 62); MUTED = (150, 148, 142)
RED = (198, 72, 62); ORANGE = (222, 141, 46); BLUE = (74, 112, 170)
random.seed(20260923)
img = Image.new("RGB", (W, H), PAPER); d = ImageDraw.Draw(img)

def L(p1, p2, w=3, c=INK, j=1.5):
    x1, y1 = p1; x2, y2 = p2
    n = max(2, int(math.hypot(x2-x1, y2-y1)//12))
    pts = [(x1+(x2-x1)*i/n+random.uniform(-j,j), y1+(y2-y1)*i/n+random.uniform(-j,j)) for i in range(n+1)]
    d.line(pts, fill=c, width=int(round(w)), joint="curve")

def poly(pts, w=3, c=INK, close=True, j=1.4):
    for i in range(len(pts)-1): L(pts[i], pts[i+1], w, c, j)
    if close: L(pts[-1], pts[0], w, c, j)

def E(cx, cy, rx, ry, w=3, c=INK, j=1.3, n=72):
    pts=[(cx+rx*math.cos(2*math.pi*i/n)+random.uniform(-j,j), cy+ry*math.sin(2*math.pi*i/n)+random.uniform(-j,j)) for i in range(n+1)]
    d.line(pts, fill=c, width=int(round(w)), joint="curve")

def R(box, w=3, c=INK, r=14):
    x0,y0,x1,y1 = box
    for a in ((x0,y0,x0+2*r,y0+2*r,180,270),(x1-2*r,y0,x1,y0+2*r,270,360),(x1-2*r,y1-2*r,x1,y1,0,90),(x0,y1-2*r,x0+2*r,y1,90,180)):
        d.arc(a[:4], a[4], a[5], fill=c, width=int(round(w)))
    L((x0+r,y0),(x1-r,y0),w,c); L((x1,y0+r),(x1,y1-r),w,c); L((x1-r,y1),(x0+r,y1),w,c); L((x0,y1-r),(x0,y0+r),w,c)

def person(cx, cy, s=1.0, seat=False):
    E(cx, cy-46*s, 13*s, 14*s, 3, INK)
    poly([(cx-13*s,cy-30*s),(cx+13*s,cy-30*s),(cx+10*s,cy+4*s),(cx-10*s,cy+4*s)], 3, INK)
    if seat:
        L((cx-9*s,cy-30*s),(cx-20*s,cy-8*s),2.6); L((cx+10*s,cy-30*s),(cx+20*s,cy-8*s),2.6)
        L((cx-7*s,cy+3*s),(cx-16*s,cy+22*s),2.6); L((cx+7*s,cy+3*s),(cx+16*s,cy+22*s),2.6)
    else:
        L((cx-9*s,cy-30*s),(cx-22*s,cy-6*s),2.6); L((cx+10*s,cy-30*s),(cx+22*s,cy-6*s),2.6)
        L((cx-6*s,cy+4*s),(cx-12*s,cy+34*s),2.6); L((cx+6*s,cy+4*s),(cx+12*s,cy+34*s),2.6)

def table(cx, cy, s=1.0):
    E(cx, cy, 42*s, 11*s, 3, INK)
    L((cx-26*s,cy+8*s),(cx-30*s,cy+54*s),3); L((cx+26*s,cy+8*s),(cx+30*s,cy+54*s),3)

def chair(cx, cy, s=1.0, flip=False):
    dx = -1 if flip else 1
    L((cx+dx*40*s,cy-24*s),(cx+dx*40*s,cy+30*s),3); L((cx+dx*40*s,cy-4*s),(cx+dx*18*s,cy-4*s),3)

def spark(cx, cy, s=1.0, c=RED):
    for a in range(0,360,45):
        r1,r2 = 6*s,14*s
        L((cx+r1*math.cos(math.radians(a)),cy+r1*math.sin(math.radians(a))),
          (cx+r2*math.cos(math.radians(a)),cy+r2*math.sin(math.radians(a))),2.4,c,0.8)

def clock(cx, cy, r=34):
    E(cx,cy,r,r,3,INK)
    for k in range(12):
        a=2*math.pi*k/12
        d.ellipse((cx+(r-9)*math.cos(a)-2, cy+(r-9)*math.sin(a)-2, cx+(r-9)*math.cos(a)+2, cy+(r-9)*math.sin(a)+2), fill=INK)
    L((cx,cy),(cx+r*0.45,cy-r*0.5),3,RED,0.6); L((cx,cy),(cx-r*0.35,cy-r*0.55),3,INK,0.6)

def bulb(cx, cy, s=1.0):
    E(cx,cy,20*s,22*s,3,ORANGE)
    L((cx-9*s,cy+20*s),(cx+9*s,cy+20*s),3,ORANGE); L((cx-6*s,cy+27*s),(cx+6*s,cy+27*s),3,ORANGE)
    for a in (200,250,290,340):
        L((cx+30*s*math.cos(math.radians(a)),cy+30*s*math.sin(math.radians(a))),
          (cx+40*s*math.cos(math.radians(a)),cy+40*s*math.sin(math.radians(a))),2.4,ORANGE,0.7)

def coupon(cx, cy, w=130, h=58):
    R((cx-w//2,cy-h//2,cx+w//2,cy+h//2),3,ORANGE,12)
    d.ellipse((cx+w//2-7,cy-7,cx+w//2+7,cy+7), fill=PAPER, outline=ORANGE, width=2)
    for x in range(int(cx-w//2)+18, int(cx+w//2)-14, 20):
        d.ellipse((x-2,cy-2,x+2,cy+2), fill=ORANGE)

def phone(cx, cy, s=1.0):
    R((cx-40*s,cy-70*s,cx+40*s,cy+70*s),3,INK,10)
    L((cx-40*s,cy-52*s),(cx+40*s,cy-52*s),2); L((cx-40*s,cy+56*s),(cx+40*s,cy+56*s),2)

def snow(cx, cy, s=1.0, c=BLUE):
    for a in (0,60,120):
        L((cx-12*s*math.cos(math.radians(a)),cy-12*s*math.sin(math.radians(a))),
          (cx+12*s*math.cos(math.radians(a)),cy+12*s*math.sin(math.radians(a))),2.2,c,0.6)

def arrow_up(cx, cy, s=1.0, c=ORANGE):
    L((cx,cy+18*s),(cx,cy-18*s),3,c)
    poly([(cx-9*s,cy-6*s),(cx,cy-19*s),(cx+9*s,cy-6*s)],3,c,close=False)

def shrug(cx, cy, s=1.0):
    E(cx,cy-40*s,14*s,15*s,3,INK)
    poly([(cx-14*s,cy-24*s),(cx+14*s,cy-24*s),(cx+11*s,cy+16*s),(cx-11*s,cy+16*s)],3,INK)
    L((cx+8*s,cy-20*s),(cx+22*s,cy-40*s),2.8); E(cx+24*s,cy-44*s,6*s,6*s,2.6,INK)
    L((cx-11*s,cy-22*s),(cx-24*s,cy-2*s),2.8)
    L((cx-7*s,cy+15*s),(cx-13*s,cy+52*s),2.8); L((cx+7*s,cy+15*s),(cx+13*s,cy+52*s),2.8)
    for k in (-1,1): L((cx+k*22*s,cy-62*s),(cx+k*30*s,cy-72*s),2.2,MUTED,0.5)

def storefront(x0, y0, x1, y1):
    R((x0,y0,x1,y1),3,INK,16)
    L((x0-14,y0),(x1+14,y0),4)
    for i in range(4):
        x = x0 + (i/3)*(x1-x0); L((x,y0),(x+34,y0-26),3,RED)
    R((x0+(x1-x0)*0.36, y0+(y1-y0)*0.55, x0+(x1-x0)*0.64, y1),3,INK,8)

# ===== 2 列 × 3 行 单元格中心 =====
def cell(i, j): return (294 + i*540, 336 + j*624)
c00, c10, c01, c11, c02, c12 = cell(0,0), cell(1,0), cell(0,1), cell(1,1), cell(0,2), cell(1,2)

# E1 店面 + 时钟
cx, cy = c00
storefront(cx-165, cy-150, cx+75, cy+80)
clock(cx+130, cy-140, 34)

# E2 周五满座（3 桌 + 人）
cx, cy = c10
for k, tx in enumerate((cx-150, cx, cx+150)):
    table(tx, cy-20, 0.9)
    person(tx-18, cy-44, 0.66, seat=True); person(tx+22, cy-44, 0.66, seat=True)
    chair(tx-42, cy+4, 0.85, flip=True); chair(tx+42, cy+4, 0.85)
spark(cx-200, cy-160, 0.9, RED); spark(cx+195, cy-140, 0.85, ORANGE)

# E3 周一空桌
cx, cy = c01
for tx in (cx-150, cx, cx+150):
    table(tx, cy-20, 0.9)
    chair(tx-42, cy+4, 0.85, flip=True); chair(tx+42, cy+4, 0.85)
snow(cx-200, cy-150, 1.0, BLUE); snow(cx+190, cy-165, 0.85, BLUE)

# E4 老板挠头 + 灯泡
cx, cy = c11
shrug(cx-90, cy+40, 1.25)
bulb(cx+105, cy-80, 1.3)

# E5 券 + 时钟 + 手机
cx, cy = c02
clock(cx-160, cy+20, 34)
coupon(cx+20, cy-60, 140, 62)
arrow_up(cx+20, cy+40, 1.1, ORANGE)
phone(cx+160, cy+40, 0.9)

# E6 回暖满座
cx, cy = c12
for tx in (cx-150, cx, cx+150):
    table(tx, cy-20, 0.9)
    person(tx-18, cy-44, 0.66, seat=True); person(tx+22, cy-44, 0.66, seat=True)
spark(cx-200, cy-160, 0.9, RED); spark(cx+190, cy-150, 0.9, ORANGE)

img.save("scene-01-v.png")

def region(i, j, pad=28):
    cx, cy = cell(i, j)
    return {"x": int(cx-246+pad), "y": int(cy-288+pad), "width": int(492-2*pad), "height": int(576-2*pad)}

ann = {
  "sceneId": "demo-30s-vertical",
  "canvas": {"width": W, "height": H},
  "storyBasis": "烧烤店周中闲时（竖版）：周五满座 vs 周一空桌 → 老板诊断 → 机制（到点开抢＋工作日限定）→ 回暖。内容蒸馏自 g11 同题；批 2.5 验证用，非交付。",
  "sceneDurationMs": 28000,
  "elements": [
    {"id":"e1_shop","label":"店面与时钟","sequence":1,"narrativeRole":"场景铺垫（导演稿节点1）","subtitle":"","type":"structure",
     "region":region(0,0),"reveal":{"direction":"top_to_bottom","startMs":600,"durationMs":3400,"maskPaddingPx":26,"protectedRegions":[]},
     "handPath":{"start":[294,120],"end":[294,760],"easing":"easeInOut"}},
    {"id":"e2_friday","label":"周五满座","sequence":2,"narrativeRole":"对比高点（导演稿节点2）","subtitle":"","type":"character",
     "region":region(1,0),"reveal":{"direction":"top_to_bottom","startMs":4200,"durationMs":4300,"maskPaddingPx":26,"protectedRegions":[]},
     "handPath":{"start":[834,120],"end":[834,760],"easing":"easeInOut"}},
    {"id":"e3_monday","label":"周一空桌","sequence":3,"narrativeRole":"对比低点（导演稿节点3）","subtitle":"","type":"structure",
     "region":region(0,1),"reveal":{"direction":"top_to_bottom","startMs":8700,"durationMs":4300,"maskPaddingPx":26,"protectedRegions":[]},
     "handPath":{"start":[294,740],"end":[294,1380],"easing":"easeInOut"}},
    {"id":"e4_boss","label":"老板挠头与灯泡","sequence":4,"narrativeRole":"转折（导演稿节点4）","subtitle":"","type":"character",
     "region":region(1,1),"reveal":{"direction":"top_to_bottom","startMs":13200,"durationMs":3800,"maskPaddingPx":26,"protectedRegions":[]},
     "handPath":{"start":[834,740],"end":[834,1380],"easing":"easeInOut"}},
    {"id":"e5_mechanism","label":"券·到点·领取","sequence":5,"narrativeRole":"机制兑现（导演稿节点5）","subtitle":"","type":"object",
     "region":region(0,2),"reveal":{"direction":"top_to_bottom","startMs":17200,"durationMs":5300,"maskPaddingPx":26,"protectedRegions":[]},
     "handPath":{"start":[294,1360],"end":[294,1900],"easing":"easeInOut"}},
    {"id":"e6_recover","label":"回暖满座","sequence":6,"narrativeRole":"结果与收口（导演稿节点6）","subtitle":"","type":"character",
     "region":region(1,2),"reveal":{"direction":"top_to_bottom","startMs":22700,"durationMs":4600,"maskPaddingPx":26,"protectedRegions":[]},
     "handPath":{"start":[834,1360],"end":[834,1900],"easing":"easeInOut"}}
  ]
}
json.dump(ann, open("scene-01-v.annotation.json","w",encoding="utf-8"), ensure_ascii=False, indent=2)
print("OK: scene-01-v.png + scene-01-v.annotation.json（1080×1920）")
