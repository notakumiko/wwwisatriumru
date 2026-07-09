import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { services } from "@/content/services";
import { studio } from "@/content/studio";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Дизайн-проект и комплектация интерьера под ключ — полный цикл работ студии ATRIUM для жилых и коммерческих объектов.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-xl py-20 md:py-28">
          <p className="eyebrow mb-6">Услуги</p>
          <h1 className="font-serif-display max-w-3xl text-4xl leading-tight text-ink sm:text-5xl">
            Дизайн-проект и комплектация — по отдельности или полным циклом
          </h1>
        </div>
      </section>

      {services.map((service, index) => (
        <section
          key={service.slug}
          id={service.slug}
          className={`section scroll-mt-24 ${index !== services.length - 1 ? "border-b border-line" : ""} ${
            index % 2 === 1 ? "bg-surface" : ""
          }`}
        >
          <div className="container-xl grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <SectionHeading
                eyebrow={`0${index + 1}`}
                title={service.title}
                description={service.short}
              />
              <div className="mt-8 flex flex-col gap-2">
                <p className="eyebrow">Для кого</p>
                <ul className="mt-2 flex flex-col gap-2">
                  {service.forWhom.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-stone">
                      · {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:col-span-8">
              {service.description.map((p, i) => (
                <p key={i} className="mb-4 text-base leading-relaxed text-ink/90">
                  {p}
                </p>
              ))}

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {service.steps.map((step, i) => (
                  <div key={step.title} className="border-t border-line pt-4">
                    <div className="text-xs text-accent-light">
                      Этап {i + 1}
                    </div>
                    <h3 className="mt-1 text-base font-medium text-ink">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone">{step.description}</p>
                  </div>
                ))}
              </div>

              <a
                href={studio.contacts.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-10 inline-flex"
              >
                {service.ctaLabel}
              </a>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
