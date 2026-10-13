"""Из расшифровки — план материалов для каналов.

Два движка с одинаковым результатом (plan.json):
  offline — детерминированный черновик без ИИ: выбирает фрагменты по паузам и длине,
            собирает тексты из ваших же фраз. Нужен для тестов и как запасной режим,
            если API недоступен. Тексты помечены как черновик.
  claude  — редактор на Claude API с навыком ATRIUM (.claude/skills/atrium-content):
            выбирает смысловые фрагменты, пишет подписи в вашем голосе, отмечает
            факты для проверки. Требует ANTHROPIC_API_KEY на сервере (оплата по API,
            не подписка на чат).
"""

from __future__ import annotations

import json
import os
import re
from pathlib import Path

SKILL = Path(__file__).resolve().parents[2] / ".claude" / "skills" / "atrium-content" / "SKILL.md"

ASSETS = ["reel_caption", "telegram_post", "carousel", "stories", "pinterest",
          "youtube_short", "threads"]


def _sentences(transcript: dict) -> list[dict]:
    return [s for s in transcript["segments"] if s["text"].strip()]


def pick_clips(transcript: dict, min_len=12.0, max_len=60.0, limit=3) -> list[dict]:
    segs = _sentences(transcript)
    windows = []
    for i in range(len(segs)):
        for j in range(i, len(segs)):
            dur = segs[j]["end"] - segs[i]["start"]
            if dur > max_len:
                break
            if dur >= min_len and segs[j]["text"].rstrip().endswith((".", "!", "?")):
                # чем ближе к 25–45 с, тем лучше для коротких роликов
                score = -abs(35 - dur)
                windows.append((score, segs[i]["start"], segs[j]["end"], i, j))
    windows.sort(reverse=True)
    chosen = []
    for score, a, b, i, j in windows:
        if all(b <= c["start"] or a >= c["end"] for c in chosen):
            hook = segs[i]["text"].strip()
            chosen.append({"id": f"c{len(chosen) + 1}", "start": round(a, 2), "end": round(b, 2),
                           "hook": hook, "title": hook[:60]})
        if len(chosen) >= limit:
            break
    return sorted(chosen, key=lambda c: c["start"])


def offline_plan(transcript: dict, topic: str | None, brand_site: str, item_id: str) -> dict:
    segs = _sentences(transcript)
    text = " ".join(s["text"].strip() for s in segs)
    sentences = re.split(r"(?<=[.!?])\s+", text)
    key = sentences[0] if sentences else ""
    clips = pick_clips(transcript)
    body = sentences[1:5]
    draft = "[черновик без ИИ — собран из ваших фраз]"
    slides = [{"title": key[:70], "body": ""}] + [
        {"title": f"{i + 1}", "body": s} for i, s in enumerate(sentences[1:6])
    ] + [{"title": "ATRIUM", "body": "Больше разборов — в Telegram-канале студии."}]
    return {
        "engine": "offline",
        "topic": topic or key[:80],
        "key_idea": key,
        "clips": clips,
        "assets": {
            "reel_caption": {"text": f"{key}\n\n" + " ".join(body[:2]) + f"\n\n{draft}"},
            "telegram_post": {"text": f"**{key}**\n\n" + "\n\n".join(body) + f"\n\n{draft}"},
            "carousel": {"slides": slides},
            "stories": {"frames": [key, body[0] if body else "", "Вопрос: а у вас как?"]},
            "pinterest": {"title": key[:100], "description": " ".join(body)[:480],
                          "link": f"{brand_site}/?utm_source=pinterest&utm_campaign={item_id}"},
            "youtube_short": {"title": key[:95], "description": " ".join(body)[:900]},
            "threads": {"text": key[:480]},
        },
        "to_verify": [s for s in sentences if re.search(r"\d", s)],
        "decisions_for_owner": [],
    }


def claude_plan(transcript: dict, topic: str | None, item_id: str, route: str,
                revision: str | None = None, previous: dict | None = None) -> dict:
    """Не запускалось в среде разработки (нет ключа API). Проверяется первым частным тестом на сервере."""
    import anthropic  # type: ignore

    system = SKILL.read_text(encoding="utf-8")
    lines = [f"[{s['start']:.1f}–{s['end']:.1f}] {s['text']}" for s in transcript["segments"]]
    user = {
        "task": "revise" if revision else "plan",
        "route": route, "item_id": item_id, "topic_hint": topic,
        "transcript_with_timecodes": "\n".join(lines),
        "previous_plan": previous, "owner_comment": revision,
        "output": "Верни ТОЛЬКО JSON по схеме plan.json из навыка, без пояснений.",
    }
    client = anthropic.Anthropic()
    msg = client.messages.create(
        model=os.environ.get("ATRIUM_MODEL", "claude-opus-5-5"),
        max_tokens=16000,
        system=[{"type": "text", "text": system, "cache_control": {"type": "ephemeral"}}],
        output_config={"effort": "medium"},
        messages=[{"role": "user", "content": json.dumps(user, ensure_ascii=False)}],
        extra_headers={"anthropic-beta": "server-side-fallback-2026-07-01"},
        extra_body={"fallbacks": "default"},
    )
    if msg.stop_reason == "refusal":
        raise RuntimeError("Модель отказалась обработать материал — нужен просмотр человеком")
    text = "".join(b.text for b in msg.content if b.type == "text")
    m = re.search(r"\{.*\}", text, re.S)
    plan = json.loads(m.group(0) if m else text)
    plan["engine"] = "claude"
    return plan


def offline_revise(plan: dict, comment: str, asset: str | None) -> dict:
    """Простые правки без ИИ (для тестов и запасного режима): «короче», «заголовок: …»,
    «убери: …». Свободные правки голосом/текстом обрабатывает claude_plan(revision=...)."""
    plan = json.loads(json.dumps(plan))
    targets = [asset] if asset else list(plan["assets"])
    c = comment.lower()
    for a in targets:
        node = plan["assets"].get(a)
        if not node:
            continue
        for key in ("text", "description", "title"):
            if key not in node:
                continue
            val = node[key]
            if "короче" in c:
                parts = re.split(r"(?<=[.!?])\s+", val)
                node[key] = " ".join(parts[: max(1, len(parts) // 2)])
            m = re.search(r"убери[:\s]+«?([^»]+)»?", comment, re.I)
            if m:
                node[key] = node[key].replace(m.group(1).strip(), "").replace("  ", " ").strip()
        m = re.search(r"заголовок[:\s]+(.+)$", comment, re.I)
        if m and "title" in node:
            node["title"] = m.group(1).strip()
    plan.setdefault("revisions", []).append({"comment": comment, "asset": asset or "*"})
    return plan


def make_plan(engine: str, transcript: dict, topic, item_id, route, brand_site,
              revision=None, previous=None, asset=None) -> dict:
    if engine == "claude":
        return claude_plan(transcript, topic, item_id, route, revision, previous)
    if revision and previous:
        return offline_revise(previous, revision, asset)
    return offline_plan(transcript, topic, brand_site, item_id)
