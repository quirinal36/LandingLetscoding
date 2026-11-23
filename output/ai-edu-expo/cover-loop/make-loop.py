#!/usr/bin/env python3
"""표지 반복 영상 후처리.

Higgsfield(MiniMax H3)로 만든 원본 영상을 발표용 반복 영상으로 다듬는다.

1. 움직이지 않는 영역은 시간 평균 화면으로 고정한다(제목 자리 하늘, 책상, 의자 등).
2. 끝부분의 멈춤 구간을 잘라 내고, 끝과 처음을 짧게 겹쳐 이음새를 없앤다.
3. 고정 영역을 기준으로 색을 표지 원본 이미지에 맞춘다.
4. 생성 과정에서 세로로 눌린 비율을 표지와 같은 A4 가로(2048x1448)로 되돌린다.
5. 제목 없는 영상과 제목을 얹은 영상을 함께 만든다. 소리는 넣지 않는다.

실행:
  uv run --with numpy --with opencv-python-headless \
    output/ai-edu-expo/cover-loop/make-loop.py
"""
import argparse
import json
import subprocess
from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parent
OUT_W, OUT_H = 2048, 1448  # 표지 일러스트와 같은 A4 가로 비율
# swscale 기본 경로는 RGB↔YUV 변환에서 1~2단계 어두워지므로 정밀 변환을 쓴다.
SWS = "flags=lanczos+accurate_rnd+full_chroma_int+full_chroma_inp"


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height,r_frame_rate", "-of", "json", str(path)],
        check=True, capture_output=True, text=True).stdout
    s = json.loads(out)["streams"][0]
    num, den = s["r_frame_rate"].split("/")
    return s["width"], s["height"], int(num) / int(den)


def read_frames(path, w, h):
    # 원본은 색 정보 표시가 없고 BT.601로 풀어야 표지 원본 색과 가장 가깝다.
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-vf",
         f"scale=in_color_matrix=bt601:in_range=tv:out_range=pc:{SWS},format=bgr24",
         "-f", "rawvideo", "-"],
        check=True, capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3)


def motion_alpha(frames, threshold, grow, feather):
    """밝기가 threshold 넘게 변한 곳을 넓히고 가장자리를 부드럽게 한 값(0~1)."""
    hi = np.zeros(frames.shape[1:3], np.float32)
    lo = np.full(frames.shape[1:3], 255, np.float32)
    for f in frames[1:]:  # 첫 프레임은 입력 이미지 그대로라 색이 조금 달라 제외
        g = cv2.GaussianBlur(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY).astype(np.float32), (0, 0), 1.5)
        np.maximum(hi, g, out=hi)
        np.minimum(lo, g, out=lo)
    moving = ((hi - lo) > threshold).astype(np.uint8)
    moving = cv2.morphologyEx(moving, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    moving = cv2.dilate(moving, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (grow, grow)))
    return cv2.GaussianBlur(moving.astype(np.float32), (0, 0), feather)


def color_match(still, alpha, reference):
    """고정 영역에서 영상 색 → 표지 원본 색으로 가는 3x4 변환을 최소제곱으로 구한다."""
    h, w = still.shape[:2]
    ref = cv2.resize(cv2.imread(str(reference)), (w, h), interpolation=cv2.INTER_AREA).astype(np.float32)
    static = alpha[..., 0] < 0.02
    x = cv2.GaussianBlur(still, (0, 0), 4)[static][::7]
    y = cv2.GaussianBlur(ref, (0, 0), 4)[static][::7]
    m = np.linalg.lstsq(np.hstack([x, np.ones((len(x), 1), np.float32)]), y, rcond=None)[0]
    before = float(np.abs(x - y).mean())
    after = float(np.abs(np.hstack([x, np.ones((len(x), 1), np.float32)]) @ m - y).mean())
    print(f"색 맞춤: 원본과의 평균 차이 {before:.2f} → {after:.2f} (0~255 기준)")
    return np.ascontiguousarray(m.T, dtype=np.float32)  # cv2.transform용 3x4


def encoder(path, fps, crf):
    return subprocess.Popen(
        ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24",
         "-s", f"{OUT_W}x{OUT_H}", "-r", f"{fps:g}", "-i", "-", "-an",
         "-vf", f"scale=in_range=pc:out_color_matrix=bt709:out_range=tv:{SWS},format=yuv420p",
         "-c:v", "libx264", "-preset", "slow", "-crf", str(crf),
         "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
         "-color_range", "tv", "-movflags", "+faststart", str(path)],
        stdin=subprocess.PIPE)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--source", default=HERE / "source-minimax-h3.mp4", type=Path)
    ap.add_argument("--title", default=HERE / "title-overlay-2048.png", type=Path)
    ap.add_argument("--reference", default=HERE / "../../../public/landing/expo-cover-a4.jpg", type=Path,
                    help="색을 맞출 표지 원본 이미지")
    ap.add_argument("--out", default=HERE / "expo-cover-loop.mp4", type=Path)
    ap.add_argument("--out-titled", default=HERE / "expo-cover-loop-titled.mp4", type=Path)
    ap.add_argument("--tail-trim", type=int, default=12, help="끝에서 잘라 낼 멈춤 구간(프레임)")
    ap.add_argument("--blend", type=int, default=8, help="끝과 처음을 겹칠 길이(프레임)")
    ap.add_argument("--threshold", type=float, default=7, help="움직임으로 볼 밝기 변화 폭")
    ap.add_argument("--crf", type=int, default=15)
    args = ap.parse_args()

    w, h, fps = probe(args.source)
    frames = read_frames(args.source, w, h)
    print(f"원본 {w}x{h} {fps:g}fps {len(frames)}프레임")

    alpha = motion_alpha(frames, args.threshold, grow=41, feather=10)[..., None]
    still = frames[1:].mean(axis=0, dtype=np.float32)  # 고정 영역에 쓸 시간 평균 화면
    print(f"움직이는 영역 {float((alpha > 0.5).mean()) * 100:.1f}%")
    to_cover = color_match(still, alpha, args.reference)

    used = frames[: len(frames) - args.tail_trim]
    n, k = len(used), args.blend
    count = n - k

    title = cv2.imread(str(args.title), cv2.IMREAD_UNCHANGED).astype(np.float32)
    assert title.shape[:2] == (OUT_H, OUT_W) and title.shape[2] == 4, "제목 오버레이는 2048x1448 RGBA여야 한다"
    t_rgb, t_a = title[..., :3], title[..., 3:] / 255

    clean, titled = encoder(args.out, fps, args.crf), encoder(args.out_titled, fps, args.crf)
    for i in range(count):
        live = used[i].astype(np.float32)
        if i < k:  # 끝부분 화면에서 처음 화면으로 넘어가는 구간
            t = i / k
            t = t * t * (3 - 2 * t)
            live = used[n - k + i].astype(np.float32) * (1 - t) + live * t
        frame = cv2.transform(still * (1 - alpha) + live * alpha, to_cover)
        frame = cv2.resize(frame, (OUT_W, OUT_H), interpolation=cv2.INTER_LANCZOS4)
        clean.stdin.write(np.clip(frame + 0.5, 0, 255).astype(np.uint8).tobytes())
        with_title = frame * (1 - t_a) + t_rgb * t_a
        titled.stdin.write(np.clip(with_title + 0.5, 0, 255).astype(np.uint8).tobytes())
    for p in (clean, titled):
        p.stdin.close()
        if p.wait():
            raise SystemExit("ffmpeg 인코딩 실패")
    print(f"완료: {count}프레임, {count / fps:.2f}초 → {args.out.name}, {args.out_titled.name}")


if __name__ == "__main__":
    main()
