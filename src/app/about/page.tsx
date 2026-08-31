import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import {
  studio,
  manifestoText,
  founderNote,
  highlights,
  clients,
  capabilities,
  referenceProjects,
  presentations,
} from "@/content/studio";

export const metadata: Metadata = {
  title: "О студии",
  description:
    "ATRIUM — студия дизайна интерьеров полного цикла с 2005 года. 600+ реализованных объектов. Философия «Прошлое раскрывает будущее»: материалы, фактура и полное кураторство.",
};

const aboutFaq = [
  {
    q: "Где базируется студия ATRIUM и в каких городах вы работаете?",
    a: "Студия основана в Санкт-Петербурге, где находится шоу-рум с образцами материалов и авторских техник. Ведём объекты в Москве, Санкт-Петербурге, Сочи, Ташкенте и Аликанте — очно на объекте или удалённо, через выезды и проверенных партнёров.",
  },
  {
    q: "С какого года работает студия и сколько объектов реализовано?",
    a: "Студию основала и ведёт с 2005 года Наталья Рудова. За более чем 20 лет практики реализовано 600+ объектов: частные резиденции и квартиры, рестораны, офисы, общественные пространства и проекты с девелоперами.",
  },
  {
    q: "Чем ATRIUM отличается от других студий дизайна интерьера?",
    a: "Полное кураторство от аудита до сдачи объекта, авторские техники (барельефы, керамика, чеканка, витражи, литьё и фьюзинг стекла), которыми студия занимается лично, и почерк на стыке винтажа и ретрофутуризма — а не типовой каталог решений.",
  },
  {
    q: "Можно ли увидеть материалы и авторские техники вживую перед началом проекта?",
    a: "Да — в шоу-руме студии в Санкт-Петербурге можно увидеть образцы стекла, керамики, металла и других материалов и техник, в том числе готовые изделия ручной работы, до того как они станут частью вашего интерьера.",
  },
];

export default function AboutPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: studio.fullName,
      url: studio.url,
      description: studio.description,
      foundingDate: String(studio.yearFounded),
      founder: { "@type": "Person", name: studio.founder, jobTitle: studio.founderRole },
      areaServed: studio.geo,
      sameAs: [studio.contacts.instagram, studio.contacts.telegram],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: aboutFaq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
                    <div className="font-serif-display text-4xl text-accent-light">{item.value}</div>
                    <div className="mt-2 text-xs leading-snug text-stone">{item.label}</div>
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
                eyebrow="Авторские техники"
                title="Барельефы, керамика, чеканка, витражи, стекло"
                description="Это техники, которыми студия занимается лично, а не только заказывает на стороне: керамические панно и авторские люстры/абажуры лепятся и обжигаются в собственной мастерской, витражи и стеклянные панели проходят через литьё и фьюзинг. Образцы материалов можно увидеть вживую в шоу-руме студии."
              />
            </div>

            <div className="mt-16 border-t border-line pt-12">
              <SectionHeading
                eyebrow="Искусство"
                title="Скульптура и живопись"
                description="Отдельное и любимое направление студии — кураторский подбор и поставка искусства: скульптуры и живопись современных художников, в первую очередь петербургской арт-сцены, которая сейчас переживает настоящий подъём."
              />
            </div>

            <div className="mt-16 border-t border-line pt-12">
              <SectionHeading eyebrow="Подход" title="Как мы ведём проекты" />
              <ul className="mt-6 flex flex-col gap-4">
                {[
                  "Полный цикл работ — от аудита и проектирования до комплектации и реализации под ключ.",
                  "Каждый проект начинается с вопроса, как заказчик проживает пространство, а не с референсов и трендов.",
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
              <SectionHeading eyebrow="Полный комплекс" title="Услуги под ключ" />
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {capabilities.map((item) => (
                  <div key={item.title} className="border-t border-line pt-4">
                    <h3 className="text-base font-medium text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 border-t border-line pt-12">
              <p className="eyebrow mb-4">Основатель</p>
              <p className="text-base leading-relaxed text-stone">{founderNote.text}</p>
            </div>

            <div className="mt-16 border-t border-line pt-12">
              <p className="eyebrow mb-6">Масштабные референс-проекты</p>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {referenceProjects.map((item) => (
                  <span key={item} className="text-sm text-stone">
                    {item}
                  </span>
                ))}
              </div>
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

            <div className="mt-16 border-t border-line pt-12">
              <p className="eyebrow mb-6">Презентация студии</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {presentations.map((item) => (
                  <a
                    key={item.file}
                    href={item.file}
                    download
                    className="group flex flex-col justify-between border border-line p-6 transition-colors hover:border-accent"
                  >
                    <div>
                      <h3 className="text-base font-medium text-ink">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-stone">{item.description}</p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm text-accent-light">
                      Скачать презентацию · PDF, {item.sizeLabel}
                      <span className="transition-transform group-hover:translate-y-0.5">↓</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-16 border-t border-line pt-12">
              <SectionHeading eyebrow="Вопросы и ответы" title="О студии — коротко" />
              <dl className="mt-6 flex flex-col">
                {aboutFaq.map((item) => (
                  <div key={item.q} className="border-t border-line py-6">
                    <dt className="text-base font-medium text-ink">{item.q}</dt>
                    <dd className="mt-3 text-sm leading-relaxed text-stone">{item.a}</dd>
                  </div>
                ))}
              </dl>
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
