import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortfolioTile } from "@/components/PortfolioTile";
import { ComplectationTable } from "@/components/ComplectationTable";
import { ContractSampleBlock } from "@/components/ContractSampleBlock";
import { services, getService } from "@/content/services";
import { projects } from "@/content/projects";
import { complectationCatalog } from "@/content/materials";
import { studio } from "@/content/studio";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.seoTitle,
    description: service.seoDescription,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const relatedServices = service.related
    .map((s) => getService(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const relatedProjects = projects
    .filter((p) => p.servicesUsed.includes(service.slug))
    .slice(0, 3);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.h1,
      description: service.seoDescription,
      provider: {
        "@type": "LocalBusiness",
        name: studio.fullName,
        url: studio.url,
      },
      areaServed: studio.geo,
      url: `${studio.url}/services/${service.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: studio.url },
        { "@type": "ListItem", position: 2, name: "Услуги", item: `${studio.url}/services` },
        {
          "@type": "ListItem",
          position: 3,
          name: service.title,
          item: `${studio.url}/services/${service.slug}`,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-line bg-surface">
        <div className="container-xl py-16 md:py-24">
          <Link href="/services" className="text-sm text-stone hover:text-accent-light">
            ← Все услуги
          </Link>
          <p className="eyebrow mb-4 mt-6">Услуга</p>
          <h1 className="font-serif-display max-w-3xl text-4xl leading-tight text-ink sm:text-5xl">
            {service.h1}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/90">{service.short}</p>
        </div>
      </section>

      {service.cover && (
        <section className="relative aspect-[21/9] w-full">
          <Image
            src={service.cover}
            alt={service.h1}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </section>
      )}

      <section className="section">
        <div className="container-xl grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex flex-col gap-10">
              <div>
                <p className="eyebrow">Для кого</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {service.forWhom.map((item) => (
                    <li key={item} className="border-t border-line pt-3 text-sm leading-relaxed text-stone">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow">Связанные услуги</p>
                <div className="mt-4 flex flex-col gap-2">
                  {relatedServices.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/services/${rel.slug}`}
                      className="border-t border-line pt-3 text-sm text-ink transition-colors hover:text-accent-light"
                    >
                      {rel.title} →
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8">
            {service.description.map((p, i) => (
              <p key={i} className="mb-4 text-base leading-relaxed text-ink/90">
                {p}
              </p>
            ))}

            <div className="mt-10 border-t border-line pt-8">
              <p className="eyebrow mb-6">Что входит</p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {service.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-stone">
                    <span className="text-accent-light">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {service.techniques && (
              <div className="mt-10 border-t border-line pt-8">
                <p className="eyebrow mb-6">Техники</p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {service.techniques.map((tech) => (
                    <div key={tech.title}>
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={tech.img}
                          alt={tech.title}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <h3 className="mt-3 text-base font-medium text-ink">{tech.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-stone">{tech.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {service.steps && (
              <div className="mt-10 border-t border-line pt-8">
                <p className="eyebrow mb-6">Этапы</p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {service.steps.map((step, i) => (
                    <div key={step.title}>
                      {step.img && (
                        <div className="relative mb-3 aspect-[4/3] overflow-hidden">
                          <Image
                            src={step.img}
                            alt={step.title}
                            fill
                            sizes="(max-width: 640px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="border-t border-line pt-4">
                        <div className="text-xs text-accent-light">Этап {i + 1}</div>
                        <h3 className="mt-1 text-base font-medium text-ink">{step.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-stone">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {service.slug === "komplektatsiya" && (
              <>
                <div className="mt-10 border-t border-line pt-8">
                  <p className="eyebrow mb-2">Пример каталога</p>
                  <p className="mb-6 text-sm text-stone">
                    Так выглядит таблица комплектации по проекту — конкретные
                    позиции, бренды и сроки поставки. Ниже — условный пример.
                  </p>
                  <ComplectationTable rows={complectationCatalog} />
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <Link href="/art-materialy" className="text-ink hover:text-accent-light">
                      Арт-материалы студии →
                    </Link>
                    <Link href="/predstavitelstvo" className="text-ink hover:text-accent-light">
                      Представительство и партнёры →
                    </Link>
                  </div>
                </div>

                <div className="mt-10 border-t border-line pt-8">
                  <ContractSampleBlock />
                </div>
              </>
            )}

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

      {relatedProjects.length > 0 && (
        <section className="section border-t border-line bg-surface">
          <div className="container-xl">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <p className="eyebrow">Проекты с этой услугой</p>
              <Link
                href={`/portfolio?usluga=${service.slug}`}
                className="text-sm text-stone hover:text-accent-light"
              >
                Смотреть все →
              </Link>
            </div>
            <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((project) => (
                <PortfolioTile key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container-xl grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">Вопросы и ответы</p>
            <h2 className="mt-3 font-serif-display text-3xl text-ink">Частые вопросы</h2>
          </div>
          <div className="md:col-span-8">
            <dl className="flex flex-col">
              {service.faq.map((item) => (
                <div key={item.q} className="border-t border-line py-6">
                  <dt className="text-base font-medium text-ink">{item.q}</dt>
                  <dd className="mt-3 text-sm leading-relaxed text-stone">{item.a}</dd>
                </div>
              ))}
            </dl>
            <a
              href={studio.contacts.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-8 inline-flex"
            >
              {service.ctaLabel}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
