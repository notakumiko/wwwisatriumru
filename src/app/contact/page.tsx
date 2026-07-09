import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { studio } from "@/content/studio";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Свяжитесь со студией ATRIUM в Ташкенте: WhatsApp, Telegram, Instagram и e-mail. Ведём проекты также в Испании, на юге России, в Москве и Санкт-Петербурге.",
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container-xl grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow mb-6">Контакты</p>
          <h1 className="font-serif-display text-4xl leading-tight text-ink sm:text-5xl">
            Обсудим ваш проект
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-stone">
            Расскажите о задаче — и мы предложим формат работы: полный дизайн-проект,
            комплектацию или сопровождение под ключ.
          </p>

          <div className="mt-12 flex flex-col gap-4 border-t border-line pt-8 text-sm">
            <a href={`mailto:${studio.contacts.email}`} className="text-ink hover:text-accent-light">
              {studio.contacts.email}
            </a>
            <a
              href={studio.contacts.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-accent-light"
            >
              WhatsApp {studio.contacts.whatsappDisplay}
            </a>
            <a
              href={studio.contacts.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-accent-light"
            >
              Telegram {studio.contacts.telegramHandle}
            </a>
            <a
              href={studio.contacts.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-accent-light"
            >
              Instagram {studio.contacts.instagramHandle}
            </a>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-line pt-8 text-sm text-stone">
            <p>{studio.address}</p>
            <p>География проектов: {studio.geo.join(" · ")}</p>
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="border border-line p-8 md:p-12">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
