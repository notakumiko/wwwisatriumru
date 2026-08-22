import Link from "next/link";
import Image from "next/image";
import { categoryLabel, type PortfolioProject } from "@/lib/portfolio";

function TileFrame({ project }: { project: PortfolioProject }) {
  return (
    <>
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        {project.cover ? (
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.2em] text-stone">
            Материалы готовятся
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-transparent to-deep/30" />
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <span className="eyebrow bg-deep/70 px-2 py-1 text-[10px]">
              {categoryLabel(project.category)}
            </span>
            {project.year && <span className="text-xs text-ink/80">{project.year}</span>}
          </div>
          <div>
            <div className="h-px w-10 bg-ink/60" />
            {project.style && (
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-ink/90">
                {project.style}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="font-serif-display text-lg text-ink">{project.title}</h3>
        {project.area && <span className="shrink-0 text-xs text-stone">{project.area}</span>}
      </div>
      {project.city && <p className="text-sm text-stone">{project.city}</p>}
    </>
  );
}

export function PortfolioTile({ project }: { project: PortfolioProject }) {
  const openable = project.status === "published" && project.cover && project.gallery.length > 0;
  if (!openable) {
    return (
      <div className="group block opacity-70" aria-label={`${project.title} — материалы готовятся`}>
        <TileFrame project={project} />
      </div>
    );
  }
  return (
    <Link href={`/portfolio/${project.slug}`} className="group block">
      <TileFrame project={project} />
    </Link>
  );
}
