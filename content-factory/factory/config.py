"""Пути и настройки. Всё переопределяется переменными окружения, секретов здесь нет."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

# Папки рабочей базы. Совпадают по смыслу с папками Google Drive «Рабочая база»,
# чтобы синхронизация (rclone) была один-в-один.
FOLDERS = {
    "inbox": "02 — Входящие",
    "work": "04 — Работа в процессе",
    "ready": "03 — Результаты",
    "projects": "01 — Проекты и материалы",
    "versions": "99 — Версии и восстановление",
}


@dataclass(frozen=True)
class Brand:
    # Палитра сайта isatrium.ru (src/app/globals.css)
    bg: str = "#15120d"
    surface: str = "#1e1912"
    ink: str = "#ece4d3"
    stone: str = "#a99d87"
    accent: str = "#b6905b"
    accent_light: str = "#d8b787"
    font_sans: str = "Inter"
    font_serif: str = "Playfair Display"  # на сервере установить шрифт; иначе подставится Inter
    site: str = "https://isatrium.ru"
    telegram: str = "https://t.me/art_interior_house"


@dataclass
class Settings:
    workbase: Path
    db_path: Path
    brand: Brand = field(default_factory=Brand)
    speech_engine: str = "fixture"  # fixture | whisper | none
    planner_engine: str = "offline"  # offline | claude
    publish_mode: str = "dryrun"  # dryrun | live (live требует отдельного разрешения владельца)

    def folder(self, key: str) -> Path:
        p = self.workbase / FOLDERS[key]
        p.mkdir(parents=True, exist_ok=True)
        return p


def load(workbase: str | os.PathLike | None = None) -> Settings:
    base = Path(workbase or os.environ.get("ATRIUM_WORKBASE", "/home/atriumdesk/Workbase"))
    base.mkdir(parents=True, exist_ok=True)
    state = base / ".factory"
    state.mkdir(exist_ok=True)
    return Settings(
        workbase=base,
        db_path=state / "factory.sqlite3",
        speech_engine=os.environ.get("ATRIUM_SPEECH", "fixture"),
        planner_engine=os.environ.get("ATRIUM_PLANNER", "offline"),
        publish_mode=os.environ.get("ATRIUM_PUBLISH", "dryrun"),
    )
