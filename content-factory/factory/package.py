"""Сборка пакета версии: всё для каналов в одной папке + страница для телефона.

03 — Результаты/<item>/v<N>/
  manifest.json        — что внутри, из какой версии плана, ссылки с метками
  preview.html         — посмотреть видео, прочитать и скопировать тексты
  reel_c1.mp4 / .jpg   — вертикальные ролики и обложки
  carousel/slide_*.jpg — карусель
  pin.jpg              — пин
  texts/*.txt          — подписи по каналам (удобно копировать)
Старые версии не перезаписываются — актуальная всегда с наибольшим номером.
"""

from __future__ import annotations

import html
import json
import shutil
import time
from pathlib import Path

from . import render
from .config import Settings

CHANNEL_OF = {
    "reel_caption": "instagram", "telegram_post": "telegram", "carousel": "instagram",
    "stories": "instagram", "pinterest": "pinterest", "youtube_short": "youtube",
    "threads": "threads",
}


def utm(site: str, channel: str, item_id: str, asset: str) -> str:
    return f"{site}/?utm_source={channel}&utm_medium=social&utm_campaign={item_id}&utm_content={asset}"


def _text_of(node: dict) -> str:
    if "text" in node:
        return node["text"]
    if "slides" in node:
        return "\n\n".join(f"{s.get('title', '')}\n{s.get('body', '')}".strip() for s in node["slides"])
    if "frames" in node:
        return "\n---\n".join(node["frames"])
    return "\n\n".join(str(node.get(k, "")) for k in ("title", "description", "link") if node.get(k))


def build(settings: Settings, item_id: str, version: int, plan: dict, clips: list[dict],
          clip_dir: Path | None, ai_label: bool = False) -> Path:
    vdir = settings.folder("ready") / item_id / f"v{version}"
    tmp = vdir.with_name(vdir.name + ".part")
    if tmp.exists():
        shutil.rmtree(tmp)
    (tmp / "texts").mkdir(parents=True)
    brand = settings.brand

    for c in clips:
        for key in ("file", "cover", "subtitles"):
            shutil.copy2(clip_dir / c[key], tmp / c[key])

    assets = plan["assets"]
    files = {}
    if "carousel" in assets:
        files["carousel"] = [f"carousel/{f}" for f in
                             render.carousel(assets["carousel"]["slides"], tmp / "carousel", brand, ai_label)]
    if "pinterest" in assets:
        render.pin(assets["pinterest"]["title"], tmp / "pin.jpg", brand)
        files["pinterest"] = ["pin.jpg"]

    links = {}
    for name, node in assets.items():
        ch = CHANNEL_OF.get(name, "other")
        links[name] = utm(brand.site, ch, item_id, name)
        (tmp / "texts" / f"{name}.txt").write_text(_text_of(node), encoding="utf-8")

    manifest = {
        "item_id": item_id, "version": version, "built_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "planner": plan.get("engine"), "topic": plan.get("topic"), "key_idea": plan.get("key_idea"),
        "clips": clips, "files": files, "links": links,
        "to_verify": plan.get("to_verify", []), "ai_label": ai_label,
        "revisions": plan.get("revisions", []),
    }
    (tmp / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    (tmp / "plan.json").write_text(json.dumps(plan, ensure_ascii=False, indent=2), encoding="utf-8")
    (tmp / "preview.html").write_text(preview_html(manifest, plan), encoding="utf-8")
    if vdir.exists():
        raise FileExistsError(f"Версия {vdir} уже существует — версии не перезаписываются")
    tmp.replace(vdir)
    return vdir


def preview_html(m: dict, plan: dict) -> str:
    e = html.escape
    videos = "".join(
        f'<figure><video controls playsinline preload="metadata" poster="{e(c["cover"])}" src="{e(c["file"])}"></video>'
        f'<figcaption>{e(c.get("title") or c["file"])} · {c["duration"]} с</figcaption></figure>'
        for c in m["clips"])
    blocks = []
    for name, node in plan["assets"].items():
        t = e(_text_of(node))
        blocks.append(
            f'<section><h2>{e(name)}</h2><pre id="t-{e(name)}">{t}</pre>'
            f'<button onclick="navigator.clipboard.writeText(document.getElementById(\'t-{e(name)}\').innerText)">Скопировать</button>'
            f'<p class="link">{e(m["links"][name])}</p></section>')
    slides = "".join(f'<img src="{e(f)}" alt="">' for f in m["files"].get("carousel", []))
    verify = "".join(f"<li>{e(x)}</li>" for x in m["to_verify"]) or "<li>нет</li>"
    return f"""<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>ATRIUM · {e(m['item_id'])} v{m['version']}</title>
<style>body{{margin:0;padding:16px;background:#15120d;color:#ece4d3;font:16px/1.5 Inter,system-ui,sans-serif}}
h1{{font-size:20px}}h2{{font-size:15px;color:#d8b787;margin:24px 0 8px}}video,img{{width:100%;border-radius:8px}}
pre{{white-space:pre-wrap;background:#1e1912;padding:12px;border-radius:8px;font:inherit}}
button{{background:#b6905b;color:#15120d;border:0;border-radius:6px;padding:10px 14px;font-weight:600}}
.link{{font-size:12px;color:#a99d87;word-break:break-all}}.row{{display:grid;gap:8px}}</style></head><body>
<h1>{e(m.get('topic') or '')} — версия {m['version']}</h1>
<p>Черновик для согласования. Ничего не опубликовано.</p>
<div class="row">{videos}</div><h2>Карусель</h2><div class="row">{slides}</div>
{''.join(blocks)}<h2>Проверить факты перед выпуском</h2><ul>{verify}</ul></body></html>"""
