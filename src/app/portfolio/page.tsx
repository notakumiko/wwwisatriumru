import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PortfolioGrid } from "@/components/PortfolioGrid";

export const metadata: Metadata = buildMetadata({
  path: "/portfolio",
  title: "Портфолио — реализованные проекты интерьера",
  description: "Квартиры, дома и коммерческие помещения в стиле винтаж и ретрофутуризм. Полные кейсы с фото, задачами и решениями студии ATRIUM.",
});

export default function PortfolioPage() {
  return (
    <section className="section pt-16">
      <div className="container-xl">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-6">Портфолио</p>
          <h1 className="font-serif-display text-4xl leading-tight text-ink sm:text-5xl">
            Реализованные проекты
          </h1>
          <p className="mt-6 text-base leading-relaxed text-stone">
            Частные резиденции и квартиры, загородные дома, рестораны, офисы и
            общественные пространства. Отфильтруйте по типу объекта или по услуге,
            с которой мы работали на проекте.
          </p>
        </div>
        <PortfolioGrid />
      </div>
    </section>
  );
}
