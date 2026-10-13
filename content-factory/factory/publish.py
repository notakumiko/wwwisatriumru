"""Выпуск. Два независимых решения владельца:
  1) одобрение материала (approvals) — «содержание верно, мне нравится»;
  2) разрешение на выпуск (release_rules) — «можно публиковать в канал X».
Без обоих выпуск невозможен. Повторный вызов с тем же ключом не создаёт дубль.

Режимы: dryrun — кладёт готовый запрос в «Исходящие» (по умолчанию);
live — реальная отправка через адаптер канала; включается только после
отдельного разрешения владельца и проверки адаптера частным тестом.
"""

from __future__ import annotations

import hashlib
import json
import time

from .config import Settings
from .store import Store


class NotAllowed(PermissionError):
    pass


def key(item_id: str, version: int, asset: str, channel: str) -> str:
    return hashlib.sha256(f"{item_id}|{version}|{asset}|{channel}".encode()).hexdigest()[:24]


def publish(settings: Settings, store: Store, item_id: str, version: int, asset: str,
            channel: str) -> dict:
    if not store.is_approved(item_id, version):
        raise NotAllowed(f"Версия v{version} материала {item_id} не одобрена")
    if not store.release_allowed(item_id, channel):
        raise NotAllowed(f"Нет разрешения на выпуск в {channel}")

    k = key(item_id, version, asset, channel)
    existing = store.db.execute("SELECT * FROM publications WHERE idempotency_key=?", (k,)).fetchone()
    if existing and existing["status"] in ("queued", "sent", "confirmed"):
        return dict(existing) | {"duplicate": True}

    with store.tx() as db:
        db.execute(
            "INSERT OR REPLACE INTO publications(idempotency_key,item_id,version,asset,channel,status,at)"
            " VALUES(?,?,?,?,?,'queued',?)", (k, item_id, version, asset, channel, time.time()))

    if settings.publish_mode != "live":
        outbox = settings.workbase / ".factory" / "outbox"
        outbox.mkdir(parents=True, exist_ok=True)
        (outbox / f"{k}.json").write_text(json.dumps({
            "item_id": item_id, "version": version, "asset": asset, "channel": channel,
            "package": str(settings.folder("ready") / item_id / f"v{version}"),
        }, ensure_ascii=False, indent=2), encoding="utf-8")
        store.log("publish_dryrun", item_id, channel=channel, asset=asset, version=version)
        return {"idempotency_key": k, "status": "queued", "mode": "dryrun", "duplicate": False}

    raise NotImplementedError(
        "Живые адаптеры каналов подключаются после разрешения владельца (см. docs/ПРОЕКТ.md, этап 4)")
