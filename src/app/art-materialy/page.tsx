import type { Metadata } from "next";
import Link from "next/link";
import { MaterialGrid } from "@/components/MaterialGrid";
import { artMaterials } from "@/content/materials";
import { studio } from "@/content/studio";

export const metadata: Metadata = {
  title: "Комплектация / Арт-материалы",
  description:
    "Авторские техники и материалы студии ATRIUM: керамика, чеканка, витражи и фьюзинг стекла, декоративные тонировки — образцы можно увидеть в шоу-руме.",
};

export default function ArtMaterialyPage() {
  return (
    <section className="section pt-16">
      <div className="container-xl">
        <p className="eyebrow mb-4">Комплектация</p>
        <h1 className="font-serif-display max-w-3xl text-4xl leading-tight text-ink sm:text-5xl">
          Арт-материалы
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone">
          Авторские техники и материалы, которыми студия комплектует объекты:
          керамика, металл, стекло и декоративные покрытия — часть из них
          сделана лично основателем студии и её мастерами.
        </p>

        <div className="mt-12">
          <MaterialGrid items={artMaterials} />
        </div>

        <div className="mt-16 border-t border-line pt-10">
          <p className="text-base text-ink/90">Хотите увидеть образцы вживую?</p>
          <a
            href={studio.contacts.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4 inline-flex"
          >
            Записаться на визит
          </a>
          <Link href="/services/komplektatsiya" className="btn-secondary ml-4 mt-4 inline-flex">
            Услуга «Комплектация»
          </Link>
        </div>
      </div>
    </section>
  );
}
