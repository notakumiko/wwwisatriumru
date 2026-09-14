import Image from "next/image";
import type { MaterialItem } from "@/content/materials";

export function MaterialGrid({ items }: { items: MaterialItem[] }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.slug} className="group">
          <div className="relative aspect-[4/5] overflow-hidden bg-surface">
            <Image
              src={item.img}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-transform duration-700 group-hover:scale-[1.04] ${
                item.comingSoon ? "opacity-40" : ""
              }`}
            />
            {item.comingSoon && (
              <div className="absolute inset-0 flex items-center justify-center bg-deep/40">
                <span className="border border-line bg-deep/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-stone">
                  Скоро добавим
                </span>
              </div>
            )}
          </div>
          <h3 className="mt-4 font-serif-display text-lg text-ink">{item.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-stone">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
