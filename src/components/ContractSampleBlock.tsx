import { studio } from "@/content/studio";

export function ContractSampleBlock() {
  // PLACEHOLDER: заменить href на прямую ссылку на PDF образца договора,
  // когда студия загрузит файл. Сейчас кнопка ведёт в WhatsApp с готовым текстом запроса.
  const requestHref = `${studio.contacts.whatsapp}?text=${encodeURIComponent(
    "Здравствуйте! Пришлите, пожалуйста, образец договора студии."
  )}`;

  return (
    <div className="flex flex-col gap-5 border border-line bg-surface p-8 sm:flex-row sm:items-center">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-accent text-accent-light">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-7 w-7">
          <path d="M6 2h9l5 5v15H6z" />
          <path d="M15 2v5h5" />
          <path d="M9 13h6M9 16.5h6M9 9.5h3" />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="font-serif-display text-xl text-ink">Образец договора</h3>
        <p className="mt-2 text-sm leading-relaxed text-stone">
          Фиксируем бюджет, сроки и состав работ в договоре до старта проекта —
          без скрытых доплат и финансовых сюрпризов в процессе.
        </p>
      </div>
      <a
        href={requestHref}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary shrink-0"
      >
        Смотреть образец договора
      </a>
    </div>
  );
}
