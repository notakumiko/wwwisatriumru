import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/content/projects";

export function PortfolioTile({ project }: { project: Project }) {
  return (
    <Link href={`/portfolio/${project.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <Image
          src={project.cover}
          alt={`${project.title} — ${project.style}, ${project.location}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-transparent to-deep/30" />
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
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="font-serif-display text-lg text-ink">{project.title}</h3>
        {project.area && <span className="shrink-0 text-xs text-stone">{project.area}</span>}
      </div>
      <p className="text-sm text-stone">{project.location}</p>
    </Link>
  );
}
