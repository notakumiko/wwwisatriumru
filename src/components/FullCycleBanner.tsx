import Link from "next/link";

const capabilities = [
  {
    title: "Разработаем дизайн-проект",
    text: "Планировки, 3D-визуализация и рабочая документация под ваш объект.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-6 w-6">
        <path d="M4 20 14 10l3 3L7 23z" />
        <path d="M14 10l3-3 3 3-3 3" />
        <path d="M3 21l1-4 3 1z" />
      </svg>
    ),
  },
  {
    title: "Разработаем проект инженерных систем",
    text: "Электрика, вентиляция, водоснабжение — согласовано с архитектурой интерьера.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-6 w-6">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
      </svg>
    ),
  },
  {
    title: "Подберём подрядчиков",
    text: "Проверенные бригады и поставщики — без случайных исполнителей.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-6 w-6">
        <circle cx="8" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M2 21c0-3.3 2.7-6 6-6s6 2.7 6 6M14.5 21c.2-2.6 1.9-4.8 4.5-5.5" />
      </svg>
    ),
  },
  {
    title: "Авторский надзор",
    text: "Ведём объект лично на всех этапах — от старта до финальной приёмки.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-6 w-6">
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Сдача под ключ",
    text: "Шеф-монтаж, стайлинг и передача полностью готового интерьера.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-6 w-6">
        <circle cx="8" cy="15" r="4" />
        <path d="M11 12l9-9M17 3h4v4M15 9l2 2" />
      </svg>
    ),
  },
];

export function FullCycleBanner() {
  return (
    <section className="border-b border-line bg-surface">
      <div className="container-xl py-16 md:py-20">
        <p className="eyebrow mb-4">Полный цикл</p>
        <h2 className="font-serif-display max-w-4xl text-3xl leading-tight text-ink sm:text-4xl md:text-5xl">
          Дизайн интерьера, ремонт и комплектация под ключ
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone">
          Берём объект от первого эскиза до финальной приёмки — сами или на
          любом отдельном этапе, если часть работы уже сделана.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {capabilities.map((item) => (
            <div key={item.title} className="border-t border-line pt-5">
              <div className="text-accent-light">{item.icon}</div>
              <h3 className="mt-4 text-sm font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-stone">{item.text}</p>
            </div>
          ))}
        </div>

        <Link href="/calculator" className="btn-primary mt-10 inline-flex">
          Рассчитать стоимость
        </Link>
      </div>
    </section>
  );
}
