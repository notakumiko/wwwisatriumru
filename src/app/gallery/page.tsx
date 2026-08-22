import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";
import { studio, gallery } from "@/content/studio";

export const metadata: Metadata = buildMetadata({
  path: "/gallery",
  title: gallery.title,
  description: gallery.description,
});

const samples = [
  { label: "Литьё и фьюзинг стекла", img: "/craft-steklo.jpg" },
  { label: "Керамика", img: "/craft-keramika.jpg" },
  { label: "Витражи", img: "/craft-vitrazhi.jpg" },
  { label: "Барельефы", img: "/craft-barelefy.jpg" },
];

export default function GalleryPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-xl py-20 md:py-28">
          <p className="eyebrow mb-6">{gallery.eyebrow}</p>
          <h1 className="font-serif-display max-w-3xl text-4xl leading-tight text-ink sm:text-5xl">
            {gallery.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-stone">
            {gallery.description}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-xl grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {samples.map((sample) => (
            <div key={sample.label} className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={sample.img}
                alt={sample.label}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-deep/10 to-transparent" />
              <span className="absolute bottom-4 left-4 font-serif-display text-lg text-ink">
                {sample.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="section border-t border-line bg-surface">
        <div className="container-xl grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow mb-4">Адрес и время</p>
            <p className="text-lg text-ink/90">{gallery.city}</p>
            <p className="mt-2 max-w-md text-base leading-relaxed text-stone">{gallery.visiting}</p>
          </div>
          <div className="flex md:justify-end">
            <a
              href={studio.contacts.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              {gallery.ctaLabel}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
