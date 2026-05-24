from PIL import Image, ImageDraw

def make_icon(size):
    sc = size / 512
    def s(v): return int(round(v * sc))
    def mix(r,g,b,op,bg=(10,10,18)):
        return (int(bg[0]+(r-bg[0])*op), int(bg[1]+(g-bg[1])*op), int(bg[2]+(b-bg[2])*op))

    GOLD=(212,168,83); BG=(10,10,18); BOOK=(28,28,48)
    img=Image.new('RGB',(size,size),BG)
    draw=ImageDraw.Draw(img)

    draw.rounded_rectangle([s(76),s(56),s(436),s(456)],radius=s(20),fill=BOOK)
    draw.rounded_rectangle([s(76),s(56),s(436),s(456)],radius=s(20),outline=GOLD,width=max(1,s(7)))
    draw.rounded_rectangle([s(76),s(56),s(118),s(456)],radius=s(12),fill=GOLD)

    for x1,y1,x2,y2,op in [
        (142,128,394,137,0.70),(142,166,352,173,0.45),(142,198,370,205,0.45),
        (142,230,310,237,0.38),(142,262,338,269,0.38)]:
        draw.rounded_rectangle([s(x1),s(y1),s(x2),s(y2)],radius=s(4),fill=mix(*GOLD,op))

    pts=[(256,298),(268,334),(306,334),(276,356),(287,392),
         (256,370),(225,392),(236,356),(206,334),(244,334)]
    draw.polygon([(s(x),s(y)) for x,y in pts],fill=mix(*GOLD,0.92))
    return img

out='/home/asim/Desktop/temalar/son  kuran/'
make_icon(512).save(out+'icon-512.png')
make_icon(192).save(out+'icon-192.png')
print('OK')
