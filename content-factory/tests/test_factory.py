"""Частные тесты ядра завода. Ничего не публикуют и не обращаются к внешним сервисам.

Запуск:  cd content-factory && python3 -m unittest -v tests.test_factory
"""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from factory import config, leads, media, publish  # noqa: E402
from factory.ingest import ingest  # noqa: E402
from factory.pipeline import Pipeline  # noqa: E402
from factory.store import Store  # noqa: E402

# Речь: интервалы со звуком; внутри второй фразы — длинная пауза (1.4 с)
SPEECH = [
    (0.5, 5.0, "Почему мы почти никогда не ставим холодный свет в гостиной."),
    (6.4, 9.0, "Холодный свет делает фактуры плоскими,"),
    (10.4, 14.5, "а тёплый проявляет штукатурку, дерево и латунь."),
    (16.0, 22.0, "В проектах мы закладываем три сценария света: дневной, вечерний и акцентный."),
    (23.5, 30.0, "Акцентный свет работает на искусство и авторские предметы, а не на потолок."),
    (31.5, 38.0, "Поэтому свет мы продумываем ещё на этапе планировки, а не после ремонта."),
]


def words_for(start, end, text):
    ws = text.split()
    step = (end - start) / len(ws)
    return [{"start": round(start + i * step, 3), "end": round(start + (i + 1) * step - 0.02, 3), "word": w}
            for i, w in enumerate(ws)]


def make_video(path: Path, landscape=True):
    cond = "+".join(f"between(t,{a},{b})" for a, b, _ in SPEECH)
    size = "1920x1080" if landscape else "1080x1920"
    subprocess.run([
        "ffmpeg", "-y", "-v", "error",
        "-f", "lavfi", "-i", f"testsrc2=size={size}:rate=30:duration=40",
        "-f", "lavfi", "-i", f"aevalsrc='if({cond},0.4*sin(2*PI*220*t)*(0.6+0.4*sin(2*PI*3*t)),0)':s=48000:d=40",
        "-c:v", "libx264", "-preset", "ultrafast", "-c:a", "aac", "-shortest", str(path),
    ], check=True)
    transcript = {"language": "ru", "segments": [
        {"start": a, "end": b, "text": t, "words": words_for(a, b, t)} for a, b, t in SPEECH]}
    path.with_name(path.stem + ".transcript.json").write_text(
        json.dumps(transcript, ensure_ascii=False), encoding="utf-8")


class FactoryTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        root = Path(cls.tmp.name)
        cls.src_dir = root / "phone"
        cls.src_dir.mkdir()
        cls.video = cls.src_dir / "IMG_0412.mov"
        make_video(cls.video)
        cls.s = config.load(root / "Workbase")
        cls.st = Store(cls.s.db_path)
        cls.pl = Pipeline(cls.s, cls.st)

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def test_1_full_route_talking_video(self):
        iid, created = ingest(self.s, self.st, self.video, topic="Свет и фактуры")
        self.assertTrue(created)
        vdir = self.pl.process(iid)
        m = json.loads((vdir / "manifest.json").read_text(encoding="utf-8"))
        self.assertGreaterEqual(len(m["clips"]), 1)
        for c in m["clips"]:
            self.assertEqual((c["width"], c["height"]), (1080, 1920))
            self.assertTrue((vdir / c["file"]).exists())
            self.assertTrue((vdir / c["cover"]).exists())
            self.assertGreater(c["subtitle_lines"], 0)
            src_len = c["source_range"][1] - c["source_range"][0]
            self.assertLess(c["duration"], src_len, "паузы должны вырезаться")
        self.assertTrue((vdir / "preview.html").exists())
        self.assertTrue(m["files"]["carousel"])
        for name in ("telegram_post", "reel_caption", "pinterest", "youtube_short", "threads"):
            self.assertTrue((vdir / "texts" / f"{name}.txt").read_text(encoding="utf-8").strip())
            self.assertIn(f"utm_campaign={iid}", m["links"][name])
        type(self).iid = iid

    def test_2_same_file_again_is_not_duplicated(self):
        iid2, created = ingest(self.s, self.st, self.video)
        self.assertFalse(created)
        self.assertEqual(iid2, self.iid)
        self.assertEqual(self.st.db.execute("SELECT COUNT(*) c FROM items").fetchone()["c"], 1)
        # повторная обработка не создаёт новых версий
        self.pl.process(self.iid)
        self.assertEqual(self.st.latest_version(self.iid), 1)

    def test_3_crash_and_resume(self):
        other = self.src_dir / "IMG_0413.mov"
        make_video(other, landscape=False)
        iid, _ = ingest(self.s, self.st, other, topic="Вертикальный исходник")
        real = media.render_vertical_clip
        calls = {"n": 0}

        def flaky(*a, **kw):
            calls["n"] += 1
            if calls["n"] == 1:
                raise RuntimeError("имитация перезагрузки сервера во время монтажа")
            return real(*a, **kw)

        with mock.patch("factory.media.render_vertical_clip", side_effect=flaky):
            with self.assertRaises(RuntimeError):
                self.pl.process(iid)
            self.assertEqual(self.st.step_status(iid, "render:1"), "failed")
            self.assertEqual(self.st.step_status(iid, "transcribe"), "done")
            # «после перезапуска» — новый объект, та же база
            vdir = Pipeline(self.s, Store(self.s.db_path)).process(iid)
        self.assertEqual(self.st.step_status(iid, "package:1"), "done")
        self.assertFalse(list(vdir.parent.glob("*.part")), "не должно остаться полуфабрикатов")
        m = json.loads((vdir / "manifest.json").read_text(encoding="utf-8"))
        self.assertEqual((m["clips"][0]["width"], m["clips"][0]["height"]), (1080, 1920))

    def test_4_revision_creates_new_version_and_keeps_old(self):
        v1 = self.pl.current(self.iid)
        old_text = (v1 / "texts" / "telegram_post.txt").read_text(encoding="utf-8")
        v2 = self.pl.revise(self.iid, "короче", asset="telegram_post")
        self.assertEqual(v2.name, "v2")
        new_text = (v2 / "texts" / "telegram_post.txt").read_text(encoding="utf-8")
        self.assertLess(len(new_text), len(old_text))
        self.assertEqual((v1 / "texts" / "telegram_post.txt").read_text(encoding="utf-8"), old_text)
        # ролики не перемонтируются, если правка касалась только текста
        m1 = json.loads((v1 / "manifest.json").read_text(encoding="utf-8"))
        m2 = json.loads((v2 / "manifest.json").read_text(encoding="utf-8"))
        self.assertEqual([c["file"] for c in m1["clips"]], [c["file"] for c in m2["clips"]])

    def test_5_publish_needs_approval_and_release_permission(self):
        with self.assertRaises(publish.NotAllowed):
            publish.publish(self.s, self.st, self.iid, 2, "telegram_post", "telegram")
        self.st.approve(self.iid, 2, "approved")
        with self.assertRaises(publish.NotAllowed):  # одобрено, но выпуск не разрешён
            publish.publish(self.s, self.st, self.iid, 2, "telegram_post", "telegram")
        self.st.grant_release("telegram", f"item:{self.iid}", "Наталья (тест)")
        r1 = publish.publish(self.s, self.st, self.iid, 2, "telegram_post", "telegram")
        r2 = publish.publish(self.s, self.st, self.iid, 2, "telegram_post", "telegram")
        self.assertEqual(r1["mode"], "dryrun")
        self.assertTrue(r2["duplicate"])
        self.assertEqual(self.st.db.execute("SELECT COUNT(*) c FROM publications").fetchone()["c"], 1)
        with self.assertRaises(publish.NotAllowed):  # разрешение на один канал не распространяется на другой
            publish.publish(self.s, self.st, self.iid, 2, "pinterest", "pinterest")

    def test_6_no_shoot_route_with_ai_label(self):
        notes = self.src_dir / "подборка-травертин.md"
        notes.write_text(
            "# Подборка: травертин в спальне\n"
            "ИИ-концепция для обсуждения, не реализованный проект.\n"
            "Травертин смягчает спальню за счёт пор и тёплого оттенка.\n"
            "Его стоит сочетать с льном и матовой латунью.\n"
            "В изголовье травертин работает лучше, чем на полу.\n", encoding="utf-8")
        iid, _ = ingest(self.s, self.st, notes, topic="Травертин в спальне")
        vdir = self.pl.process(iid)
        m = json.loads((vdir / "manifest.json").read_text(encoding="utf-8"))
        self.assertEqual(m["clips"], [])
        self.assertTrue(m["ai_label"])
        self.assertTrue(m["key_idea"].startswith("Подборка: травертин"))
        texts = (vdir / "texts" / "telegram_post.txt").read_text(encoding="utf-8").lower()
        self.assertNotIn("ии-концепция для обсуждения", texts)
        self.assertTrue((vdir / "pin.jpg").exists())
        self.assertGreaterEqual(len(m["files"]["carousel"]), 3)

    def test_7_leads_report_links_topics(self):
        leads.add_lead(self.st, "telegram", self.iid, "fit")
        leads.add_lead(self.st, "site", self.iid, "maybe")
        leads.add_lead(self.st, "instagram", None, "no")
        rep = leads.report(self.st)
        top = rep[0]
        self.assertEqual(top["campaign"], self.iid)
        self.assertEqual(top["topic"], "Свет и фактуры")
        self.assertEqual((top["total"], top["fit"]), (2, 1))


if __name__ == "__main__":
    unittest.main(verbosity=2)
