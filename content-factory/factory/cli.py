"""Командная строка для сервера и обслуживающего специалиста (владельцу не нужна).

  python -m factory.cli ingest <файл> [--topic ...]
  python -m factory.cli process <item_id>
  python -m factory.cli revise <item_id> "<правка обычными словами>" [--asset telegram_post]
  python -m factory.cli approve <item_id> <version>
  python -m factory.cli status <item_id>
  python -m factory.cli resume            — довести все незавершённые материалы
  python -m factory.cli lead <channel> <item_id|-> [fit|maybe|no]
  python -m factory.cli report [--days 30]
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from . import config, leads
from .ingest import ingest
from .pipeline import Pipeline
from .store import Store


def main(argv=None):
    ap = argparse.ArgumentParser(prog="factory")
    ap.add_argument("--workbase")
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("ingest"); p.add_argument("file"); p.add_argument("--topic"); p.add_argument("--route")
    p = sub.add_parser("process"); p.add_argument("item")
    p = sub.add_parser("revise"); p.add_argument("item"); p.add_argument("comment"); p.add_argument("--asset")
    p = sub.add_parser("approve"); p.add_argument("item"); p.add_argument("version", type=int)
    p = sub.add_parser("status"); p.add_argument("item")
    sub.add_parser("resume")
    p = sub.add_parser("lead"); p.add_argument("channel"); p.add_argument("item"); p.add_argument("quality", nargs="?", default="maybe")
    p = sub.add_parser("report"); p.add_argument("--days", type=int, default=30)
    a = ap.parse_args(argv)

    s = config.load(a.workbase)
    st = Store(s.db_path)
    pl = Pipeline(s, st)

    if a.cmd == "ingest":
        iid, created = ingest(s, st, Path(a.file), a.route, a.topic)
        print(json.dumps({"item": iid, "created": created}, ensure_ascii=False))
    elif a.cmd == "process":
        print(pl.process(a.item))
    elif a.cmd == "revise":
        print(pl.revise(a.item, a.comment, a.asset))
    elif a.cmd == "approve":
        st.approve(a.item, a.version, "approved")
        print("ok")
    elif a.cmd == "status":
        print(json.dumps({"item": dict(st.item(a.item)), "version": st.latest_version(a.item),
                          "steps": [dict(r) for r in st.steps(a.item)]}, ensure_ascii=False, indent=2))
    elif a.cmd == "resume":
        rows = st.db.execute("SELECT DISTINCT item_id FROM steps WHERE status!='done'").fetchall()
        for r in rows:
            try:
                print(r["item_id"], "→", pl.process(r["item_id"]))
            except Exception as e:  # отчёт о сбое уходит в журнал и на пульт
                print(r["item_id"], "сбой:", e)
    elif a.cmd == "lead":
        print(leads.add_lead(st, a.channel, None if a.item == "-" else a.item, a.quality))
    elif a.cmd == "report":
        print(json.dumps(leads.report(st, a.days), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
