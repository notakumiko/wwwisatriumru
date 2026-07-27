"use client";

import { useState } from "react";
import { studio } from "@/content/studio";

export function LeadForm({ ctaLabel = "Отправить заявку" }: { ctaLabel?: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);

  const subject = encodeURIComponent(`Заявка с сайта от ${name || "клиента"}`);
  const body = encodeURIComponent(`Имя: ${name}\nТелефон: ${phone}`);
  const mailtoHref = `mailto:${studio.contacts.email}?subject=${subject}&body=${body}`;

  return (
    <form
      className="flex flex-col gap-4"
      action={mailtoHref}
      method="post"
      encType="text/plain"
    >
      <div>
        <label htmlFor="lead-form-name" className="mb-2 block text-sm text-stone">
          Имя
        </label>
        <input
          id="lead-form-name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-line bg-transparent px-4 py-3 text-ink outline-none transition-colors focus:border-accent"
          placeholder="Как к вам обращаться"
        />
      </div>

      <div>
        <label htmlFor="lead-form-phone" className="mb-2 block text-sm text-stone">
          Телефон
        </label>
        <input
          id="lead-form-phone"
          name="phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-line bg-transparent px-4 py-3 text-ink outline-none transition-colors focus:border-accent"
          placeholder="+7 ___ ___-__-__"
        />
      </div>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-stone">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 border-line bg-transparent accent-[var(--accent)]"
        />
        Согласен(на) на обработку персональных данных для связи по заявке.
      </label>

      <button
        type="submit"
        disabled={!consent}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-fit"
      >
        {ctaLabel}
      </button>
    </form>
  );
}
