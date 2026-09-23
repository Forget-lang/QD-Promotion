#!/usr/bin/env python3
"""画稿质量对照（批 2.5 补测）：同一引擎、同一参数，只换画稿精度。
v1 = 几何简笔（现有水平）｜v2 = 精修稿（曲线/纹理/线宽分级/排线阴影）
目的：证明"成片粗糙度取决于画稿，而非引擎能力是否用尽"。
"""
import json, math, random
from PIL import Image, ImageDraw

W, H = 1080, 1920
PAPER = (245, 235, 215); INK = (58, 58, 58); INK2 = (96, 96, 96)
RED = (198, 72, 62); ORANGE = (222, 141, 46)
random.seed(7)

def mk(): 
    im = Image.new("RGB", (W, H), PAPER)
    return im, ImageDraw.Draw(im)

# ---------- 通用笔触 ----------
def jline(d, p1, p2, w=3, c=INK, j=1.2):
    x1,y1 = p1; x2,y2 = p2
    n = max(2, int(math.hypot(x2-x1, y2-y1)//10))
    d.line([(x1+(x2-x1)*i/n+random.uniform(-j,j), y1+(y2-y1)*i/n+random.uniform(-j,j)) for i in range(n+1)],
           fill=c, width=int(round(w)), joint="curve")

def bez(d, pts, w=3, c=INK, n=40, j=0.8):
    """三次贝塞尔（pts=[p0,p1,p2,p3]）"""
    out=[]
    for i in range(n+1):
        t=i/n; mt=1-t
        x = mt**3*pts[0][0] + 3*mt*mt*t*pts[1][0] + 3*mt*t*t*pts[2][0] + t**3*pts[3][0]
        y = mt**3*pts[0][1] + 3*mt*mt*t*pts[1][1] + 3*mt*t*t*pts[2][1] + t**3*pts[3][1]
        out.append((x+random.uniform(-j,j), y+random.uniform(-j,j)))
    d.line(out, fill=c, width=int(round(w)), joint="curve")

def hatch(d, box, step=16, w=1, c=INK2, ang=35):
    """排线阴影"""
    x0,y0,x1,y1 = box
    dx = math.tan(math.radians(ang))
    x = x0 - (y1-y0)*dx
    while x < x1:
        px0 = max(x, x0); py0 = y0 + (px0-x)/dx if dx else y0
        px1 = min(x+(y1-y0)*dx, x1); py1 = y1
        if px1 > px0: d.line([(px0,py0),(px1,py1)], fill=c, width=w)
        x += step

# ---------- v1：几何简笔（现状做法） ----------
im1, d1 = mk()
x0,y0,x1,y1 = 140, 300, 940, 1180
d1.rectangle((x0,y0,x1,y1), outline=INK, width=4)
jline(d1,(x0-20,y0),(x1+20,y0),4)                       # 横梁
for i in range(5):
    xx = x0 + i*(x1-x0)/4
    jline(d1,(xx,y0),(xx+50,y0-40),3,RED)               # 雨棚
d1.rectangle((x0+(x1-x0)*0.38, y0+(y1-y0)*0.55, x0+(x1-x0)*0.62, y1), outline=INK, width=4)  # 门
jline(d1,((x0+(x1-x0)*0.38+ (x1-x0)*0.62)/2-0, y0+(y1-y0)*0.55),((x0+(x1-x0)*0.38+ (x1-x0)*0.62)/2-0, y1),3)  # 门缝
d1.rectangle((x0+60, y0+50, x0+420, y0+150), outline=INK, width=3)   # 招牌
# 时钟
cx,cy,r = 880, 250, 90
d1.ellipse((cx-r,cy-r,cx+r,cy+r), outline=INK, width=4)
for k in range(12):
    a=2*math.pi*k/12
    d1.ellipse((cx+(r-16)*math.cos(a)-3, cy+(r-16)*math.sin(a)-3, cx+(r-16)*math.cos(a)+3, cy+(r-16)*math.sin(a)+3), fill=INK)
jline(d1,(cx,cy),(cx+40,cy-40),4,RED); jline(d1,(cx,cy),(cx-35,cy-38),4)
im1.save("qtest-v1.png")

# ---------- v2：精修稿（曲线/纹理/线宽分级/排线） ----------
im2, d2 = mk()
# 屋檐：曲线挑檐 + 瓦楞
bez(d2, [(110,330),(300,270),(700,270),(970,330)], 5, INK)
for i in range(11):
    t = i/10; xx = 120 + t*840
    yy = 330 - (1-abs(t-0.5)*2)*58
    jline(d2,(xx,yy),(xx,yy+26),2,INK2,0.8)
# 墙体：轮廓 5px
jline(d2,(150,330),(150,1180),5); jline(d2,(930,330),(930,1180),5); jline(d2,(150,1180),(930,1180),5)
# 砖纹（细节 2px，仅下半墙）
for row in range(10):
    yy = 700 + row*48
    if yy > 1170: break
    jline(d2,(152,yy),(928,yy),1.6,INK2,0.6)
    off = 0 if row%2==0 else 42
    for xx in range(152+off, 928, 84):
        jline(d2,(xx,yy),(xx,yy+48),1.4,INK2,0.5)
# 窗（双线框 + 窗棂 + 玻璃反光斜线）
bez(d2, [(220,400),(240,380),(430,380),(450,400)], 3.5, INK)
jline(d2,(220,400),(220,560),3.5); jline(d2,(450,400),(450,560),3.5); jline(d2,(220,560),(450,560),3.5)
jline(d2,(335,400),(335,560),2.4,INK2); jline(d2,(220,480),(450,480),2.4,INK2)
jline(d2,(250,540),(300,430),1.6,INK2,0.6); jline(d2,(330,548),(398,430),1.6,INK2,0.6)
# 门（拱顶 + 门框双线 + 把手 + 门内排线）
bez(d2, [(470,700),(480,640),(620,640),(630,700)], 4, INK)
jline(d2,(470,700),(470,1180),4); jline(d2,(630,700),(630,1180),4)
jline(d2,(482,706),(482,1176),2,INK2); jline(d2,(618,706),(618,1176),2,INK2)
d2.ellipse((600,930,616,946), outline=INK, width=3)
hatch(d2,(474,712,626,1174), step=26, w=1, c=(150,148,142), ang=38)
# 招牌（木纹 + 挂绳 + 底部阴影线）
bez(d2, [(190,360),(200,352),(430,352),(440,362)], 4, INK)
jline(d2,(190,362),(190,470),4); jline(d2,(440,362),(440,470),4); jline(d2,(190,470),(440,470),4)
for i in range(6):
    yy = 372 + i*17
    bez(d2, [(196,yy),(260,yy-4),(370,yy+4),(434,yy)], 1.5, INK2, 24, 0.5)
jline(d2,(196,352),(230,318),2.2,INK2); jline(d2,(434,352),(400,318),2.2,INK2)
hatch(d2,(196,474,434,486), step=12, w=1, c=(150,148,142), ang=0)
# 雨棚：弧形褶皱 + 端点小圆
for i in range(5):
    xx = 160 + i*196
    bez(d2, [(xx,332),(xx+30,300),(xx+60,300),(xx+92,332)], 3, RED)
    d2.ellipse((xx+86,326,xx+98,338), outline=RED, width=2)
# 地面阴影排线
hatch(d2,(150,1186,930,1224), step=18, w=1, c=(170,166,158), ang=12)
# 时钟（双圈 + 12 刻度短线 + 分针红 + 中心点）
cx,cy,r = 880, 250, 96
jline(d2,(cx-r,cy),(cx+r,cy),0,INK)  # 占位（不画）
circ=[(cx+r*math.cos(2*math.pi*i/90), cy+r*math.sin(2*math.pi*i/90)) for i in range(91)]
d2.line(circ+[circ[0]], fill=INK, width=5, joint="curve")
jline(d2,(cx-r-8,cy),(cx+r+8,cy),3,INK2); jline(d2,(cx,cy-r-8),(cx,cy+r+8),3,INK2)
for k in range(12):
    a=2*math.pi*k/12
    jline(d2,(cx+(r-14)*math.cos(a),cy+(r-14)*math.sin(a)),(cx+(r-4)*math.cos(a),cy+(r-4)*math.sin(a)),2.4,INK)
jline(d2,(cx,cy),(cx+46,cy-44),4,RED); jline(d2,(cx,cy),(cx-40,cy-40),4)
d2.ellipse((cx-6,cy-6,cx+6,cy+6), outline=INK, width=2)
im2.save("qtest-v2.png")

# ---------- 同一 annotation（同区域/同时序，只换图） ----------
ann = {"sceneId":"qtest","canvas":{"width":W,"height":H},
 "storyBasis":"画稿质量对照：同引擎同参数，仅换画稿精度。",
 "sceneDurationMs":6000,
 "elements":[
   {"id":"shop","label":"店面（含钟）","sequence":1,"narrativeRole":"对照样本","subtitle":"","type":"structure",
    "region":{"x":100,"y":270,"width":900,"height":1000},
    "reveal":{"direction":"top_to_bottom","startMs":300,"durationMs":4700,"maskPaddingPx":30,"protectedRegions":[]},
    "handPath":{"start":[540,300],"end":[540,1250],"easing":"easeInOut"}}]}
json.dump(ann, open("qtest.annotation.json","w",encoding="utf-8"), ensure_ascii=False, indent=2)
print("OK: qtest-v1.png / qtest-v2.png / qtest.annotation.json")
