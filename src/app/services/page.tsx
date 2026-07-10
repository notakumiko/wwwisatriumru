import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { services, comparisonRows } from "@/content/services";
import { studio, gallery } from "@/content/studio";

export const metadata: Metadata = {
  title: "Услуги студии дизайна интерьеров",
  description:
    "Полный цикл создания интерьера: дизайн-проект, комплектация, реализация, декорирование, авторские техники (барельефы, керамика, витражи, чеканка, стекло) и подбор искусства. Студия ATRIUM.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-xl py-20 md:py-28">
          <p className="eyebrow mb-6">Услуги</p>
          <h1 className="font-serif-display max-w-3xl text-4xl leading-tight text-ink sm:text-5xl">
            Полный цикл создания интерьера
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-stone">
            Шесть направлений, которые складываются в один результат — готовое
            пространство, наполненное авторскими предметами и искусством.
            Берите весь цикл или отдельные этапы, в зависимости от стадии
            вашего объекта.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col border border-line bg-surface p-8 transition-colors hover:border-accent"
              >
                <span className="eyebrow">0{index + 1}</span>
                <h2 className="mt-3 font-serif-display text-2xl text-ink">{service.title}</h2>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-stone">{service.short}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-accent-light">
                  Подробнее
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-line bg-deep">
        <div className="container-xl grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow mb-4">{gallery.eyebrow}</p>
            <h2 className="font-serif-display text-3xl leading-tight text-ink sm:text-4xl">
              Посетите шоу-рум студии
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-stone">
              {gallery.description}
            </p>
          </div>
          <div className="flex md:justify-end">
            <Link href="/gallery" className="btn-primary">
              Смотреть галерею
            </Link>
          </div>
        </div>
      </section>

      <section className="section border-t border-line bg-surface">
        <div className="container-xl">
          <SectionHeading
            eyebrow="Сравнение"
            title="Что входит в каждую услугу"
            description="Наглядно — для тех, кто не готов читать шесть страниц. Любые услуги можно сочетать."
          />
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b border-line py-4 pr-4 text-left font-normal text-stone">
                    Состав работ
                  </th>
                  {services.map((s) => (
                    <th key={s.slug} className="border-b border-line px-3 py-4 text-left font-medium text-ink">
                      <Link href={`/services/${s.slug}`} className="hover:text-accent-light">
                        {s.title}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label}>
                    <td className="border-b border-line py-3 pr-4 text-stone">{row.label}</td>
                    {row.cells.map((included, i) => (
                      <td key={i} className="border-b border-line px-3 py-3">
                        {included ? (
                          <span className="text-accent-light">✓</span>
                        ) : (
                          <span className="text-stone/40">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-xl grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-serif-display text-3xl leading-tight text-ink sm:text-4xl">
              Не уверены, какой формат нужен?
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-stone">
              Расскажите о своём объекте — предложим состав работ под вашу
              стадию: от одного эскиза до полного цикла.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row md:justify-end">
            <Link href="/contact" className="btn-primary">
              Получить консультацию
            </Link>
            <a href={studio.contacts.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Написать в WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
