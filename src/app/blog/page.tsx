import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/content/articles";
import { studio } from "@/content/studio";

export const metadata: Metadata = {
  title: "Журнал",
  description:
    "Журнал студии ATRIUM: материалы, кейсы и события мира дизайна интерьера. Синхронизировано с Telegram-каналом.",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-xl py-20 md:py-28">
          <p className="eyebrow mb-6">Журнал</p>
          <h1 className="font-serif-display max-w-3xl text-4xl leading-tight text-ink sm:text-5xl">
            Заметки о дизайне интерьера
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-stone">
            Темы, которые мы разбираем подробнее в{" "}
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
      </section>

      <section className="section">
        <div className="container-xl grid gap-12 border-t border-line">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group grid gap-4 border-b border-line pt-8 pb-8 md:grid-cols-12 md:items-baseline"
            >
              <div className="md:col-span-3">
                <span className="eyebrow">{article.tag}</span>
                <p className="mt-2 text-sm text-stone">{formatDate(article.date)}</p>
              </div>
              <div className="md:col-span-9">
                <h2 className="font-serif-display text-2xl text-ink transition-colors group-hover:text-accent-light">
                  {article.title}
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
