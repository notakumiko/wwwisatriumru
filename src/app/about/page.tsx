import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { studio, manifestoText, founderNote, highlights, clients } from "@/content/studio";

export const metadata: Metadata = {
  title: "О студии",
  description:
    "ATRIUM — студия дизайна интерьеров полного цикла. Философия «Прошлое раскрывает будущее»: материалы, фактура и работа с частными мастерами.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-xl py-20 md:py-28">
          <p className="eyebrow mb-6">О студии</p>
          <h1 className="font-serif-display max-w-3xl text-4xl leading-tight text-ink sm:text-5xl">
            {manifestoText.title}
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container-xl grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="sticky top-28 flex flex-col gap-8">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={founderNote.photo}
                  alt={founderNote.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                {highlights.map((item) => (
                  <div key={item.label}>
                    <div className="font-serif-display text-2xl text-accent-light">{item.value}</div>
                    <div className="mt-1 text-xs leading-snug text-stone">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="flex flex-col gap-6">
              {manifestoText.paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-ink/90">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-16 border-t border-line pt-12">
              <SectionHeading
                eyebrow="Материалы"
                title="Фактура как содержание"
                description="Натуральный камень, патинированная медь, редкие породы дерева, художественное стекло, тиснёная кожа — материалы, которые стареют с достоинством. Мы не сглаживаем их, а строим на их подлинности."
              />
            </div>

            <div id="remeslo" className="mt-16 scroll-mt-24 border-t border-line pt-12">
              <SectionHeading
                eyebrow="Ручная работа"
                title="Партнёрство с мастерами"
                description="Барельефы, авторские панно, скульптуры, витражи, световые инсталляции и уникальная мебель создаются частными мастерами, с которыми студия сотрудничает на постоянной основе. Это не декор поверх интерьера, а часть его архитектуры — штучные предметы, которые невозможно повторить."
              />
            </div>

            <div className="mt-16 border-t border-line pt-12">
              <SectionHeading eyebrow="Подход" title="Как мы ведём проекты" />
              <ul className="mt-6 flex flex-col gap-4">
                {[
                  "Полный цикл работ — от аудита и проектирования до комплектации и реализации под ключ.",
                  "Интерьер как фон для жизни: мы начинаем с того, как заказчик проживает пространство, а не с референсов.",
                  "Глубина вместо широты — ограниченное количество проектов и максимум внимания каждому клиенту.",
                  "Партнёрство, не подряд — становимся частью вашей истории, ваши цели становятся нашими.",
                  "Масштаб и география — от частных резиденций до парк-отелей и ресторанных сетей в Москве, Санкт-Петербурге, Сочи, Ташкенте и Аликанте.",
                ].map((text) => (
                  <li key={text} className="flex gap-4 border-t border-line pt-4 text-sm leading-relaxed text-stone">
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-16 border-t border-line pt-12">
              <p className="eyebrow mb-4">Основатель</p>
              <p className="text-base leading-relaxed text-stone">{founderNote.text}</p>
            </div>

            <div className="mt-16 border-t border-line pt-12">
              <p className="eyebrow mb-6">Нам доверяют</p>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {clients.map((client) => (
                  <span key={client} className="text-sm text-stone">
                    {client}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-16 flex flex-wrap gap-4 border-t border-line pt-12">
              <Link href="/portfolio" className="btn-primary">
                Смотреть портфолио
              </Link>
              <a href={studio.contacts.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Обсудить проект
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
