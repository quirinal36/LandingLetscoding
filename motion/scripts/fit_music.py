#!/usr/bin/env python3
"""
수노가 준 곡(보통 2~4분)에서 릴에 깔 15초를 골라 motion/reel/music.mp3 로 내보낸다.

  python3 motion/scripts/fit_music.py motion/out/music/<taskId>-1.mp3
  python3 motion/scripts/fit_music.py song.mp3 --start 42.5    # 시작점(원곡 초)을 직접 지정
  python3 motion/scripts/fit_music.py song.mp3 --out /tmp/x.mp3

하는 일
  1. 템포와 박을 찾는다(librosa). 박 간격을 직선으로 맞춰 실제 BPM을 구한다.
  2. 128 BPM과 다르면 ffmpeg atempo로 128에 맞춘다. 음높이는 그대로다.
  3. 박자별 화성 변화로 마디의 첫 박(다운비트)을 추정하고, 에너지가 가장 크게 올라오는 8마디를 고른다.
     128 BPM에서 8마디는 정확히 15초 = 릴 한 바퀴다. 다운비트가 0초에 오므로 씬 전환이 박에 떨어진다.
  4. MP3 256k로 내보낸다(모든 브라우저가 재생한다. MP4에 넣을 때는 렌더러가 AAC로 바꾼다).
     앞뒤 8ms 페이드라 반복 재생해도 튀지 않는다.
  5. 결과 파일의 박을 다시 재서 박 격자와의 오차를 보고한다.

필요: pip install librosa soundfile · ffmpeg(PATH 또는 FFMPEG=/경로)
"""
import argparse
import json
import os
import shutil
import subprocess
import sys

import numpy as np
import librosa

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BPM = 128.0
BEAT = 60.0 / BPM
BARS = 8
LENGTH = BEAT * 4 * BARS  # 15.0초
SR = 22050
HOP = 512
# 온셋 검출은 실제 타격보다 10~15ms 늦게 잡힌다(합성 킥으로 잰 값). 그만큼 당기고, 첫 타격이
# 8ms 페이드인에 깎이지 않게 조금 더 앞에서 자른다. 소리가 화면보다 몇 ms 늦는 쪽은 느껴지지 않는다.
ONSET_LAG = 0.020


def ffmpeg_bin():
    found = os.environ.get("FFMPEG") or shutil.which("ffmpeg")
    if not found:
        sys.exit("ffmpeg가 필요합니다. PATH에 두거나 FFMPEG=/경로/ffmpeg 로 알려 주세요.")
    return found


def decode(path):
    """mp3·m4a·wav 무엇이든 ffmpeg로 풀어 모노 float32로 읽는다."""
    raw = subprocess.run(
        [ffmpeg_bin(), "-loglevel", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
        check=True, capture_output=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


HOP_FINE = 128  # 5.8ms — 박 위치를 재는 해상도


def onset_peaks(y):
    """세기 상위 60%의 온셋 시각과 세기."""
    env = librosa.onset.onset_strength(y=y, sr=SR, hop_length=HOP_FINE)
    times = librosa.times_like(env, sr=SR, hop_length=HOP_FINE)
    wait = int(0.08 * SR / HOP_FINE)
    peaks = librosa.util.peak_pick(env, pre_max=8, post_max=8, pre_avg=40, post_avg=40, delta=0.05 * env.max(), wait=wait)
    pt, pv = times[peaks], env[peaks]
    keep = pv >= np.percentile(pv, 40)
    return pt[keep], pv[keep], env


def fit_grid(pt, anchor, period):
    """anchor에서 시작해 가까운 박부터 점점 넓혀 가며 박 = anchor + k·period 를 직선으로 맞춘다.
    한 번에 곡 전체를 맞추면 초기 템포의 작은 오차가 뒤로 갈수록 반 박 넘게 벌어져 엉뚱한 박에 붙는다."""
    a, p = anchor, period
    for span in (8, 16, 32, 64, 128, 256, 10**6):
        k = np.round((pt - a) / p)
        m = (np.abs(pt - (a + k * p)) < 0.12 * p) & (np.abs(k) <= span)  # 반 박(오프비트 하이햇)은 버린다
        if m.sum() >= 8:
            p, a = np.polyfit(k[m], pt[m], 1)
    k = np.round((pt - a) / p)
    res = pt - (a + k * p)
    on = np.abs(res) < 0.12 * p
    return a, p, float(np.median(np.abs(res[on]))) * 1000 if on.any() else float("nan")


def low_onset(y):
    """30–150Hz(킥·베이스) 에너지가 치솟는 정도. 박의 앞뒤(정박/엇박)를 가리는 데 쓴다."""
    S = np.abs(librosa.stft(y, n_fft=2048, hop_length=HOP_FINE))
    freqs = librosa.fft_frequencies(sr=SR, n_fft=2048)
    band = np.log1p(S[(freqs >= 30) & (freqs <= 150)].sum(axis=0))
    env = np.maximum(0, np.diff(band, prepend=band[0]))
    return env, librosa.times_like(env, sr=SR, hop_length=HOP_FINE)


def near_max(env, times, at, win=0.02):
    """각 시각 ±win 안의 최댓값."""
    idx = np.searchsorted(times, at)
    w = int(win * SR / HOP_FINE)
    return np.array([env[max(0, i - w) : i + w + 1].max() if i < len(env) else 0 for i in idx])


def beat_grid(y, low, low_t):
    """박 격자와 BPM. 반·두 배 템포로 잡히면 128 쪽으로 접는다."""
    pt, pv, env = onset_peaks(y)
    if len(pt) < 16:
        sys.exit("박을 충분히 찾지 못했습니다. 드럼이 뚜렷한 곡인지 확인해 주세요.")
    bpm0 = float(librosa.feature.tempo(onset_envelope=env, sr=SR, hop_length=HOP_FINE, start_bpm=BPM)[0])
    while bpm0 < 90:
        bpm0 *= 2
    while bpm0 > 180:
        bpm0 /= 2
    anchor = pt[np.argmax(pv[: max(8, len(pv) // 4)])]  # 앞쪽에서 가장 센 온셋
    a, p, jitter = fit_grid(pt, anchor, 60 / bpm0)
    grid = np.arange(a - np.floor(a / p) * p, len(y) / SR, p)
    # 전 대역 온셋은 엇박의 하이햇에 붙기도 한다. 킥이 더 센 쪽을 정박으로 삼는다
    if near_max(low, low_t, grid + p / 2).sum() > near_max(low, low_t, grid).sum():
        grid = grid + p / 2
    return grid, 60 / p, jitter


def main():
    ap = argparse.ArgumentParser(description="수노 곡에서 128 BPM 8마디(15초)를 골라낸다")
    ap.add_argument("audio")
    ap.add_argument("--start", type=float, help="원곡에서 시작할 초(다운비트). 주면 자동 선택을 건너뛴다")
    ap.add_argument("--out", default=os.path.join(ROOT, "motion/reel/music.mp3"))
    a = ap.parse_args()

    y = decode(a.audio)
    dur = len(y) / SR
    low, low_t = low_onset(y)
    grid, bpm, jitter = beat_grid(y, low, low_t)
    period = 60 / bpm

    # 다운비트: 화성(크로마)이 박자 경계에서 가장 많이 바뀌는 위상
    chroma = librosa.feature.chroma_cqt(y=y, sr=SR, hop_length=HOP)
    frames = librosa.time_to_frames(grid, sr=SR, hop_length=HOP)
    frames = frames[frames < chroma.shape[1]]
    # 열 i = i번째 박부터 다음 박 전까지의 화성
    per_beat = np.stack([np.median(chroma[:, frames[i] : frames[i + 1]], axis=1) for i in range(len(frames) - 1)], axis=1)
    per_beat = per_beat / (np.linalg.norm(per_beat, axis=0, keepdims=True) + 1e-9)
    change = np.r_[0, 1 - np.sum(per_beat[:, 1:] * per_beat[:, :-1], axis=0)]  # change[i]: i번째 박에서 바뀐 정도
    low_at = near_max(low, low_t, grid[: len(frames)])  # 박마다 킥·베이스 세기
    rms = librosa.feature.rms(y=y, hop_length=HOP)[0]
    rms_t = librosa.times_like(rms, sr=SR, hop_length=HOP)
    beat_rms = np.array([rms[(rms_t >= t) & (rms_t < t + period)].mean() for t in grid[: len(frames)]])
    rise = np.maximum(0, np.diff(beat_rms, prepend=beat_rms[0]))  # 섹션이 바뀌며 에너지가 뛰는 박
    n = min(len(change), len(low_at), len(rise))

    def dev(values, top=None):
        """위상별 평균이 전체 평균에서 얼마나 벗어나는지(비율). 단서마다 크기가 달라도 같은 저울에 올린다."""
        m = []
        for p in range(4):
            v = np.sort(values[p:n:4])[::-1]
            m.append(v[: max(1, int(len(v) * top))].mean() if top else v.mean())
        m = np.array(m)
        return (m - m.mean()) / (m.mean() + 1e-9)

    # 화성이 바뀌는 자리를 가장 믿고, 킥·에너지 상승은 거든다
    score = dev(change) + 0.5 * dev(low_at) + 0.5 * dev(rise, top=0.25)
    phase = int(np.argmax(score))
    downbeats = grid[phase::4]
    bar_rms = np.array([rms[(rms_t >= t) & (rms_t < t + 4 * period)].mean() if t + 4 * period <= dur else 0 for t in downbeats])

    stretch = BPM / bpm
    need = LENGTH * stretch  # 원곡에서 가져올 길이(초)
    if a.start is not None:
        start = float(a.start)
        pick = None
    else:
        best, pick = -1e9, None
        for b, t in enumerate(downbeats):
            if t < 2.0 or t + need > dur - 6.0:  # 인트로 첫 소리와 끝 페이드아웃은 피한다
                continue
            window = bar_rms[b : b + BARS]
            if len(window) < BARS or np.any(window == 0):
                continue
            rise = bar_rms[b] - (bar_rms[b - 1] if b > 0 else 0)  # 섹션이 막 시작되는 자리에 가산점
            s = float(window.mean() + 0.6 * max(0.0, rise))
            if s > best:
                best, pick = s, b
        if pick is None:
            sys.exit("15초를 잘라낼 만큼 긴 구간을 찾지 못했습니다. --start 로 직접 지정해 주세요.")
        start = max(0.0, float(downbeats[pick]) - ONSET_LAG)

    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    filters = []
    if abs(stretch - 1) > 0.001:
        filters.append(f"atempo={stretch:.6f}")
    filters += [
        f"atrim=duration={LENGTH}",
        "afade=t=in:d=0.008",
        f"afade=t=out:st={LENGTH - 0.008:.3f}:d=0.008",
        "aresample=44100",
    ]
    codec = ["-c:a", "aac", "-b:a", "256k"] if a.out.lower().endswith(".m4a") else ["-c:a", "libmp3lame", "-b:a", "256k"]
    cmd = [ffmpeg_bin(), "-y", "-loglevel", "error", "-ss", f"{start:.4f}", "-i", a.audio,
           "-af", ",".join(filters), "-ac", "2", *codec, a.out]
    subprocess.run(cmd, check=True)

    # 검증: 결과 파일의 센 온셋이 128 BPM 격자(0, 0.469, 0.938 …)에서 얼마나 벗어나 있나
    t2, _, _ = onset_peaks(decode(a.out))
    res = (t2 - ONSET_LAG + BEAT / 2) % BEAT - BEAT / 2
    on = np.abs(res) < 0.12 * BEAT
    err = np.abs(res[on]) * 1000 if on.any() else np.array([np.nan])

    report = {
        "source": os.path.relpath(os.path.abspath(a.audio), ROOT),
        "detected_bpm": round(bpm, 3),
        "beat_jitter_ms": round(jitter, 1),
        "stretch": round(stretch, 5),
        "start_sec": round(start, 4),
        "start_bar": None if pick is None else int(pick),
        "downbeat_phase": phase,
        "downbeat_scores": [round(float(s), 3) for s in score],
        "length_sec": LENGTH,
        "beat_error_ms_median": round(float(np.nanmedian(err)), 1),
        "out": os.path.relpath(os.path.abspath(a.out), ROOT),
    }
    with open(os.path.splitext(a.out)[0] + ".json", "w", encoding="utf-8") as fh:
        json.dump(report, fh, ensure_ascii=False, indent=2)
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
