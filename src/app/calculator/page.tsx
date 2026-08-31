import type { Metadata } from "next";
import { PricingQuiz } from "@/components/PricingQuiz";
import { ContractSampleBlock } from "@/components/ContractSampleBlock";
import { studio } from "@/content/studio";

export const metadata: Metadata = {
  title: "Рассчитать стоимость проекта",
  description:
    "Ответьте на 5 коротких вопросов о вашем объекте — пришлём ориентировочный расчёт и предложим формат работы.",
};

export default function CalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: studio.url },
      { "@type": "ListItem", position: 2, name: "Рассчитать стоимость проекта", item: `${studio.url}/calculator` },
    ],
  };

  return (
    <section className="section pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-xl grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow mb-4">Калькулятор</p>
          <h1 className="font-serif-display text-4xl leading-tight text-ink sm:text-5xl">
            Узнайте стоимость своего проекта
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-stone">
            5 коротких вопросов о вашем объекте — и мы пришлём ориентировочный
            расчёт и предложим формат работы: полный дизайн-проект,
            комплектацию или сопровождение под ключ.
          </p>
        </div>
        <div className="md:col-span-7">
          <PricingQuiz />
          <div className="mt-8">
            <ContractSampleBlock />
          </div>
        </div>
      </div>
    </section>
  );
}
