"use client";

import { useState } from "react";
import { studio } from "@/content/studio";
import { sendLead } from "@/lib/send-lead";
import { ConsentField, HoneypotField } from "@/components/ConsentField";

const objectOptions = ["Квартира", "Дом", "Коммерческое помещение", "Другое"];

type Status = "idle" | "sending" | "sent" | "error";

export function MiniLeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [objectType, setObjectType] = useState(objectOptions[0]);
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await sendLead({
        name,
        contact: phone,
        objectType,
        consent,
        company,
        source: "Главная, короткая форма",
      });
      setStatus("sent");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="border border-accent/40 bg-surface p-6">
        <p className="font-serif-display text-xl text-ink">Заявка отправлена</p>
        <p className="mt-3 text-sm text-stone">
          Спасибо, {name || "друг"}. Мы свяжемся с вами в ближайшее время — или
          напишите нам сразу в{" "}
          <a href={studio.contacts.whatsapp} className="underline hover:text-accent-light">
            WhatsApp
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form className="relative flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <HoneypotField value={company} onChange={setCompany} />

      <div>
        <label htmlFor="lead-name" className="mb-2 block text-sm text-stone">
          Имя
        </label>
        <input
          id="lead-name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-line bg-transparent px-4 py-3 text-ink outline-none transition-colors focus:border-accent"
          placeholder="Как к вам обращаться"
        />
      </div>

      <div>
        <label htmlFor="lead-phone" className="mb-2 block text-sm text-stone">
          Телефон
        </label>
        <input
          id="lead-phone"
          name="phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-line bg-transparent px-4 py-3 text-ink outline-none transition-colors focus:border-accent"
          placeholder="+7 ___ ___-__-__"
        />
      </div>

      <div>
        <label htmlFor="lead-object" className="mb-2 block text-sm text-stone">
          Тип объекта
        </label>
        <select
          id="lead-object"
          name="objectType"
          value={objectType}
          onChange={(e) => setObjectType(e.target.value)}
          className="w-full border border-line bg-transparent px-4 py-3 text-ink outline-none transition-colors focus:border-accent"
        >
          {objectOptions.map((option) => (
            <option key={option} value={option} className="bg-deep text-ink">
              {option}
            </option>
          ))}
        </select>
      </div>

      <ConsentField id="lead-consent" checked={consent} onChange={setConsent} />

      <button
        type="submit"
        disabled={status === "sending" || !consent}
        className="btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
      >
        {status === "sending" ? "Отправляем…" : "Получить консультацию"}
      </button>

      {status === "error" && (
        <p role="alert" className="text-sm text-accent-light">
          {error}
        </p>
      )}
    </form>
  );
}
