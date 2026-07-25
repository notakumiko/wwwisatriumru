"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { Lightbox } from "@/components/Lightbox";

export function ProjectGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="container-xl grid grid-cols-2 gap-4 sm:grid-cols-4">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="relative aspect-[4/5] overflow-hidden text-left"
            aria-label={`Открыть фото ${i + 1} из ${images.length}`}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox
            images={images}
            initialIndex={openIndex}
            alt={alt}
            onClose={() => setOpenIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
