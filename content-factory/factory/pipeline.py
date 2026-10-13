"""Маршруты завода и восстановление после сбоя.

Каждый шаг: если уже «done» — пропускается; результат пишется во временный файл и
атомарно переименовывается; статус фиксируется в журнале. После падения или
перезагрузки сервера тот же вызов `process()` продолжает с упавшего шага.
"""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

from . import media, package, planner, speech
from .config import Settings
from .store import Store


class Pipeline:
    def __init__(self, settings: Settings, store: Store):
        self.s, self.st = settings, store

    # --- служебное
    def workdir(self, item_id: str) -> Path:
        d = self.s.folder("work") / item_id
        d.mkdir(parents=True, exist_ok=True)
        return d

    def _step(self, item_id: str, name: str, fn):
        if self.st.step_status(item_id, name) == "done":
            return
        self.st.mark_step(item_id, name, "running")
        try:
            fn()
        except Exception as e:
            self.st.mark_step(item_id, name, "failed", f"{type(e).__name__}: {e}")
            self.st.log("step_failed", item_id, step=name, error=str(e))
            raise
        self.st.mark_step(item_id, name, "done")

    @staticmethod
    def _write_json(path: Path, data):
        tmp = path.with_suffix(path.suffix + ".part")
        tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        tmp.replace(path)

    @staticmethod
    def _read_json(path: Path):
        return json.loads(path.read_text(encoding="utf-8"))

    # --- маршруты
    def process(self, item_id: str) -> Path:
        item = self.st.item(item_id)
        route = item["route"]
        if route == "talking_video":
            return self._talking_video(item)
        if route == "no_shoot":
            return self._no_shoot(item)
        raise NotImplementedError(f"Маршрут {route} описан в проекте, код — на этапе 3")

    def _talking_video(self, item) -> Path:
        iid, src = item["id"], Path(item["source_path"])
        wd = self.workdir(iid)
        self._step(iid, "probe", lambda: self._write_json(wd / "probe.json", media.probe(src)))
        self._step(iid, "audio", lambda: media.extract_audio(src, wd / "audio.wav"))
        self._step(iid, "transcribe", lambda: self._write_json(
            wd / "transcript.json", speech.transcribe(self.s.speech_engine, wd / "audio.wav", src.parent)))
        self._plan(item, 1)
        self._render(iid, src, 1)
        self._package(iid, 1)
        return self.current(iid)

    def _no_shoot(self, item) -> Path:
        """Заметки/референсы/подборка → пост, карусель, пин. Без видео."""
        iid, src = item["id"], Path(item["source_path"])
        wd = self.workdir(iid)

        def to_transcript():
            text = src.read_text(encoding="utf-8")
            parts = [p.strip() for p in re.split(r"(?<=[.!?])\s+|\n+", text) if p.strip()]
            # заголовок «# …» — тема; строка-пометка об ИИ в текст не идёт: метку ставит вёрстка
            heading = next((p.lstrip("# ").strip() for p in parts if p.startswith("#")), None)
            body = [p for p in parts if not p.startswith("#") and "ии-концепция" not in p.lower()]
            if heading:
                body.insert(0, heading.rstrip(".") + ".")
            segs = [{"start": float(i), "end": float(i + 1), "text": p, "words": []}
                    for i, p in enumerate(body)]
            self._write_json(wd / "transcript.json", {"language": "ru", "segments": segs})

        self._step(iid, "notes", to_transcript)
        self._plan(item, 1)
        self._step(iid, "render:1", lambda: self._write_json(wd / "clips_v1.json", []))
        self._package(iid, 1)
        return self.current(iid)

    def _plan(self, item, version: int, comment: str | None = None, asset: str | None = None):
        iid = item["id"]
        wd = self.workdir(iid)

        def run():
            transcript = self._read_json(wd / "transcript.json")
            prev = self._read_json(wd / f"plan_v{version - 1}.json") if version > 1 else None
            plan = planner.make_plan(self.s.planner_engine, transcript, item["topic"], iid,
                                     item["route"], self.s.brand.site, comment, prev, asset)
            if item["route"] == "no_shoot":
                plan["clips"] = []
            self._write_json(wd / f"plan_v{version}.json", plan)

        self._step(iid, f"plan:{version}", run)

    def _render(self, iid: str, src: Path, version: int, reuse_from: int | None = None):
        wd = self.workdir(iid)

        def run():
            plan = self._read_json(wd / f"plan_v{version}.json")
            if reuse_from:
                prev = self._read_json(wd / f"plan_v{reuse_from}.json")
                if prev["clips"] == plan["clips"]:
                    shutil.copy2(wd / f"clips_v{reuse_from}.json", wd / f"clips_v{version}.json")
                    return
            words = [w for s in self._read_json(wd / "transcript.json")["segments"] for w in s["words"]]
            out_dir = wd / "clips"
            out_dir.mkdir(exist_ok=True)
            results = []
            for c in plan["clips"]:
                out = out_dir / f"reel_{c['id']}_v{version}.mp4"
                r = media.render_vertical_clip(src, c["start"], c["end"], words, out, self.s.brand)
                r["title"] = c.get("title")
                results.append(r)
            self._write_json(wd / f"clips_v{version}.json", results)

        self._step(iid, f"render:{version}", run)

    def _package(self, iid: str, version: int) -> Path:
        wd = self.workdir(iid)

        def run():
            plan = self._read_json(wd / f"plan_v{version}.json")
            clips = self._read_json(wd / f"clips_v{version}.json")
            notes = Path(self.st.item(iid)["source_path"])
            ai = notes.suffix in (".md", ".txt") and "ии-концепция" in notes.read_text(encoding="utf-8").lower()
            vdir = package.build(self.s, iid, version, plan, clips, wd / "clips", ai_label=ai)
            self.st.add_version(iid, version, str(vdir), "; ".join(r["comment"] for r in plan.get("revisions", [])))

        self._step(iid, f"package:{version}", run)
        return self.s.folder("ready") / iid / f"v{version}"

    # --- правки и статус
    def revise(self, iid: str, comment: str, asset: str | None = None) -> Path:
        item = self.st.item(iid)
        cur = self.st.latest_version(iid)
        self.st.approve(iid, cur, "revise", comment, asset or "*")
        new = cur + 1
        self._plan(item, new, comment, asset)
        if item["route"] == "talking_video":
            self._render(iid, Path(item["source_path"]), new, reuse_from=cur)
        else:
            self._step(iid, f"render:{new}", lambda: self._write_json(self.workdir(iid) / f"clips_v{new}.json", []))
        return self._package(iid, new)

    def current(self, iid: str) -> Path:
        return self.s.folder("ready") / iid / f"v{self.st.latest_version(iid)}"
