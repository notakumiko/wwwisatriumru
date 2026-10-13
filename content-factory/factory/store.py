"""Журнал состояния завода (SQLite).

Одна база отвечает на вопросы: что пришло, на каком шаге, какая версия актуальна,
кто и что одобрил, что и куда выпущено, откуда пришла заявка. Уникальные ключи
не дают создать дубль при повторном запуске.
"""

from __future__ import annotations

import json
import sqlite3
import time
from contextlib import contextmanager
from pathlib import Path

SCHEMA = """
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  sha256 TEXT UNIQUE NOT NULL,
  route TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_path TEXT NOT NULL,
  topic TEXT,
  created_at REAL NOT NULL,
  meta TEXT DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS steps (
  item_id TEXT NOT NULL,
  step TEXT NOT NULL,
  status TEXT NOT NULL,          -- running | done | failed
  attempts INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  updated_at REAL NOT NULL,
  PRIMARY KEY (item_id, step)
);
CREATE TABLE IF NOT EXISTS versions (
  item_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  path TEXT NOT NULL,
  note TEXT,
  created_at REAL NOT NULL,
  PRIMARY KEY (item_id, version)
);
CREATE TABLE IF NOT EXISTS approvals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  asset TEXT NOT NULL,           -- '*' = весь пакет
  decision TEXT NOT NULL,        -- approved | revise | rejected
  comment TEXT,
  at REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS release_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel TEXT NOT NULL,         -- telegram | instagram | ... | '*'
  scope TEXT NOT NULL,           -- 'item:<id>' или 'approved-any'
  granted_by TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  at REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS publications (
  idempotency_key TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  asset TEXT NOT NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL,          -- queued | sent | confirmed | failed
  external_url TEXT,
  at REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at REAL NOT NULL,
  channel TEXT NOT NULL,
  campaign TEXT,                 -- код материала (= items.id) из UTM или промо-слова
  contact_hint TEXT,             -- без персональных данных в общей библиотеке
  quality TEXT,                  -- fit | maybe | no
  status TEXT NOT NULL DEFAULT 'new'
);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at REAL NOT NULL,
  item_id TEXT,
  kind TEXT NOT NULL,
  data TEXT
);
"""


class Store:
    def __init__(self, path: Path):
        self.path = Path(path)
        self.db = sqlite3.connect(self.path, isolation_level=None, timeout=30)
        self.db.row_factory = sqlite3.Row
        self.db.execute("PRAGMA journal_mode=WAL")
        self.db.executescript(SCHEMA)

    @contextmanager
    def tx(self):
        self.db.execute("BEGIN IMMEDIATE")
        try:
            yield self.db
            self.db.execute("COMMIT")
        except BaseException:
            self.db.execute("ROLLBACK")
            raise

    def log(self, kind: str, item_id: str | None = None, **data):
        self.db.execute(
            "INSERT INTO events(at,item_id,kind,data) VALUES(?,?,?,?)",
            (time.time(), item_id, kind, json.dumps(data, ensure_ascii=False)),
        )

    # --- материалы
    def item_by_sha(self, sha: str):
        return self.db.execute("SELECT * FROM items WHERE sha256=?", (sha,)).fetchone()

    def item(self, item_id: str):
        return self.db.execute("SELECT * FROM items WHERE id=?", (item_id,)).fetchone()

    # --- шаги
    def step_status(self, item_id: str, step: str) -> str | None:
        r = self.db.execute(
            "SELECT status FROM steps WHERE item_id=? AND step=?", (item_id, step)
        ).fetchone()
        return r["status"] if r else None

    def mark_step(self, item_id: str, step: str, status: str, error: str | None = None):
        self.db.execute(
            """INSERT INTO steps(item_id,step,status,attempts,error,updated_at)
               VALUES(?,?,?,?,?,?)
               ON CONFLICT(item_id,step) DO UPDATE SET
                 status=excluded.status,
                 attempts=steps.attempts + (excluded.status='running'),
                 error=excluded.error, updated_at=excluded.updated_at""",
            (item_id, step, status, 1 if status == "running" else 0, error, time.time()),
        )

    def steps(self, item_id: str):
        return self.db.execute(
            "SELECT * FROM steps WHERE item_id=? ORDER BY updated_at", (item_id,)
        ).fetchall()

    # --- версии
    def latest_version(self, item_id: str) -> int:
        r = self.db.execute(
            "SELECT MAX(version) v FROM versions WHERE item_id=?", (item_id,)
        ).fetchone()
        return r["v"] or 0

    def add_version(self, item_id: str, version: int, path: str, note: str = ""):
        self.db.execute(
            "INSERT OR IGNORE INTO versions(item_id,version,path,note,created_at) VALUES(?,?,?,?,?)",
            (item_id, version, path, note, time.time()),
        )

    # --- согласования и разрешения
    def approve(self, item_id: str, version: int, decision: str, comment: str = "", asset: str = "*"):
        assert decision in ("approved", "revise", "rejected")
        self.db.execute(
            "INSERT INTO approvals(item_id,version,asset,decision,comment,at) VALUES(?,?,?,?,?,?)",
            (item_id, version, asset, decision, comment, time.time()),
        )
        self.log("approval", item_id, version=version, decision=decision, comment=comment)

    def is_approved(self, item_id: str, version: int) -> bool:
        r = self.db.execute(
            "SELECT decision FROM approvals WHERE item_id=? AND version=? ORDER BY id DESC LIMIT 1",
            (item_id, version),
        ).fetchone()
        return bool(r and r["decision"] == "approved")

    def grant_release(self, channel: str, scope: str, granted_by: str):
        self.db.execute(
            "INSERT INTO release_rules(channel,scope,granted_by,at) VALUES(?,?,?,?)",
            (channel, scope, granted_by, time.time()),
        )

    def release_allowed(self, item_id: str, channel: str) -> bool:
        r = self.db.execute(
            """SELECT 1 FROM release_rules WHERE active=1
               AND channel IN (?, '*') AND scope IN (?, 'approved-any') LIMIT 1""",
            (channel, f"item:{item_id}"),
        ).fetchone()
        return bool(r)
