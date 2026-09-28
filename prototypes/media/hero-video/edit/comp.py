"""가편집 합성: 초록 화면 자리에 화면을 원근 맞춰 끼우고, 모션 그래픽을 얹는다.

usage: comp.py <cut> <out.mp4>
"""
import subprocess, sys
import numpy as np
import cv2

S = "/private/tmp/claude-501/-Users-letscoding-Documents-workspace-github-LandingLetscoding/cfe85c87-5bad-4ee9-8104-17e233141f4c/scratchpad"
G = S + "/edit"
W, H, FPS = 1440, 1080, 30


def read_frames(path, start, dur):
    cmd = ["ffmpeg", "-v", "error", "-ss", str(start), "-t", str(dur), "-i", path,
           "-vf", f"fps={FPS},scale=-2:{H},crop={W}:{H}", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    n = len(raw) // (W * H * 3)
    return np.frombuffer(raw[: n * W * H * 3], np.uint8).reshape(n, H, W, 3).copy()


def read_clip(path, w, h, speed=1.0):
    cmd = ["ffmpeg", "-v", "error", "-i", path, "-vf", f"setpts=PTS/{speed},fps={FPS},scale={w}:{h}",
           "-f", "rawvideo", "-pix_fmt", "bgr24", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    n = len(raw) // (w * h * 3)
    return np.frombuffer(raw[: n * w * h * 3], np.uint8).reshape(n, h, w, 3)


def green_mask(f):
    hsv = cv2.cvtColor(f, cv2.COLOR_BGR2HSV)
    m = cv2.inRange(hsv, (40, 90, 80), (85, 255, 255))
    return cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))


def order(pts):
    pts = pts.reshape(4, 2).astype(np.float32)
    s, d = pts.sum(1), np.diff(pts, axis=1).ravel()
    return np.array([pts[s.argmin()], pts[d.argmin()], pts[s.argmax()], pts[d.argmax()]], np.float32)


def quad(mask):
    cs, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not cs:
        return None
    c = max(cs, key=cv2.contourArea)
    if cv2.contourArea(c) < 2000:
        return None
    hull = cv2.convexHull(c)
    peri = cv2.arcLength(hull, True)
    for eps in np.linspace(0.01, 0.08, 15):
        ap = cv2.approxPolyDP(hull, eps * peri, True)
        if len(ap) == 4:
            return order(ap)
    return order(cv2.boxPoints(cv2.minAreaRect(c)))


def key_insert(frame, q, ins):
    """frame 의 초록을 빼고 그 자리에 ins 를 원근 변환해 넣는다. 손이 화면을 가리면 손이 앞에 남는다."""
    h, w = ins.shape[:2]
    c = q.mean(0)
    q = c + (q - c) * 1.03  # 가장자리 초록 테두리가 남지 않게 살짝 키운다
    M = cv2.getPerspectiveTransform(np.float32([[0, 0], [w, 0], [w, h], [0, h]]), q)
    warped = cv2.warpPerspective(ins, M, (W, H), flags=cv2.INTER_LINEAR)
    region = np.zeros((H, W), np.uint8)
    cv2.fillConvexPoly(region, q.astype(np.int32), 255)
    m = cv2.bitwise_and(green_mask(frame), region)
    # 화면 안쪽의 작은 틈(베젤 반사 등)을 메운다
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    a = cv2.GaussianBlur(m, (0, 0), 1.2).astype(np.float32)[..., None] / 255.0
    out = frame.astype(np.float32)
    # 가장자리 초록 번짐 억제
    b, g, r = out[..., 0], out[..., 1], out[..., 2]
    edge = cv2.dilate(m, np.ones((9, 9), np.uint8)) > 0
    g[edge] = np.minimum(g[edge], np.maximum(r[edge], b[edge]))
    out = out * (1 - a) + warped.astype(np.float32) * a
    return out.clip(0, 255).astype(np.uint8)


def load_rgba(path, width=None):
    im = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    ys, xs = np.where(im[..., 3] > 0)
    im = im[ys.min(): ys.max() + 1, xs.min(): xs.max() + 1]
    if width:
        im = cv2.resize(im, (width, int(im.shape[0] * width / im.shape[1])), interpolation=cv2.INTER_AREA)
    return im


def ease(t):
    t = min(max(t, 0.0), 1.0)
    return 1 - (1 - t) ** 3


def overlay(frame, rgba, cx, cy, scale=1.0, alpha=1.0):
    if alpha <= 0 or scale <= 0:
        return frame
    im = cv2.resize(rgba, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA) if scale != 1 else rgba
    h, w = im.shape[:2]
    x0, y0 = int(cx - w / 2), int(cy - h / 2)
    X0, Y0, X1, Y1 = max(x0, 0), max(y0, 0), min(x0 + w, W), min(y0 + h, H)
    if X1 <= X0 or Y1 <= Y0:
        return frame
    sub = im[Y0 - y0: Y1 - y0, X0 - x0: X1 - x0]
    a = sub[..., 3:4].astype(np.float32) / 255.0 * alpha
    roi = frame[Y0:Y1, X0:X1].astype(np.float32)
    frame[Y0:Y1, X0:X1] = (roi * (1 - a) + sub[..., :3].astype(np.float32) * a).astype(np.uint8)
    return frame


def pop(t, t0, dur=0.28):
    """t0 에 톡 튀어나오는 크기·투명도 (0.85 → 1.04 → 1.0)."""
    p = (t - t0) / dur
    if p < 0:
        return 0.0, 0.0
    if p >= 1:
        return 1.0, 1.0
    s = 0.85 + 0.19 * ease(p) - 0.04 * max(0, (p - 0.7) / 0.3)
    return s, ease(p * 1.5)


def draw_cursor(img, x, y, click=0.0):
    pts = np.array([[0, 0], [0, 34], [9, 26], [16, 42], [22, 39], [15, 24], [27, 24]], np.int32) + [int(x), int(y)]
    if click > 0:
        r = int(10 + 26 * click)
        cv2.circle(img, (int(x), int(y)), r, (224, 111, 59), 3, cv2.LINE_AA)
    cv2.fillPoly(img, [pts], (255, 255, 255), cv2.LINE_AA)
    cv2.polylines(img, [pts], True, (40, 35, 27), 2, cv2.LINE_AA)
    return img


def fixed_quad(frames):
    """고정 카메라 컷: 손이 가리지 않은 첫 프레임에서 화면 네 꼭짓점을 한 번 구한다."""
    return quad(green_mask(frames[0]))


def run(cut, out):
    page = cv2.imread(G + "/page.png")
    editor = cv2.imread(G + "/editor.png")
    frames_out = []

    if cut == "c1":  # 공유 클릭
        fr = read_frames(S + "/kie/v1_1.mp4", 0.2, 2.7)
        q = fixed_quad(fr)
        share = np.array([796, 158]) * (1280 / 944)  # 크롭 좌표 → 1280 폭
        start = np.array([520, 520])
        for i, f in enumerate(fr):
            t = i / FPS
            p = ease(t / 1.2)
            x, y = start + (share - start) * p
            ins = page.copy()
            click = max(0.0, min(1.0, (t - 1.35) / 0.35)) if t > 1.35 else 0.0
            if 1.35 < t < 1.75:
                draw_cursor(ins, x, y, click)
            else:
                draw_cursor(ins, x, y)
            frames_out.append(key_insert(f, q, ins))

    elif cut == "c2":  # 링크 도착, 휴대폰 집기
        fr = read_frames(S + "/kie/v2_1.mp4", 0.8, 1.9)
        lock = np.full((2340, 1080, 3), (122, 96, 85), np.uint8)
        cv2.putText(lock, "10:21", (250, 620), cv2.FONT_HERSHEY_SIMPLEX, 6.5, (245, 245, 245), 14, cv2.LINE_AA)
        dark = np.zeros_like(lock)
        card = load_rgba(G + "/card.png", 400)
        last_q = fixed_quad(fr)  # 휴대폰이 들리기 전까지 카메라·휴대폰 모두 고정
        for i, f in enumerate(fr):
            t = i / FPS
            f = key_insert(f, last_q, lock if t > 0.15 else dark) if last_q is not None else f
            s, a = pop(t, 0.25)
            fade = 1.0 - max(0.0, (t - 1.55) / 0.3)
            if last_q is not None:
                cx, cy = last_q[:, 0].mean(), last_q[:, 1].min() - 20
                overlay(f, card, cx, max(cy, 260), s, a * fade)
            frames_out.append(f)

    elif cut == "c3":  # 휴대폰으로 플레이
        fr = read_frames(S + "/kie/v3_1.mp4", 0.4, 3.93)
        game = read_clip(S + "/cut3_tenpang.mp4", 540, 970)
        prev = None
        for i, f in enumerate(fr):
            t = i / FPS
            q = quad(green_mask(f))
            if q is not None and prev is not None:
                q = prev * 0.6 + q * 0.4  # 꼭짓점 떨림 완화
            prev = q if q is not None else prev
            f = key_insert(f, prev, game[min(i, len(game) - 1)])
            z = 1.0 + 0.06 * (t / 3.93)  # 느린 푸시인
            M = cv2.getRotationMatrix2D((W / 2, H * 0.45), 0, z)
            frames_out.append(cv2.warpAffine(f, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT))

    elif cut == "c4":  # 댓글 도착
        src = S + "/kie/v4b_1.mp4"
        fr = read_frames(src, 0.8, 2.0)
        q = fixed_quad(fr)
        bubble = load_rgba(G + "/bubble.png", 620)
        heart = load_rgba(G + "/heart.png", 170)
        top = q[:, 1].min()
        cx = q[:, 0].mean()
        for i, f in enumerate(fr):
            t = i / FPS
            f = key_insert(f, q, page)
            s, a = pop(t, 0.15)
            rise = 30 * (1 - ease((t - 0.15) / 0.4))
            overlay(f, bubble, cx - 40, top + 40 + rise, s, a)
            s2, a2 = pop(t, 0.6)
            overlay(f, heart, cx + 250, top + 150, s2, a2)
            frames_out.append(f)

    elif cut == "c5":  # 다시 고친다 → 루프
        fr = read_frames(S + "/kie/v5_1.mp4", 3.53, 1.47)
        q = quad(green_mask(read_frames(S + "/kie/v1_1.mp4", 0.0, 0.1)[0]))
        for f in fr:
            frames_out.append(key_insert(f, q, editor))

    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}",
                          "-r", str(FPS), "-i", "-", "-an", "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", out],
                         stdin=subprocess.PIPE)
    for f in frames_out:
        p.stdin.write(f.tobytes())
    p.stdin.close()
    p.wait()
    print(cut, len(frames_out), "frames")


if __name__ == "__main__":
    run(sys.argv[1], sys.argv[2])
