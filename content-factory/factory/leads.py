"""Учёт обращений и связь с темами.

Каждый материал получает код (item_id). Он уходит в UTM-метки ссылок и может
звучать как кодовое слово («напишите в директ слово ФАКТУРА»). Когда приходит
обращение — сайт, Telegram, директ — фиксируем канал и код. Раз в неделю отчёт
показывает, какие темы приводят подходящих людей, а не просто просмотры.
Персональные данные клиентов в общей библиотеке не храним — только отметку.
"""

from __future__ import annotations

import time
from collections import defaultdict

from .store import Store


def add_lead(store: Store, channel: str, campaign: str | None, quality: str = "maybe",
             contact_hint: str = "") -> int:
    cur = store.db.execute(
        "INSERT INTO leads(at,channel,campaign,contact_hint,quality) VALUES(?,?,?,?,?)",
        (time.time(), channel, campaign, contact_hint, quality))
    store.log("lead", campaign, channel=channel, quality=quality)
    return cur.lastrowid


def report(store: Store, since_days: int = 30) -> list[dict]:
    since = time.time() - since_days * 86400
    rows = store.db.execute(
        """SELECT l.campaign, l.quality, l.channel, i.topic, i.route FROM leads l
           LEFT JOIN items i ON i.id = l.campaign WHERE l.at >= ?""", (since,)).fetchall()
    agg = defaultdict(lambda: {"total": 0, "fit": 0, "channels": defaultdict(int)})
    for r in rows:
        k = (r["campaign"] or "без кода", r["topic"] or "—", r["route"] or "—")
        agg[k]["total"] += 1
        agg[k]["fit"] += r["quality"] == "fit"
        agg[k]["channels"][r["channel"]] += 1
    out = [{"campaign": k[0], "topic": k[1], "route": k[2], "total": v["total"], "fit": v["fit"],
            "channels": dict(v["channels"])} for k, v in agg.items()]
    return sorted(out, key=lambda x: (-x["fit"], -x["total"]))
