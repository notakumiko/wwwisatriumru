import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { PortfolioTile } from "@/components/PortfolioTile";
import { MiniLeadForm } from "@/components/MiniLeadForm";
import { studio, manifestoText, highlights } from "@/content/studio";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { testimonials } from "@/content/testimonials";
import { articles } from "@/content/articles";

const process = [
  { step: "01", title: "Бриф", text: "Разговариваем о том, как вы живёте в пространстве — не о трендах." },
  { step: "02", title: "Идея", text: "Формируем концепцию интерьера, материалы и фактуры объекта." },
  { step: "03", title: "Дизайн-проект", text: "3D-визуализация и полная рабочая документация." },
  { step: "04", title: "Комплектация", text: "Подбираем и поставляем мебель, материалы, авторский декор." },
  { step: "05", title: "Реализация", text: "Координируем подрядчиков, ведём авторский надзор." },
  { step: "06", title: "Сдача объекта", text: "Шеф-монтаж, стайлинг и передача готового интерьера." },
];

export default function Home() {
  return (
    <>
      {/* HERO — полноэкранный, кинематографичный */}
      <section className="texture-plaster relative flex min-h-[92vh] items-end border-b border-line">
        <div className="container-xl w-full pb-20 pt-32 md:pb-28">
          <p className="eyebrow mb-8">{studio.fullName} · Ташкент · с {studio.yearFounded} года</p>
          <h1 className="font-serif-display max-w-4xl text-5xl leading-[1.05] text-ink sm:text-6xl md:text-7xl">
            {manifestoText.title}
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-stone">
            {studio.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/portfolio" className="btn-primary">
              Смотреть проекты
            </Link>
            <a href={studio.contacts.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Обсудить проект
            </a>
          </div>
        </div>
      </section>

      <div className="border-b border-line">
        <div className="container-xl grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
          {highlights.map((item) => (
            <div key={item.label}>
              <div className="font-serif-display text-3xl text-accent-light">{item.value}</div>
              <div className="mt-1 text-xs leading-snug text-stone">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MANIFESTO */}
      <section className="section">
        <div className="container-xl grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading eyebrow="Философия" title="Диалог между эпохами" />
          </div>
          <div className="md:col-span-7">
            <p className="text-lg leading-relaxed text-ink/90">{manifestoText.paragraphs[0]}</p>
            <p className="mt-4 text-base leading-relaxed text-stone">{manifestoText.paragraphs[1]}</p>
            <Link href="/about" className="btn-secondary mt-8 inline-flex">
              О студии
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="section border-y border-line bg-surface">
        <div className="container-xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Портфолио"
              title="Избранные объекты"
              description="Жилые и коммерческие интерьеры в Ташкенте, Испании, на юге России, в Москве и Санкт-Петербурге."
            />
            <Link href="/portfolio" className="btn-secondary">
              Всё портфолио
            </Link>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <PortfolioTile key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section">
        <div className="container-xl">
          <SectionHeading
            eyebrow="Услуги"
            title="Пять направлений, один результат"
            description="Полный цикл создания интерьера — от дизайн-проекта до готового помещения. Берите весь цикл или отдельные этапы."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col border border-line bg-surface p-6 transition-colors hover:border-accent"
              >
                <h3 className="font-serif-display text-xl text-ink">{service.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-stone">{service.short}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm text-accent-light">
                  Подробнее
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CRAFT SECTION */}
      <section className="section border-y border-line bg-surface">
        <div className="container-xl grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <SectionHeading
              eyebrow="Ручная работа"
              title="Материалы, которые нельзя скопировать"
              description="Витражи, стекло, барельефы и керамика создаются частными мастерами и становятся частью архитектуры пространства — а не декором поверх неё."
            />
            <Link href="/services/art-obekty" className="btn-secondary mt-8 inline-flex">
              Арт-объекты на заказ
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:col-span-7">
            {["Витражи", "Стекло ручной работы", "Барельефы", "Керамика"].map((craft, i) => (
              <div
                key={craft}
                className="flex aspect-square flex-col justify-end p-6"
                style={{
                  backgroundImage: `linear-gradient(160deg, ${
                    ["#2e2620", "#26201a", "#332a1f", "#2a231c"][i]
                  } 0%, ${["#8f6d3f", "#6b5233", "#b6905b", "#7d6440"][i]} 100%)`,
                }}
              >
                <span className="font-serif-display text-lg text-ink">{craft}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section">
        <div className="container-xl">
          <SectionHeading eyebrow="Процесс" title="Как мы работаем" />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {process.map((item) => (
              <div key={item.step} className="border-t border-line pt-6">
                <div className="font-serif-display text-2xl text-accent-light">{item.step}</div>
                <h3 className="mt-3 text-base font-medium text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GEO */}
      <section className="section border-y border-line bg-deep">
        <div className="container-xl grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <p className="eyebrow">География</p>
            <h2 className="mt-3 font-serif-display text-3xl sm:text-4xl">
              Студия в Ташкенте — объекты там, где живут наши клиенты
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6 md:col-span-7 md:grid-cols-4">
            {studio.geo.map((city) => (
              <div key={city} className="border-t border-line pt-4">
                <span className="text-lg">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container-xl">
          <SectionHeading eyebrow="Отзывы" title="Что говорят клиенты" />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.project} className="border border-line p-8">
                <blockquote className="text-base leading-relaxed text-ink/90">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 text-sm text-stone">{t.project}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNAL TEASER */}
      <section className="section border-t border-line bg-surface">
        <div className="container-xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Журнал" title="Материалы, кейсы, контекст" />
            <Link href="/blog" className="btn-secondary">
              Все статьи
            </Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="group block border-t border-line pt-6">
                <span className="eyebrow">{article.tag}</span>
                <h3 className="mt-3 font-serif-display text-xl text-ink transition-colors group-hover:text-accent-light">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / LEAD FORM */}
      <section className="section border-t border-line">
        <div className="container-xl grid gap-12 md:grid-cols-2 md:items-start">
          <div>
            <p className="eyebrow mb-4">Контакты</p>
            <h2 className="font-serif-display text-3xl leading-tight text-ink sm:text-4xl">
              Расскажите о своём объекте
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-stone">
              Короткая заявка — имя, телефон и тип объекта. Ответим в течение
              рабочего дня и предложим формат работы под вашу стадию.
            </p>
            <div className="mt-8 flex flex-col gap-3 border-t border-line pt-8 text-sm text-stone">
              <a href={studio.contacts.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-accent-light">
                Telegram {studio.contacts.telegramHandle}
              </a>
              <a href={studio.contacts.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-accent-light">
                WhatsApp {studio.contacts.whatsappDisplay}
              </a>
              <a href={studio.contacts.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent-light">
                Instagram {studio.contacts.instagramHandle}
              </a>
            </div>
          </div>
          <div className="border border-line p-8 md:p-10">
            <MiniLeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
