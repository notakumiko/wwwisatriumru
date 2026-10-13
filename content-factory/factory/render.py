"""Графика без новой съёмки: слайды карусели (4:5) и пин (2:3) в палитре сайта.

Это технический шаблон. Финальная вёрстка обложек может жить в Canva (бренд-кит,
автозаполнение шаблона) — тогда этот модуль служит запасным вариантом и источником
текста для шаблона.
"""

from __future__ import annotations

import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from .config import Brand

FONT_DIRS = ["/usr/share/fonts/opentype/inter", "/usr/share/fonts/truetype/dejavu",
             "/usr/local/share/fonts", str(Path.home() / ".fonts")]


def _font(names: list[str], size: int):
    for d in FONT_DIRS:
        for n in names:
            p = Path(d) / n
            if p.exists():
                return ImageFont.truetype(str(p), size)
    return ImageFont.load_default()


def _hex(c: str):
    return tuple(int(c[i:i + 2], 16) for i in (1, 3, 5))


def _draw_text(draw, xy, text, font, fill, width_chars, line_gap=1.25):
    x, y = xy
    for para in text.split("\n"):
        for line in textwrap.wrap(para, width=width_chars) or [""]:
            draw.text((x, y), line, font=font, fill=fill)
            y += int(font.size * line_gap)
    return y


def slide(path: Path, title: str, body: str, idx: int, total: int, brand: Brand,
          size=(1080, 1350), ai_label: bool = False) -> Path:
    img = Image.new("RGB", size, _hex(brand.bg))
    d = ImageDraw.Draw(img)
    serif = _font(["PlayfairDisplay-Regular.ttf", "DejaVuSerif.ttf"], 76)
    sans = _font(["Inter-Regular.otf", "DejaVuSans.ttf"], 42)
    small = _font(["Inter-Medium.otf", "DejaVuSans.ttf"], 28)
    d.rectangle([80, 120, 200, 124], fill=_hex(brand.accent))
    y = _draw_text(d, (80, 170), title, serif, _hex(brand.ink), 22)
    if body:
        _draw_text(d, (80, y + 40), body, sans, _hex(brand.stone), 40)
    d.text((80, size[1] - 110), "ATRIUM", font=small, fill=_hex(brand.accent_light))
    d.text((size[0] - 180, size[1] - 110), f"{idx}/{total}", font=small, fill=_hex(brand.stone))
    if ai_label:
        d.text((80, size[1] - 160), "ИИ-концепция, не реализованный проект", font=small,
               fill=_hex(brand.accent))
    img.save(path, quality=92)
    return path


def carousel(slides: list[dict], out_dir: Path, brand: Brand, ai_label=False) -> list[str]:
    out_dir.mkdir(parents=True, exist_ok=True)
    files = []
    for i, s in enumerate(slides, 1):
        p = out_dir / f"slide_{i:02d}.jpg"
        slide(p, s.get("title", ""), s.get("body", ""), i, len(slides), brand, ai_label=ai_label)
        files.append(p.name)
    return files


def pin(title: str, out: Path, brand: Brand) -> Path:
    return slide(out, title, "", 1, 1, brand, size=(1000, 1500))
