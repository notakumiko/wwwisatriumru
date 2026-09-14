"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PortfolioTile } from "@/components/PortfolioTile";
import { CategoryGrid } from "@/components/CategoryGrid";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { objectTypes, projects, getCategory, type ProjectCategorySlug } from "@/content/projects";
import { services } from "@/content/services";

const ALL_SERVICES = "Все услуги";

export function PortfolioGrid() {
  const searchParams = useSearchParams();
  const preselected = services.find((s) => s.slug === searchParams.get("usluga"));
  const categorySlug = searchParams.get("category") as ProjectCategorySlug | null;
  const category = categorySlug ? getCategory(categorySlug) : undefined;

  const [activeType, setActiveType] =
    useState<(typeof objectTypes)[number]>("Все объекты");
  const [activeService, setActiveService] = useState<string>(
    preselected ? preselected.slug : ALL_SERVICES
  );

  if (!category) {
    return (
      <div>
        <p className="eyebrow mb-2">Портфолио</p>
        <h1 className="font-serif-display text-3xl text-ink sm:text-4xl">
          Проекты по категориям
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone">
          Каждая категория — это папка с обложкой: внутри проекты студии по
          этому направлению, у каждого своя галерея снимков.
        </p>

        <div className="mt-12">
          <p className="eyebrow mb-4">До / после</p>
          {/* PLACEHOLDER: заменить на реальную пару "до/после" одного ракурса, когда появятся фото клиента */}
          <BeforeAfterSlider
            before={{
              src: "/portfolio/_placeholder/ph-restaurant-nook.jpg",
              alt: "Помещение до реализации проекта",
              label: "До",
            }}
            after={{
              src: "/portfolio/rezidentsiya-art-deco-spb/cover.jpg",
              alt: "Интерьер после реализации проекта",
              label: "После",
            }}
          />
          <p className="mt-3 text-xs text-stone">
            Потяните за ползунок, чтобы сравнить помещение до и после работы студии.
          </p>
        </div>

        <CategoryGrid />
      </div>
    );
  }

  const filtered = projects.filter((p) => {
    const categoryOk = p.category === category.slug;
    const typeOk = activeType === "Все объекты" || p.objectType === activeType;
    const serviceOk =
      activeService === ALL_SERVICES || p.servicesUsed.includes(activeService);
    return categoryOk && typeOk && serviceOk;
  });

  return (
    <div>
      <Link href="/portfolio" scroll={false} className="text-sm text-stone hover:text-accent-light">
        ← Все категории
      </Link>
      <p className="eyebrow mb-2 mt-6">Портфолио</p>
      <h1 className="font-serif-display text-3xl text-ink sm:text-4xl">{category.title}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone">{category.description}</p>

      <div className="mt-10 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="w-24 text-xs uppercase tracking-[0.2em] text-stone">Тип</span>
          {objectTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 text-sm transition-colors ${
                activeType === type
                  ? "bg-accent text-deep"
                  : "border border-line text-stone hover:border-accent hover:text-accent-light"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="w-24 text-xs uppercase tracking-[0.2em] text-stone">Услуга</span>
          <button
            onClick={() => setActiveService(ALL_SERVICES)}
            className={`px-4 py-2 text-sm transition-colors ${
              activeService === ALL_SERVICES
                ? "bg-accent text-deep"
                : "border border-line text-stone hover:border-accent hover:text-accent-light"
            }`}
          >
            {ALL_SERVICES}
          </button>
          {services.map((service) => (
            <button
              key={service.slug}
              onClick={() => setActiveService(service.slug)}
              className={`px-4 py-2 text-sm transition-colors ${
                activeService === service.slug
                  ? "bg-accent text-deep"
                  : "border border-line text-stone hover:border-accent hover:text-accent-light"
              }`}
            >
              {service.title}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-12 columns-1 gap-8 sm:columns-2 lg:columns-3">
          {filtered.map((project, i) => (
            <motion.div
              key={project.slug}
              className="mb-8 break-inside-avoid"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.12, ease: "easeOut" }}
            >
              <PortfolioTile project={project} index={i} />
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="mt-12 text-sm text-stone">
          С таким сочетанием фильтров проектов пока нет — попробуйте другой тип
          объекта или услугу.
        </p>
      )}
    </div>
  );
}
