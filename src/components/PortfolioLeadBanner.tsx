"use client";

import { useState } from "react";
import Image from "next/image";
import { LeadForm } from "@/components/LeadForm";

export function PortfolioLeadBanner() {
  const [open, setOpen] = useState(false);

  return (
    <section className="section border-y border-line">
      <div className="container-xl grid gap-12 md:grid-cols-12 md:items-center">
        <div className="order-2 md:order-1 md:col-span-7">
          <p className="eyebrow mb-4">Портфолио и расчёт</p>
          <h2 className="font-serif-display text-3xl leading-tight text-ink sm:text-4xl">
            Хотите увидеть реальные примеры и стоимость?
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-stone">
            Пришлём подборку реализованных объектов, близких по типу и
            бюджету к вашему, и предварительный расчёт — на почту или в
            мессенджер, без звонков и встреч на этом этапе.
          </p>

          {!open ? (
            <button type="button" onClick={() => setOpen(true)} className="btn-primary mt-8 inline-flex">
              Получить портфолио и расчёт
            </button>
          ) : (
            <div className="mt-8 max-w-md border border-line bg-surface p-6">
              <LeadForm ctaLabel="Прислать портфолио и расчёт" />
            </div>
          )}
        </div>

        <div className="relative order-1 aspect-[3/4] overflow-hidden md:order-2 md:col-span-5">
          {/* PLACEHOLDER: заменить на обложку реального каталога/презентации студии */}
          <Image
            src="/portfolio/rezidentsiya-art-deco-spb/cover.jpg"
            alt="Каталог портфолио ATRIUM"
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <p className="eyebrow">ATRIUM</p>
            <p className="mt-2 font-serif-display text-2xl text-ink">Портфолио студии</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone">Подборка объектов</p>
          </div>
        </div>
      </div>
    </section>
  );
}
