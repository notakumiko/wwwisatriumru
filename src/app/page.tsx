import Link from "next/link";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { PortfolioTile } from "@/components/PortfolioTile";
import { MiniLeadForm } from "@/components/MiniLeadForm";
import { HeroIntro } from "@/components/HeroIntro";
import { studio, manifestoText, highlights, clients } from "@/content/studio";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
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
      <section className="relative flex min-h-[92vh] items-end overflow-hidden border-b border-line">
        <Image
          src="/hero.jpg"
          alt="Интерьер студии ATRIUM"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/50 to-deep/10" />
        <div className="container-xl relative w-full pb-20 pt-32 md:pb-28">
          <HeroIntro
            eyebrow={`${studio.fullName} · ${studio.geo.join(" · ")}`}
            title={manifestoText.title}
            subtitle={studio.tagline}
            whatsappHref={studio.contacts.whatsapp}
          />
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
              description={`Жилые и коммерческие интерьеры: ${studio.geo.join(", ")}.`}
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
            title="Шесть направлений, один результат"
            description="Полный цикл создания интерьера — от дизайн-проекта до готового помещения, включая авторские техники и подбор искусства. Берите весь цикл или отдельные этапы."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* CRAFT SECTION — авторские техники студии */}
      <section className="section border-y border-line bg-surface">
        <div className="container-xl grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <SectionHeading
              eyebrow="Авторские техники"
              title="Материалы, которые нельзя скопировать"
              description="Барельефы, керамика, чеканка, витражи и художественное литьё/фьюзинг стекла — техники, которыми студия занимается лично, а не только заказывает у подрядчиков. Образцы можно увидеть в шоу-руме студии."
            />
            <Link href="/services/handmade" className="btn-secondary mt-8 inline-flex">
              Авторские предметы на заказ
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:col-span-7">
            {[
              { label: "Витражи", img: "/craft-vitrazhi.jpg" },
              { label: "Литьё и фьюзинг стекла", img: "/craft-steklo.jpg" },
              { label: "Барельефы", img: "/craft-barelefy.jpg" },
              { label: "Керамика", img: "/craft-keramika.jpg" },
              { label: "Чеканка", img: "/craft-chekanka.jpg" },
            ].map((craft) => (
              <div key={craft.label} className="relative flex aspect-square flex-col justify-end overflow-hidden p-6">
                <Image
                  src={craft.img}
                  alt={craft.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-deep/10 to-transparent" />
                <span className="relative font-serif-display text-lg text-ink">{craft.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ИСКУССТВО — скульптура и живопись, отдельно от авторских техник */}
      <section className="section">
        <div className="container-xl grid gap-12 md:grid-cols-12 md:items-center">
          <div className="relative order-2 aspect-[4/5] overflow-hidden md:order-1 md:col-span-6">
            <Image
              src="/craft-art.jpg"
              alt="Скульптура в интерьере"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="order-1 md:order-2 md:col-span-6">
            <SectionHeading
              eyebrow="Искусство"
              title="Скульптура и живопись для интерьера"
              description="Санкт-Петербург сейчас переживает всплеск интереса к современному искусству — и студия участвует в этом напрямую: подбираем и поставляем работы художников, курируем собственную коллекцию, помогаем собрать акцент для дома или офиса."
            />
            <Link href="/services/art" className="btn-secondary mt-8 inline-flex">
              Подбор искусства
            </Link>
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
              Ведём объекты там, где живут наши клиенты
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

      {/* CLIENTS */}
      <section className="section">
        <div className="container-xl">
          <SectionHeading eyebrow="Нам доверяют" title="Клиенты и партнёры" />
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {clients.map((client) => (
              <span key={client} className="text-sm text-stone">
                {client}
              </span>
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
