import Link from "next/link";
import type { Project } from "@/content/projects";

export function PortfolioTile({ project }: { project: Project }) {
  const [from, to] = project.palette;

  return (
    <Link href={`/portfolio/${project.slug}`} className="group block">
      <div
        className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden p-6 transition-transform duration-500 group-hover:scale-[1.02]"
        style={{
          backgroundImage: `linear-gradient(155deg, ${from} 0%, ${to} 100%)`,
        }}
      >
        <div className="flex items-start justify-between">
          <span className="eyebrow bg-deep/70 px-2 py-1 text-[10px]">
            {project.category}
          </span>
          <span className="text-xs text-ink/70">{project.year}</span>
        </div>
        <div>
          <div className="h-px w-10 bg-ink/50" />
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-ink/85">
            {project.style}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="font-serif-display text-lg text-ink">{project.title}</h3>
        <span className="text-xs text-stone">{project.area}</span>
      </div>
      <p className="text-sm text-stone">{project.location}</p>
    </Link>
  );
}
