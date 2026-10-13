"""Обработка видео через ffmpeg.

Что делает автоматически (и что проверяется тестами):
  • вырезает фрагмент по плану;
  • убирает длинные паузы внутри фрагмента (ритм «без воды»);
  • приводит к вертикали 1080×1920 (центральный кадр для горизонтального исходника);
  • выравнивает громкость (EBU R128, −14 LUFS — норма соцсетей);
  • накладывает субтитры в стиле бренда, синхронно с речью после удаления пауз.

Чего не делает (нужен человек или отдельная ветка): подбор перебивок, цветокор,
следящее кадрирование по лицу, музыка с правами. Это прямо отражено в архитектуре.
"""

from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

from .config import Brand

W, H = 1080, 1920


def run(cmd: list[str]) -> str:
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.returncode != 0:
        raise RuntimeError(f"ffmpeg error ({p.returncode}): {p.stderr[-1500:]}")
    return p.stderr + p.stdout


def probe(path: Path) -> dict:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", str(path)],
        capture_output=True, text=True, check=True,
    ).stdout
    data = json.loads(out)
    v = next((s for s in data["streams"] if s["codec_type"] == "video"), None)
    a = next((s for s in data["streams"] if s["codec_type"] == "audio"), None)
    rot = 0
    if v:
        for sd in v.get("side_data_list", []) or []:
            if "rotation" in sd:
                rot = int(sd["rotation"])
    w, h = (v["width"], v["height"]) if v else (0, 0)
    if abs(rot) in (90, 270):
        w, h = h, w
    return {
        "duration": float(data["format"]["duration"]),
        "width": w, "height": h, "has_audio": a is not None,
    }


def extract_audio(src: Path, dst: Path) -> Path:
    run(["ffmpeg", "-y", "-v", "error", "-i", str(src), "-vn", "-ac", "1", "-ar", "16000", str(dst)])
    return dst


def detect_silences(src: Path, start: float, end: float, noise_db: int = -35,
                    min_len: float = 0.6) -> list[tuple[float, float]]:
    """Паузы внутри [start, end] в абсолютном времени исходника."""
    log = run(["ffmpeg", "-v", "info", "-ss", f"{start:.3f}", "-to", f"{end:.3f}", "-i", str(src),
               "-af", f"silencedetect=noise={noise_db}dB:d={min_len}", "-f", "null", "-"])
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    out = []
    for i, s in enumerate(starts):
        e = ends[i] if i < len(ends) else (end - start)
        out.append((start + s, start + e))
    return out


def keep_segments(start: float, end: float, silences, pad: float = 0.12) -> list[tuple[float, float]]:
    """Оставляем речь, от каждой паузы сохраняем по pad секунд для естественного дыхания."""
    keep, cur = [], start
    for s, e in silences:
        s2, e2 = s + pad, e - pad
        if e2 - s2 <= 0.05:
            continue
        if s2 > cur:
            keep.append((cur, s2))
        cur = max(cur, e2)
    if end > cur:
        keep.append((cur, end))
    return [(a, b) for a, b in keep if b - a > 0.08]


def remap(t: float, keep: list[tuple[float, float]]) -> float | None:
    """Время в исходнике → время в смонтированном ролике (None, если момент вырезан)."""
    acc = 0.0
    for a, b in keep:
        if t < a:
            return acc
        if t <= b:
            return acc + (t - a)
        acc += b - a
    return acc


def _ass_time(t: float) -> str:
    t = max(0.0, t)
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def _ass_color(hex_rgb: str) -> str:
    r, g, b = hex_rgb[1:3], hex_rgb[3:5], hex_rgb[5:7]
    return f"&H00{b}{g}{r}".upper()


def build_ass(words: list[dict], keep, brand: Brand, path: Path, max_chars: int = 26) -> int:
    """Субтитры строками по 2–5 слов, позиция выше нижнего интерфейса Reels/Shorts."""
    lines, cur = [], []
    for w in words:
        t0, t1 = remap(w["start"], keep), remap(w["end"], keep)
        if t0 is None or t1 is None or t1 <= t0:
            continue
        cur.append((t0, t1, w["word"]))
        text = " ".join(x[2] for x in cur)
        if len(text) >= max_chars or w["word"].endswith((".", "?", "!", ",")):
            lines.append(cur)
            cur = []
    if cur:
        lines.append(cur)

    header = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Atrium,{brand.font_sans},64,{_ass_color(brand.ink)},{_ass_color(brand.accent_light)},&H00000000,&H64000000,1,0,0,0,100,100,0,0,1,3,2,2,90,90,520,204

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    events = []
    for ln in lines:
        start, end = ln[0][0], ln[-1][1] + 0.05
        text = " ".join(x[2] for x in ln).replace("{", "(").replace("}", ")")
        events.append(f"Dialogue: 0,{_ass_time(start)},{_ass_time(end)},Atrium,,0,0,0,,{text}")
    path.write_text(header + "\n".join(events) + "\n", encoding="utf-8")
    return len(events)


def render_vertical_clip(src: Path, start: float, end: float, words: list[dict],
                         out: Path, brand: Brand, remove_pauses: bool = True) -> dict:
    info = probe(src)
    silences = detect_silences(src, start, end) if (remove_pauses and info["has_audio"]) else []
    keep = keep_segments(start, end, silences) or [(start, end)]
    ass = out.with_suffix(".ass")
    n_lines = build_ass([w for w in words if start <= w["start"] < end], keep, brand, ass)

    # 9:16: горизонтальный исходник — центральный кадр; вертикальный — масштаб с полями
    if info["width"] / max(info["height"], 1) > W / H:
        frame = f"crop=ih*{W}/{H}:ih,scale={W}:{H}"
    else:
        frame = f"scale={W}:{H}:force_original_aspect_ratio=decrease,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color={brand.bg}"

    parts, labels = [], []
    for i, (a, b) in enumerate(keep):
        parts.append(f"[0:v]trim={a:.3f}:{b:.3f},setpts=PTS-STARTPTS[v{i}]")
        if info["has_audio"]:
            parts.append(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS[a{i}]")
            labels.append(f"[v{i}][a{i}]")
        else:
            labels.append(f"[v{i}]")
    n = len(keep)
    if info["has_audio"]:
        parts.append(f"{''.join(labels)}concat=n={n}:v=1:a=1[vc][ac]")
        parts.append("[ac]loudnorm=I=-14:TP=-1.5:LRA=11[aout]")
    else:
        parts.append(f"{''.join(labels)}concat=n={n}:v=1:a=0[vc]")
    ass_escaped = str(ass).replace("\\", "/").replace(":", "\\:")
    parts.append(f"[vc]{frame},ass='{ass_escaped}'[vout]")

    tmp = out.with_name(out.stem + ".part" + out.suffix)
    cmd = ["ffmpeg", "-y", "-v", "error", "-i", str(src), "-filter_complex", ";".join(parts),
           "-map", "[vout]"]
    if info["has_audio"]:
        cmd += ["-map", "[aout]", "-c:a", "aac", "-b:a", "160k", "-ar", "48000"]
    cmd += ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
            "-r", "30", "-movflags", "+faststart", str(tmp)]
    run(cmd)
    tmp.replace(out)
    cover = out.with_suffix(".jpg")
    run(["ffmpeg", "-y", "-v", "error", "-ss", "0.5", "-i", str(out), "-frames:v", "1", "-q:v", "3", str(cover)])
    res = probe(out)
    return {
        "file": out.name, "cover": cover.name, "subtitles": ass.name,
        "duration": round(res["duration"], 2), "width": res["width"], "height": res["height"],
        "source_range": [round(start, 2), round(end, 2)],
        "removed_pauses_sec": round((end - start) - sum(b - a for a, b in keep), 2),
        "subtitle_lines": n_lines,
    }
