"use client";

import Link from "next/link";

export function ConsentField({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-xs text-stone">
      <input
        id={id}
        name="consent"
        type="checkbox"
        required
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 shrink-0 cursor-pointer accent-accent"
      />
      <span>
        Согласен на обработку персональных данных в соответствии с{" "}
        <Link href="/privacy" className="underline hover:text-accent-light">
          политикой обработки персональных данных
        </Link>
        .
      </span>
    </label>
  );
}

/** Скрытое поле-ловушка: заполнить его может только бот. */
export function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto size-px overflow-hidden">
      <label htmlFor="company">Компания</label>
      <input
        id="company"
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
