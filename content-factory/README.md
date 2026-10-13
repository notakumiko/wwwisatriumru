# Контент-завод ATRIUM

Серверное ядро конвейера: видео или заметка Натальи → материалы для каналов →
согласование → выпуск только по разрешению → учёт заявок.

- Проект целиком (архитектура, каналы, стоимость, план, бриф): [`docs/project.html`](docs/project.html)
- Правила бренда для редактора: [`../.claude/skills/atrium-content/SKILL.md`](../.claude/skills/atrium-content/SKILL.md)

## Что внутри

| Модуль | Делает |
|---|---|
| `factory/ingest.py` | приём без дублей (sha256), атомарная копия во «Входящие» |
| `factory/speech.py` | расшифровка: готовый файл или faster-whisper на сервере |
| `factory/planner.py` | план материалов: офлайн-черновик или Claude API с навыком ATRIUM |
| `factory/media.py` | ffmpeg: удаление пауз, 9:16, субтитры в стиле бренда, −14 LUFS, обложка |
| `factory/render.py` | карусель 4:5 и пин 2:3 в палитре сайта, метка «ИИ-концепция» |
| `factory/package.py` | версия пакета `03 — Результаты/<код>/vN` + страница просмотра для телефона |
| `factory/publish.py` | выпуск только при одобрении **и** разрешении; ключ против дублей |
| `factory/leads.py` | учёт заявок по коду материала, отчёт по темам |
| `factory/pipeline.py` | маршруты, продолжение после сбоя, правки → новые версии |

## Проверка

```bash
cd content-factory
python3 -m unittest -v tests.test_factory   # нужны ffmpeg и Pillow
```

Тесты частные: синтетическое видео, ничего не публикуется, внешние сервисы не вызываются.

## Запуск на сервере (этап 1, выполняет обслуживающий специалист)

```bash
export ATRIUM_WORKBASE=/home/atriumdesk/Workbase
export ATRIUM_SPEECH=whisper        # после pip install faster-whisper
export ATRIUM_PLANNER=claude        # после ANTHROPIC_API_KEY в /etc/atrium/factory.env
python3 -m factory.cli ingest /путь/к/видео.mov --topic "Тема"
python3 -m factory.cli process <код>
python3 -m factory.cli resume       # после перезагрузки
```

Секреты хранятся только в файле окружения на сервере — не в Drive и не в репозитории.
Режим выпуска по умолчанию `dryrun`; живая публикация включается отдельным разрешением владельца.
