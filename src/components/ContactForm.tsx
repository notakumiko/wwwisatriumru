"use client";

import { useState } from "react";
import { studio } from "@/content/studio";

export function ContactForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const subject = encodeURIComponent(`Заявка на проект от ${name || "клиента"}`);
  const body = encodeURIComponent(
    `Имя: ${name}\nКонтакт: ${contact}\n\n${message}`
  );
  const mailtoHref = `mailto:${studio.contacts.email}?subject=${subject}&body=${body}`;

  return (
    <form
      className="flex flex-col gap-5"
      action={mailtoHref}
      method="post"
      encType="text/plain"
    >
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

      <button type="submit" className="btn-primary w-full sm:w-fit">
        Отправить заявку
      </button>
      <p className="text-xs text-stone">
        Форма откроет письмо в вашей почтовой программе на адрес {studio.contacts.email}.
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
