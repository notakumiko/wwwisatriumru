import type { Metadata } from "next";
import { PortfolioGrid } from "@/components/PortfolioGrid";

export const metadata: Metadata = {
  title: "Портфолио",
  description:
    "Портфолио дизайн-студии ATRIUM: жилые и коммерческие интерьеры в Ташкенте, Испании, на юге России, в Москве и Санкт-Петербурге.",
};

export default function PortfolioPage() {
  return (
    <section className="section pt-16">
      <div className="container-xl">
        <PortfolioGrid />
      </div>
    </section>
  );
}
