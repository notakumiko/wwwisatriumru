[README.md](https://github.com/user-attachments/files/29855522/README.md)
# wwwisatriumru# ATRIUM — сайт студии дизайна интерьеров

Новая версия сайта [isatrium.ru](https://isatrium.ru) — студии дизайна интерьеров ATRIUM.
Цель проекта: быстрый, современный сайт, который (1) хорошо ранжируется в поиске,
(2) корректно "читается" ИИ-системами (ChatGPT, Perplexity, Google AI Overview и т.п.)
и (3) приводит клиентов на два ключевых направления студии — полный дизайн-проект и
комплектацию (полное сопровождение и поставку материалов).

## Что тут будет

- Главная страница со УТП студии
- Портфолио / кейсы проектов
- О студии
- Услуги (дизайн-проект, комплектация)
- Блог / статьи (синхронизировано с контентом Telegram-канала t.me/art_interior_house)
- Контакты и форма заявки

## Стек

- Next.js (React) — SSR/SSG для быстрой индексации поисковиками
- Tailwind CSS — вёрстка
- Хостинг: Vercel (или аналог)

## Почему важно для SEO и видимости в ИИ (GEO)

- Семантическая разметка (schema.org: LocalBusiness, Article, FAQPage) — по ней ИИ и поиск
  понимают, кто вы и чем занимаетесь
- Быстрая загрузка и мобильная адаптация — это прямой фактор ранжирования Google/Яндекс
- Уникальные тексты на страницах услуг (не шаблонные, с конкретикой: город, стиль,
  типы объектов)
- Регулярный контент (статьи/кейсы) — чем больше качественного текста, тем чаще
  сайт попадает в ответы ИИ-моделей
- Отзывы и ссылки с внешних площадок (Яндекс.Карты, профильные каталоги дизайнеров,
  Instagram, Telegram) — это сигналы доверия

## Установка и запуск

```bash
npm install
npm run dev
```

Сайт будет доступен на http://localhost:3000

## Сборка для продакшена

```bash
npm run build
npm start
```

## Структура проекта

```
/app          — страницы (Next.js App Router)
/components   — переиспользуемые компоненты
/content      — тексты, кейсы, статьи (markdown/json)
/public       — изображения, шрифты, статика
```

## Контакты студии

- Telegram: https://t.me/art_interior_house
- WhatsApp: https://wa.me/79052243207
- Instagram: https://www.instagram.com/is_atrium/
- Email: isatrium@gmail.com

## TODO / Roadmap

- [ ] Перенести портфолио проектов с текущего сайта (isatrium.ru на Vigbo)
- [ ] Добавить schema.org разметку (LocalBusiness, Article)
- [ ] Настроить Яндекс.Метрику и Google Search Console
- [ ] Подключить форму заявки (CRM/почта)
- [ ] Добавить раздел со статьями, синхронизированный с Telegram-контентом

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
