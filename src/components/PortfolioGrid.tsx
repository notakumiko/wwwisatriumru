"use client";

import { useState } from "react";
import { PortfolioTile } from "@/components/PortfolioTile";
import { categories, projects } from "@/content/projects";

export function PortfolioGrid() {
  const [active, setActive] = useState<(typeof categories)[number]>("Все проекты");

  const filtered =
    active === "Все проекты" ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 text-sm transition-colors ${
              active === cat
                ? "bg-accent text-deep"
                : "border border-line text-stone hover:border-accent hover:text-accent-light"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <PortfolioTile key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
