import Link from "next/link";
import Image from "next/image";
import { projectCategories, type ProjectCategorySlug } from "@/content/projects";
import { projects } from "@/content/projects";

export function CategoryGrid() {
  return (
    <div>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projectCategories.map((cat) => {
          const items = projects.filter((p) => p.category === cat.slug);
          const cover = items[0]?.cover;
          return (
            <Link
              key={cat.slug}
              href={`/portfolio?category=${cat.slug}`}
              scroll={false}
              className="group block"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                {cover && (
                  <Image
                    src={cover}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-deep/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h2 className="font-serif-display text-2xl text-ink">{cat.title}</h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.15em] text-stone">
                    {items.length} {projectCountLabel(items.length)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-stone">{cat.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function projectCountLabel(n: number): "объект" | "объекта" | "объектов" {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "объект";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "объекта";
  return "объектов";
}

export type { ProjectCategorySlug };
