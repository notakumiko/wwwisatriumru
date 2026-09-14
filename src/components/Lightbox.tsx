"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type LightboxProps = {
  images: string[];
  initialIndex?: number;
  alt: string;
  onClose: () => void;
};

export function Lightbox({ images, initialIndex = 0, alt, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-deep/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-6 py-5 text-sm text-ink/80">
        <span>
          {index + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-2xl leading-none text-ink/80 transition-colors hover:text-accent-light"
          aria-label="Закрыть галерею"
        >
          ×
        </button>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center px-4 pb-6 sm:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center text-3xl text-ink/70 transition-colors hover:text-accent-light sm:left-4"
          aria-label="Предыдущее фото"
        >
          ‹
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="relative h-full w-full max-w-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={images[index]}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={goNext}
          className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center text-3xl text-ink/70 transition-colors hover:text-accent-light sm:right-4"
          aria-label="Следующее фото"
        >
          ›
        </button>
      </div>
    </motion.div>
  );
}
