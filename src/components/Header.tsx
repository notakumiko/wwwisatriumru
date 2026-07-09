"use client";

import Link from "next/link";
import { useState } from "react";
import { studio } from "@/content/studio";

const navLinks = [
  { href: "/about", label: "О студии" },
  { href: "/services", label: "Услуги" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/blog", label: "Журнал" },
  { href: "/contact", label: "Контакты" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur">
      <div className="container-xl flex h-20 items-center justify-between">
        <Link
          href="/"
          className="font-serif-display text-2xl tracking-wide text-ink"
          onClick={() => setOpen(false)}
        >
          {studio.name}
          <span className="ml-2 hidden text-xs font-sans tracking-[0.25em] text-stone uppercase sm:inline">
            design studio
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink/80 transition-colors hover:text-accent-light"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <a href={studio.contacts.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Обсудить проект
          </a>
        </div>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Открыть меню"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block h-px w-6 bg-ink transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-px w-6 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-6 bg-ink transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-bg md:hidden">
          <nav className="container-xl flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-base text-ink/85"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={studio.contacts.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-2 w-full"
            >
              Обсудить проект
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
