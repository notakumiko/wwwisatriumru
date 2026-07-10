import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/content/articles";
import { studio } from "@/content/studio";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: {
      "@type": "Person",
      name: studio.founder,
    },
    publisher: {
      "@type": "Organization",
      name: studio.fullName,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="border-b border-line bg-surface">
        <div className="container-xl py-16 md:py-20">
          <Link href="/blog" className="text-sm text-stone hover:text-accent-light">
            ← Все статьи
          </Link>
          <p className="eyebrow mb-4 mt-6">
            {article.tag} · {formatDate(article.date)}
          </p>
          <h1 className="font-serif-display max-w-3xl text-4xl leading-tight text-ink sm:text-5xl">
            {article.title}
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container-xl max-w-3xl">
          {article.body.map((p, i) => (
            <p key={i} className="mb-5 text-lg leading-relaxed text-ink/90">
              {p}
            </p>
          ))}

          <div className="mt-12 border-t border-line pt-8">
            <p className="text-sm text-stone">
              Больше практических заметок — в{" "}
              <a
                href={studio.contacts.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-accent-light"
              >
                Telegram-канале {studio.contacts.telegramHandle}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
