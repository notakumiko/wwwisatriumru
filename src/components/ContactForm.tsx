"use client";

import { useState } from "react";
import { studio } from "@/content/studio";
import { sendLead } from "@/lib/send-lead";
import { ConsentField, HoneypotField } from "@/components/ConsentField";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await sendLead({ name, contact, message, consent, company, source: "Контакты" });
      setStatus("sent");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="border border-accent/40 bg-surface p-6"
      >
        <p className="font-serif-display text-xl text-ink">Заявка отправлена</p>
        <p className="mt-3 text-sm text-stone">
          Спасибо, {name || "друг"}. Мы свяжемся с вами в ближайшее время. Если нужно
          быстрее — напишите в{" "}
          <a href={studio.contacts.whatsapp} className="underline hover:text-accent-light">
            WhatsApp
          </a>{" "}
          или{" "}
          <a href={studio.contacts.telegram} className="underline hover:text-accent-light">
            Telegram
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form className="relative flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <HoneypotField value={company} onChange={setCompany} />

      <div>
        <label htmlFor="name" className="mb-2 block text-sm text-stone">
          Имя
        </label>
        <input
          id="name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-line bg-transparent px-4 py-3 text-ink outline-none transition-colors focus:border-accent"
          placeholder="Как к вам обращаться"
        />
      </div>

      <div>
        <label htmlFor="contact" className="mb-2 block text-sm text-stone">
          Телефон, WhatsApp или e-mail
        </label>
        <input
          id="contact"
          name="contact"
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full border border-line bg-transparent px-4 py-3 text-ink outline-none transition-colors focus:border-accent"
          placeholder="Куда ответить"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm text-stone">
          О проекте
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-line bg-transparent px-4 py-3 text-ink outline-none transition-colors focus:border-accent"
          placeholder="Тип объекта, город, метраж, сроки — любые детали"
        />
      </div>

      <ConsentField id="contact-consent" checked={consent} onChange={setConsent} />

      <button
        type="submit"
        disabled={status === "sending" || !consent}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
      >
        {status === "sending" ? "Отправляем…" : "Отправить заявку"}
      </button>

      {status === "error" && (
        <p role="alert" className="text-sm text-accent-light">
          {error}
        </p>
      )}

      <p className="text-xs text-stone">
        Также можно написать напрямую в{" "}
        <a href={studio.contacts.whatsapp} className="underline hover:text-accent-light">
          WhatsApp
        </a>{" "}
        или{" "}
        <a href={studio.contacts.telegram} className="underline hover:text-accent-light">
          Telegram
        </a>
        .
      </p>
    </form>
  );
}
