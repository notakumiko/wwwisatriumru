"""Распознавание речи. Формат результата единый для всех движков:

{"language": "ru", "segments": [{"start": s, "end": s, "text": str,
                                 "words": [{"start": s, "end": s, "word": str}]}]}

Движки:
  fixture — готовая расшифровка рядом с исходником (source.transcript.json); для тестов
            и для случая, когда расшифровку прислали вместе с видео.
  whisper — faster-whisper (large-v3) на сервере, без передачи аудио третьим лицам.
            Требует `pip install faster-whisper` и однократную загрузку модели.
  Внешние API (ElevenLabs Scribe, Yandex SpeechKit) подключаются отдельным адаптером
  только после разрешения владельца на передачу аудио.
"""

from __future__ import annotations

import json
from pathlib import Path


class SpeechUnavailable(RuntimeError):
    pass


def transcribe(engine: str, audio: Path, source_dir: Path) -> dict:
    if engine == "fixture":
        f = source_dir / "source.transcript.json"
        if not f.exists():
            raise SpeechUnavailable(
                "Нет готовой расшифровки (source.transcript.json), а движок распознавания "
                "на этом сервере не включён."
            )
        return json.loads(f.read_text(encoding="utf-8"))
    if engine == "whisper":
        try:
            from faster_whisper import WhisperModel  # type: ignore
        except ImportError as e:
            raise SpeechUnavailable("faster-whisper не установлен") from e
        model = WhisperModel("large-v3", device="auto", compute_type="int8")
        segments, info = model.transcribe(
            str(audio), language="ru", word_timestamps=True, vad_filter=True
        )
        out = []
        for s in segments:
            out.append({
                "start": s.start, "end": s.end, "text": s.text.strip(),
                "words": [{"start": w.start, "end": w.end, "word": w.word.strip()}
                          for w in (s.words or [])],
            })
        return {"language": info.language, "segments": out}
    raise SpeechUnavailable(f"Движок распознавания «{engine}» не настроен")
