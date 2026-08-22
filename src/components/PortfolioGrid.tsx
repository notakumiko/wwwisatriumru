"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PortfolioTile } from "@/components/PortfolioTile";
import { activeCategories, portfolio } from "@/lib/portfolio";
import { services } from "@/content/services";

const ALL = "";
const ALL_SERVICES = "Все услуги";

export function PortfolioGrid() {
  const [activeCat, setActiveCat] = useState<string>(ALL);
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

  // Фильтр услуг показываем, только пока у проектов есть привязка к услугам
  // (у рукописных кейсов она есть, у проектов из фотобазы — нет).
  const anyServices = portfolio.some((p) => p.servicesUsed?.length);

  const filtered = portfolio.filter((p) => {
    const catOk = activeCat === ALL || p.category === activeCat;
    const serviceOk =
      activeService === ALL_SERVICES || p.servicesUsed?.includes(activeService);
    return catOk && serviceOk;
  });

  const chip = (active: boolean) =>
    `px-4 py-2 text-sm transition-colors ${
      active
        ? "bg-accent text-deep"
        : "border border-line text-stone hover:border-accent hover:text-accent-light"
    }`;

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="w-24 text-xs uppercase tracking-[0.2em] text-stone">Раздел</span>
          <button onClick={() => setActiveCat(ALL)} className={chip(activeCat === ALL)}>
            Все проекты
          </button>
          {activeCategories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setActiveCat(c.slug)}
              className={chip(activeCat === c.slug)}
            >
              {c.label}
            </button>
          ))}
        </div>
        {anyServices && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-24 text-xs uppercase tracking-[0.2em] text-stone">Услуга</span>
            <button
              onClick={() => setActiveService(ALL_SERVICES)}
              className={chip(activeService === ALL_SERVICES)}
            >
              {ALL_SERVICES}
            </button>
            {services.map((service) => (
              <button
                key={service.slug}
                onClick={() => setActiveService(service.slug)}
                className={chip(activeService === service.slug)}
              >
                {service.title}
              </button>
            ))}
          </div>
        )}
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
          С таким сочетанием фильтров проектов пока нет — попробуйте другой раздел
          или услугу.
        </p>
      )}
    </div>
  );
}
