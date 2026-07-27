"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

type Side = { src: string; alt: string; label: string };

export function BeforeAfterSlider({
  before,
  after,
}: {
  before: Side;
  after: Side;
}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    updateFromClientX(e.clientX);
    const onMove = (ev: PointerEvent) => updateFromClientX(ev.clientX);
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div
      ref={containerRef}
      className="group relative aspect-[16/10] w-full touch-none select-none overflow-hidden bg-surface"
      onPointerDown={handlePointerDown}
    >
      {/* ПОСЛЕ — фоновый слой на всю карточку */}
      <div className="absolute inset-0">
        <Image
          src={after.src}
          alt={after.alt}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="pointer-events-none object-cover"
          draggable={false}
        />
        <span className="absolute right-4 top-4 border border-line bg-deep/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-ink/90">
          {after.label}
        </span>
      </div>

      {/* ДО — обрезается по позиции ползунка через clip-path (без замера ширины в JS) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={before.src}
          alt={before.alt}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="pointer-events-none object-cover"
          draggable={false}
        />
        <span className="absolute left-4 top-4 border border-line bg-deep/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-ink/90">
          {before.label}
        </span>
      </div>

      {/* Разделительная линия и ручка */}
      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-accent-light"
        style={{ left: `${position}%` }}
      >
        <div className="pointer-events-auto absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-accent-light bg-deep/90 text-accent-light shadow-lg">
          <span aria-hidden className="text-sm">↔</span>
        </div>
      </div>
    </div>
  );
}
