import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { studio } from "@/content/studio";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const [from, to] = project.palette;
  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-xl py-16 md:py-20">
          <Link href="/portfolio" className="text-sm text-stone hover:text-accent-light">
            ← Всё портфолио
          </Link>
          <p className="eyebrow mb-4 mt-6">
            {project.category} · {project.location}
          </p>
          <h1 className="font-serif-display max-w-3xl text-4xl leading-tight text-ink sm:text-5xl">
            {project.title}
          </h1>
        </div>
      </section>

      <section
        className="aspect-[16/9] w-full"
        style={{ backgroundImage: `linear-gradient(160deg, ${from} 0%, ${to} 100%)` }}
      />

      <section className="section">
        <div className="container-xl grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <dl className="flex flex-col gap-6">
              <div className="border-t border-line pt-4">
                <dt className="eyebrow">Локация</dt>
                <dd className="mt-1 text-base text-ink">{project.location}</dd>
              </div>
              <div className="border-t border-line pt-4">
                <dt className="eyebrow">Стиль</dt>
                <dd className="mt-1 text-base text-ink">{project.style}</dd>
              </div>
              <div className="border-t border-line pt-4">
                <dt className="eyebrow">Площадь</dt>
                <dd className="mt-1 text-base text-ink">{project.area}</dd>
              </div>
              <div className="border-t border-line pt-4">
                <dt className="eyebrow">Год</dt>
                <dd className="mt-1 text-base text-ink">{project.year}</dd>
              </div>
            </dl>
          </div>
          <div className="md:col-span-8">
            <p className="text-lg leading-relaxed text-ink/90">{project.summary}</p>
            <div className="mt-8 flex flex-col gap-5 border-t border-line pt-8">
              {project.story.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-stone">
                  {p}
                </p>
              ))}
            </div>
            <a
              href={studio.contacts.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-10 inline-flex"
            >
              Обсудить похожий проект
            </a>
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
                  <div
                    className="aspect-[4/5] transition-transform duration-500 group-hover:scale-[1.02]"
                    style={{
                      backgroundImage: `linear-gradient(155deg, ${p.palette[0]} 0%, ${p.palette[1]} 100%)`,
                    }}
                  />
                  <h3 className="mt-4 font-serif-display text-lg text-ink">{p.title}</h3>
                  <p className="text-sm text-stone">{p.location}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
