"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import type { Project } from "@/content/projects";
import { Lightbox } from "@/components/Lightbox";

// Фиксированные пропорции карточек для мозаичной сетки — каждое фото
// кадрируется под них через object-cover, а не растягивается.
const RATIOS = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[2/3]"];

export function PortfolioTile({ project, index = 0 }: { project: Project; index?: number }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const ratio = RATIOS[index % RATIOS.length];
  const allPhotos = [project.cover, ...project.gallery];

  return (
    <div className="group">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className={`relative block w-full ${ratio} overflow-hidden bg-surface text-left`}
        aria-label={`Открыть галерею проекта: ${project.title}`}
      >
        <Image
          src={project.cover}
          alt={`${project.title} — ${project.style}, ${project.location}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-transparent to-deep/30" />
        {project.comingSoon && (
          <span className="absolute right-3 top-3 border border-line bg-deep/80 px-2 py-1 text-[9px] uppercase tracking-[0.15em] text-stone">
            Фото уточняются
          </span>
        )}
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <span className="eyebrow bg-deep/70 px-2 py-1 text-[10px]">
              {project.objectType}
            </span>
            <span className="text-xs text-ink/80">{project.year}</span>
          </div>
          <div>
            <div className="h-px w-10 bg-ink/60" />
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-ink/90">
              {project.style}
            </p>
          </div>
        </div>
        <span className="absolute bottom-4 right-4 bg-deep/70 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-ink/80 opacity-0 transition-opacity group-hover:opacity-100">
          {allPhotos.length} фото
        </span>
      </button>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <Link href={`/portfolio/${project.slug}`} className="group/link">
          <h3 className="font-serif-display text-lg text-ink transition-colors group-hover/link:text-accent-light">
            {project.title}
          </h3>
        </Link>
        {project.area && <span className="shrink-0 text-xs text-stone">{project.area}</span>}
      </div>
      <p className="text-sm text-stone">{project.location}</p>

      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={allPhotos}
            alt={`${project.title} — ${project.location}`}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
