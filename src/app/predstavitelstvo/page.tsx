import type { Metadata } from "next";
import Link from "next/link";
import { MaterialGrid } from "@/components/MaterialGrid";
import { partners } from "@/content/materials";
import { studio } from "@/content/studio";

export const metadata: Metadata = {
  title: "Представительство",
  description:
    "Партнёры-поставщики студии ATRIUM: краски и штукатурка, кухни и корпусная мебель, диваны, плинтуса и декоративные панели.",
};

export default function PredstavitelstvoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: studio.url },
      { "@type": "ListItem", position: 2, name: "Комплектация", item: `${studio.url}/services/komplektatsiya` },
      { "@type": "ListItem", position: 3, name: "Представительство", item: `${studio.url}/predstavitelstvo` },
    ],
  };

  return (
    <section className="section pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-xl">
        <p className="eyebrow mb-4">Комплектация</p>
        <h1 className="font-serif-display max-w-3xl text-4xl leading-tight text-ink sm:text-5xl">
          Представительство
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone">
          Студия официально представляет ряд производителей и поставщиков —
          это значит прямые условия по цене и срокам для клиентов ATRIUM, без
          посредников.
        </p>

        <div className="mt-12">
          <MaterialGrid items={partners} />
        </div>

        <div className="mt-16 border-t border-line pt-10">
          <p className="text-base text-ink/90">Нужна конкретная позиция под ваш проект?</p>
          <a
            href={studio.contacts.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4 inline-flex"
          >
            Обсудить комплектацию
          </a>
          <Link href="/services/komplektatsiya" className="btn-secondary ml-4 mt-4 inline-flex">
            Услуга «Комплектация»
          </Link>
        </div>
      </div>
    </section>
  );
}
