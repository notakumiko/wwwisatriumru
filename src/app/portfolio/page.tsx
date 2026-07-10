import type { Metadata } from "next";
import { Suspense } from "react";
import { PortfolioGrid } from "@/components/PortfolioGrid";

export const metadata: Metadata = {
  title: "Портфолио — реализованные проекты интерьера",
  description:
    "Квартиры, дома и коммерческие помещения в стиле винтаж и ретрофутуризм. Полные кейсы с фото, задачами и решениями студии ATRIUM.",
};

export default function PortfolioPage() {
  return (
    <section className="section pt-16">
      <div className="container-xl">
        <h1 className="sr-only">Портфолио студии ATRIUM</h1>
        <Suspense>
          <PortfolioGrid />
        </Suspense>
      </div>
    </section>
  );
}
