"use client";

import { useState } from "react";
import { studio } from "@/content/studio";

const TOTAL_STEPS = 5;

const propertyTypes = ["Квартира", "Дом", "Офис", "Другое"];
const styles = [
  "Современная классика",
  "Ар-деко",
  "Минимализм",
  "Лофт",
  "Средиземноморский",
  "Эклектика",
  "Ещё не определились",
];
const timelines = [
  "В ближайший месяц",
  "Через 1–3 месяца",
  "Через 3–6 месяцев",
  "Пока изучаю варианты",
];

type Answers = {
  propertyType: string;
  area: string;
  style: string;
  timeline: string;
  name: string;
  phone: string;
  messenger: string;
};

const emptyAnswers: Answers = {
  propertyType: "",
  area: "",
  style: "",
  timeline: "",
  name: "",
  phone: "",
  messenger: "",
};

function OptionTile({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border px-5 py-4 text-left text-sm transition-colors ${
        active
          ? "border-accent bg-accent/10 text-ink"
          : "border-line text-stone hover:border-accent hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

export function PricingQuiz() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (patch: Partial<Answers>) => setAnswers((a) => ({ ...a, ...patch }));

  const canGoNext = (() => {
    if (step === 1) return Boolean(answers.propertyType);
    if (step === 2) return Boolean(answers.area);
    if (step === 3) return Boolean(answers.style);
    if (step === 4) return Boolean(answers.timeline);
    return true;
  })();

  const subject = encodeURIComponent(`Заявка с калькулятора: ${answers.propertyType || "объект"}`);
  const body = encodeURIComponent(
    [
      `Тип жилья: ${answers.propertyType}`,
      `Площадь: ${answers.area} м²`,
      `Стиль: ${answers.style}`,
      `Сроки начала: ${answers.timeline}`,
      `Имя: ${answers.name}`,
      `Телефон: ${answers.phone}`,
      `Мессенджер: ${answers.messenger}`,
    ].join("\n")
  );
  const mailtoHref = `mailto:${studio.contacts.email}?subject=${subject}&body=${body}`;

  if (submitted) {
    return (
      <div className="border border-line bg-surface p-10 text-center">
        <p className="font-serif-display text-2xl text-ink">Заявка отправлена</p>
        <p className="mt-3 text-sm leading-relaxed text-stone">
          Мы свяжемся с вами в течение рабочего дня и пришлём расчёт по вашему
          объекту. Если удобнее написать напрямую —{" "}
          <a href={studio.contacts.whatsapp} className="underline hover:text-accent-light">
            WhatsApp
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="border border-line bg-surface p-6 sm:p-10">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-stone">
        <span>Вопрос {step} из {TOTAL_STEPS}</span>
        <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
      </div>
      <div className="mt-3 h-1 w-full bg-line">
        <div
          className="h-1 bg-accent transition-all duration-300"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      <div className="mt-8">
        {step === 1 && (
          <div>
            <h3 className="font-serif-display text-xl text-ink">Какой у вас тип жилья?</h3>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {propertyTypes.map((option) => (
                <OptionTile
                  key={option}
                  label={option}
                  active={answers.propertyType === option}
                  onClick={() => update({ propertyType: option })}
                />
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-serif-display text-xl text-ink">Какая общая площадь?</h3>
            <div className="mt-6">
              <label htmlFor="quiz-area" className="mb-2 block text-sm text-stone">
                Площадь в м²
              </label>
              <input
                id="quiz-area"
                type="number"
                min={1}
                inputMode="numeric"
                value={answers.area}
                onChange={(e) => update({ area: e.target.value })}
                className="w-full border border-line bg-transparent px-4 py-3 text-ink outline-none transition-colors focus:border-accent"
                placeholder="Например, 85"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="font-serif-display text-xl text-ink">Какой стиль интерьера ближе?</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {styles.map((option) => (
                <OptionTile
                  key={option}
                  label={option}
                  active={answers.style === option}
                  onClick={() => update({ style: option })}
                />
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="font-serif-display text-xl text-ink">Когда планируете начать ремонт?</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {timelines.map((option) => (
                <OptionTile
                  key={option}
                  label={option}
                  active={answers.timeline === option}
                  onClick={() => update({ timeline: option })}
                />
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 className="font-serif-display text-xl text-ink">Куда прислать расчёт?</h3>
            <div className="mt-6 flex flex-col gap-4">
              <div>
                <label htmlFor="quiz-name" className="mb-2 block text-sm text-stone">
                  Имя
                </label>
                <input
                  id="quiz-name"
                  required
                  value={answers.name}
                  onChange={(e) => update({ name: e.target.value })}
                  className="w-full border border-line bg-transparent px-4 py-3 text-ink outline-none transition-colors focus:border-accent"
                  placeholder="Как к вам обращаться"
                />
              </div>
              <div>
                <label htmlFor="quiz-phone" className="mb-2 block text-sm text-stone">
                  Телефон
                </label>
                <input
                  id="quiz-phone"
                  type="tel"
                  required
                  value={answers.phone}
                  onChange={(e) => update({ phone: e.target.value })}
                  className="w-full border border-line bg-transparent px-4 py-3 text-ink outline-none transition-colors focus:border-accent"
                  placeholder="+7 ___ ___-__-__"
                />
              </div>
              <div>
                <label htmlFor="quiz-messenger" className="mb-2 block text-sm text-stone">
                  Мессенджер (необязательно)
                </label>
                <input
                  id="quiz-messenger"
                  value={answers.messenger}
                  onChange={(e) => update({ messenger: e.target.value })}
                  className="w-full border border-line bg-transparent px-4 py-3 text-ink outline-none transition-colors focus:border-accent"
                  placeholder="Telegram, WhatsApp"
                />
              </div>
              <label className="mt-2 flex items-start gap-3 text-xs leading-relaxed text-stone">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 border-line bg-transparent accent-[var(--accent)]"
                />
                Согласен(на) на обработку персональных данных для связи по заявке.
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          className={`text-sm text-stone transition-colors hover:text-ink ${step === 1 ? "invisible" : ""}`}
        >
          ← Назад
        </button>

        {step < TOTAL_STEPS ? (
          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Далее →
          </button>
        ) : (
          <a
            href={mailtoHref}
            onClick={() => setSubmitted(true)}
            className={`btn-primary ${
              !answers.name || !answers.phone || !consent ? "pointer-events-none opacity-40" : ""
            }`}
          >
            Получить расчёт
          </a>
        )}
      </div>
    </div>
  );
}
