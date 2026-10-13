"""Приём исходника: хэш → проверка дубля → копия во «Входящие» → запись в журнал.

Повторная отправка того же файла (из Telegram, с Drive, вручную) не создаёт второй
материал: возвращается уже существующий.
"""

from __future__ import annotations

import hashlib
import json
import shutil
import time
from pathlib import Path

from .config import Settings
from .store import Store

VIDEO = {".mp4", ".mov", ".m4v", ".mkv", ".webm"}
AUDIO = {".m4a", ".mp3", ".ogg", ".oga", ".wav", ".opus"}
TEXT = {".txt", ".md", ".json"}
IMAGE = {".jpg", ".jpeg", ".png", ".heic", ".webp"}


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def guess_route(path: Path) -> str:
    ext = path.suffix.lower()
    if ext in VIDEO:
        return "talking_video"
    if ext in AUDIO:
        return "voice_story"
    if ext in TEXT:
        return "no_shoot"
    if ext in IMAGE:
        return "photo_story"
    raise ValueError(f"Неизвестный тип исходника: {path.name}")


def ingest(settings: Settings, store: Store, src: Path, route: str | None = None,
           topic: str | None = None) -> tuple[str, bool]:
    """Возвращает (item_id, created). created=False — это дубль уже принятого файла."""
    src = Path(src)
    digest = sha256(src)
    existing = store.item_by_sha(digest)
    if existing:
        store.log("ingest_duplicate", existing["id"], source=src.name)
        return existing["id"], False

    route = route or guess_route(src)
    item_id = time.strftime("A%y%m%d-") + digest[:6]
    dest_dir = settings.folder("inbox") / item_id
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / f"source{src.suffix.lower()}"
    tmp = dest.with_suffix(dest.suffix + ".part")
    shutil.copy2(src, tmp)
    tmp.replace(dest)  # атомарно: недокопированный файл никогда не выглядит готовым

    # сопроводительные файлы (готовая расшифровка, заметки) — берём, если лежат рядом
    for sidecar in (".transcript.json", ".notes.md"):
        s = src.with_name(src.stem + sidecar)
        if s.exists():
            shutil.copy2(s, dest_dir / f"source{sidecar}")

    with store.tx() as db:
        db.execute(
            "INSERT INTO items(id,sha256,route,source_name,source_path,topic,created_at,meta)"
            " VALUES(?,?,?,?,?,?,?,?)",
            (item_id, digest, route, src.name, str(dest), topic, time.time(),
             json.dumps({}, ensure_ascii=False)),
        )
    store.log("ingested", item_id, route=route, source=src.name)
    return item_id, True
