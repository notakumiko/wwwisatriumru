import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { bySlug, categoryLabel, published } from "@/lib/portfolio";
import { getService } from "@/content/services";
import { studio } from "@/content/studio";

export function generateStaticParams() {
  return published.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = bySlug(slug);
  if (!project || !project.cover) return {};
  return buildMetadata({
    path: `/portfolio/${project.slug}`,
    title: `${project.title}${project.city ? ` — ${project.city}` : ""}`,
    description: project.summary || project.description[0] || studio.description,
    image: project.cover.src,
    type: "article",
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = bySlug(slug);
  if (!project || !project.cover) notFound();

  const others = published.filter((p) => p.slug !== project.slug).slice(0, 3);
  const usedServices = (project.servicesUsed || [])
    .map((s) => getService(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary || project.description[0] || undefined,
    image: `${studio.url}${project.cover.src}`,
    creator: { "@type": "Organization", name: studio.fullName, url: studio.url },
    ...(project.city
      ? { locationCreated: { "@type": "Place", name: project.city } }
      : {}),
    ...(project.year ? { dateCreated: project.year } : {}),
    url: `${studio.url}/portfolio/${project.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-line bg-surface">
        <div className="container-xl py-16 md:py-20">
          <Link href="/portfolio" className="text-sm text-stone hover:text-accent-light">
            ← Всё портфолио
          </Link>
          <p className="eyebrow mb-4 mt-6">
            {categoryLabel(project.category)}
            {project.city ? ` · ${project.city}` : ""}
          </p>
          <h1 className="font-serif-display max-w-3xl text-4xl leading-tight text-ink sm:text-5xl">
            {project.title}
          </h1>
          {project.summary && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone">
              {project.summary}
            </p>
          )}
        </div>
      </section>

      <section className="relative aspect-[16/9] w-full">
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </section>

      {project.gallery.length > 0 && (
        <section className="border-b border-line bg-surface py-6">
          <div className="container-xl grid grid-cols-2 gap-4 sm:grid-cols-4">
            {project.gallery.map((im) => (
              <div key={im.src} className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={im.src}
                  alt={im.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 hover:scale-[1.04]"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="container-xl grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <dl className="flex flex-col gap-6">
              {project.city && (
                <div className="border-t border-line pt-4">
                  <dt className="eyebrow">Локация</dt>
                  <dd className="mt-1 text-base text-ink">{project.city}</dd>
                </div>
              )}
              <div className="border-t border-line pt-4">
                <dt className="eyebrow">Раздел</dt>
                <dd className="mt-1 text-base text-ink">{categoryLabel(project.category)}</dd>
              </div>
              {project.style && (
                <div className="border-t border-line pt-4">
                  <dt className="eyebrow">Стиль</dt>
                  <dd className="mt-1 text-base text-ink">{project.style}</dd>
                </div>
              )}
              {project.area && (
                <div className="border-t border-line pt-4">
                  <dt className="eyebrow">Площадь</dt>
                  <dd className="mt-1 text-base text-ink">{project.area}</dd>
                </div>
              )}
              {project.year && (
                <div className="border-t border-line pt-4">
                  <dt className="eyebrow">Год</dt>
                  <dd className="mt-1 text-base text-ink">{project.year}</dd>
                </div>
              )}
              {usedServices.length > 0 && (
                <div className="border-t border-line pt-4">
                  <dt className="eyebrow">Услуги студии</dt>
                  <dd className="mt-2 flex flex-col gap-2">
                    {usedServices.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className="text-sm text-ink transition-colors hover:text-accent-light"
                      >
                        {service.title} →
                      </Link>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="md:col-span-8">
            {project.task && (
              <div>
                <p className="eyebrow mb-4">Задача</p>
                <p className="text-lg leading-relaxed text-ink/90">{project.task}</p>
              </div>
            )}

            {project.solution && project.solution.length > 0 && (
              <div className="mt-10 border-t border-line pt-8">
                <p className="eyebrow mb-4">Решение</p>
                <div className="flex flex-col gap-4">
                  {project.solution.map((p, i) => (
                    <p key={i} className="text-base leading-relaxed text-stone">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {project.description.length > 0 && (
              <div className={project.task ? "mt-10 border-t border-line pt-8" : ""}>
                <p className="eyebrow mb-4">О проекте</p>
                <div className="flex flex-col gap-4">
                  {project.description.map((p, i) => (
                    <p key={i} className="text-base leading-relaxed text-stone">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {project.materials && project.materials.length > 0 && (
              <div className="mt-10 border-t border-line pt-8">
                <p className="eyebrow mb-4">Материалы и предметы</p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {project.materials.map((m) => (
                    <li key={m} className="flex gap-3 text-sm leading-relaxed text-stone">
                      <span className="text-accent-light">·</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.quote && (
              <figure className="mt-10 border border-line p-8">
                <blockquote className="font-serif-display text-xl leading-relaxed text-ink/90">
                  “{project.quote.text}”
                </blockquote>
                <figcaption className="mt-4 text-sm text-stone">{project.quote.author}</figcaption>
              </figure>
            )}

            <div className="mt-10 border-t border-line pt-8">
              <p className="text-base text-ink/90">Хотите такой же результат?</p>
              <a
                href={studio.contacts.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4 inline-flex"
              >
                Обсудим ваш проект
              </a>
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="section border-t border-line bg-surface">
          <div className="container-xl">
            <p className="eyebrow mb-8">Другие проекты</p>
            <div className="grid gap-8 sm:grid-cols-3">
              {others.map((p) => (
                <Link key={p.slug} href={`/portfolio/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {p.cover && (
                      <Image
                        src={p.cover.src}
                        alt={p.cover.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    )}
                  </div>
                  <h3 className="mt-4 font-serif-display text-lg text-ink">{p.title}</h3>
                  {p.city && <p className="text-sm text-stone">{p.city}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
