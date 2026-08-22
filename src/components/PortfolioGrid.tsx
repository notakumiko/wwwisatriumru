"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PortfolioTile } from "@/components/PortfolioTile";
import { objectTypes, projects } from "@/content/projects";
import { services } from "@/content/services";

const ALL_SERVICES = "Все услуги";

export function PortfolioGrid() {
  const [activeType, setActiveType] =
    useState<(typeof objectTypes)[number]>("Все объекты");
  const [activeService, setActiveService] = useState<string>(ALL_SERVICES);

  // Предвыбор услуги из ?usluga= читаем после монтирования, а не через
  // useSearchParams: тот переводит страницу в клиентский рендер, и в серверной
  // разметке не остаётся ни карточек, ни ссылок на проекты — для Яндекса и
  // ИИ-поисковиков раздел выглядит пустым.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("usluga");
    if (requested && services.some((s) => s.slug === requested)) {
      setActiveService(requested);
    }
  }, []);

  const filtered = projects.filter((p) => {
    const typeOk = activeType === "Все объекты" || p.objectType === activeType;
    const serviceOk =
      activeService === ALL_SERVICES || p.servicesUsed.includes(activeService);
    return typeOk && serviceOk;
  });

  return (
    <div>
      <div className="flex flex-col gap-4">
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
        <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.12, ease: "easeOut" }}
            >
              <PortfolioTile project={project} />
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
