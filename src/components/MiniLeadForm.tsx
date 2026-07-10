"use client";

import { useState } from "react";
import { studio } from "@/content/studio";

const objectOptions = ["Квартира", "Дом", "Коммерческое помещение", "Другое"];

export function MiniLeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [objectType, setObjectType] = useState(objectOptions[0]);

  const subject = encodeURIComponent(`Заявка с сайта: ${objectType}`);
  const body = encodeURIComponent(
    `Имя: ${name}\nТелефон: ${phone}\nТип объекта: ${objectType}`
  );
  const mailtoHref = `mailto:${studio.contacts.email}?subject=${subject}&body=${body}`;

  return (
    <form
      className="flex flex-col gap-4"
      action={mailtoHref}
      method="post"
      encType="text/plain"
    >
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
          placeholder="+998 __ ___-__-__"
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

      <button type="submit" className="btn-primary mt-2 w-full sm:w-fit">
        Получить консультацию
      </button>
    </form>
  );
}
