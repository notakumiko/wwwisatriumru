import Link from "next/link";
import { studio } from "@/content/studio";

const navLinks = [
  { href: "/about", label: "О студии" },
  { href: "/services", label: "Услуги" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/blog", label: "Журнал" },
  { href: "/contact", label: "Контакты" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-deep text-ink">
      <div className="container-xl grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif-display text-2xl">{studio.name}</div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone">
            {studio.description}
          </p>
          <p className="mt-6 text-sm text-stone">{studio.city}</p>
        </div>

        <div>
          <div className="eyebrow">Навигация</div>
          <nav className="mt-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-stone transition-colors hover:text-accent-light"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <div className="eyebrow">Контакты</div>
          <div className="mt-4 flex flex-col gap-2 text-sm text-stone">
            <a href={`mailto:${studio.contacts.email}`} className="hover:text-accent-light">
              {studio.contacts.email}
            </a>
            <a href={studio.contacts.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-accent-light">
              WhatsApp {studio.contacts.whatsappDisplay}
            </a>
            <a href={studio.contacts.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-accent-light">
              Telegram {studio.contacts.telegramHandle}
            </a>
            <a href={studio.contacts.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent-light">
              Instagram {studio.contacts.instagramHandle}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-xl flex flex-col gap-2 py-6 text-xs text-stone sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {studio.fullName}. Все права защищены.
          </span>
          <span>{studio.geo.join(" · ")}</span>
        </div>
      </div>
    </footer>
  );
}
