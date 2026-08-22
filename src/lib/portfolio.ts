import { projects as legacyProjects, type Project as LegacyProject } from "@/content/projects";
import rawBase from "@/content/portfolio.json";

/**
 * Единая модель портфолио.
 *
 * Источника два:
 * 1. `src/content/portfolio.json` — база из «Архив-студии». Формат — контракт
 *    с фотопайплайном студии (см. docs/portfolio-integration.md): категория
 *    из семи слагов, cover.jpg + 01.jpg… в public/portfolio/<slug>/,
 *    alt-тексты у каждого кадра, года и площади только подтверждённые.
 * 2. `src/content/projects.ts` — проекты, собранные вручную до появления базы.
 *    Остаются, пока их не заменят материалы из архива.
 *
 * Добавление проектов из архива — только данные, без правок кода:
 * папки с фото в public/portfolio/ + записи в portfolio.json.
 */

export type CategorySlug =
  | "restaurants"
  | "offices"
  | "commercial"
  | "houses"
  | "apartments"
  | "decor"
  | "concepts";

export const CATEGORIES: { slug: CategorySlug; label: string }[] = [
  { slug: "apartments", label: "Квартиры" },
  { slug: "houses", label: "Дома и загородные" },
  { slug: "restaurants", label: "Рестораны" },
  { slug: "offices", label: "Офисы" },
  { slug: "commercial", label: "Коммерческие пространства" },
  { slug: "decor", label: "Декор" },
  { slug: "concepts", label: "Авторские концепции" },
];

export const categoryLabel = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

export type PortfolioImage = {
  src: string;
  alt: string;
  /** alt сгенерирован автоматически и ещё не вычитан */
  altAuto?: boolean;
};

export type PortfolioProject = {
  slug: string;
  title: string;
  category: CategorySlug;
  /** placeholder — проект заведён, материалы ещё готовятся */
  status: "published" | "placeholder";
  city?: string;
  year?: string;
  /** Площадь в м² */
  area?: string;
  style?: string;
  summary: string;
  /** Абзацы описания */
  description: string[];
  cover?: PortfolioImage;
  gallery: PortfolioImage[];
  /* Расширенные блоки рукописных кейсов — у проектов из базы их пока нет */
  task?: string;
  solution?: string[];
  materials?: string[];
  servicesUsed?: string[];
  quote?: { text: string; author: string };
};

/* ---------- проекты из базы «Архив-студии» ---------- */

type BaseImage = { file: string; alt?: string; altAuto?: boolean };
type BaseProject = {
  title: string;
  slug: string;
  category: string;
  status?: string;
  city?: string;
  year?: number | string;
  area?: number | string;
  summary?: string;
  description?: string;
  cover?: BaseImage;
  images?: BaseImage[];
};

const srcOf = (slug: string, file: string) =>
  file.startsWith("/") ? file : `/portfolio/${slug}/${file}`;

function imageOf(slug: string, title: string, im: BaseImage): PortfolioImage {
  return {
    src: srcOf(slug, im.file),
    alt: im.alt || `${title} — интерьер`,
    altAuto: im.altAuto,
  };
}

function fromBase(p: BaseProject): PortfolioProject {
  return {
    slug: p.slug,
    title: p.title,
    category: (CATEGORIES.some((c) => c.slug === p.category)
      ? p.category
      : "commercial") as CategorySlug,
    status: p.status === "placeholder" ? "placeholder" : "published",
    city: p.city || undefined,
    year: p.year ? String(p.year) : undefined,
    area: p.area ? `${p.area} м²` : undefined,
    summary: p.summary || "",
    description: (p.description || "")
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .filter(Boolean),
    cover: p.cover ? imageOf(p.slug, p.title, p.cover) : undefined,
    gallery: (p.images || []).map((im) => imageOf(p.slug, p.title, im)),
  };
}

/* ---------- рукописные кейсы (до замены материалами из архива) ---------- */

function fromLegacy(p: LegacyProject): PortfolioProject {
  const alt = (suffix: string) => `${p.title} — ${p.style}, ${p.location}${suffix}`;
  return {
    slug: p.slug,
    title: p.title,
    category: p.category,
    status: "published",
    city: p.location,
    year: p.year || undefined,
    area: p.area,
    style: p.style,
    summary: p.summary,
    description: [],
    cover: { src: p.cover, alt: alt("") },
    gallery: p.gallery.map((src, i) => ({ src, alt: alt(` — фото ${i + 2}`) })),
    task: p.task,
    solution: p.solution,
    materials: p.materials,
    servicesUsed: p.servicesUsed,
    quote: p.quote,
  };
}

/* ---------- сводный список ---------- */

const baseProjects = (rawBase as BaseProject[]).map(fromBase);
const baseSlugs = new Set(baseProjects.map((p) => p.slug));

/** База из архива идёт первой; рукописный кейс с тем же slug считается заменённым. */
export const portfolio: PortfolioProject[] = [
  ...baseProjects,
  ...legacyProjects.filter((p) => !baseSlugs.has(p.slug)).map(fromLegacy),
];

/** Только то, что можно показывать страницей: есть обложка и хотя бы один кадр. */
export const published = portfolio.filter(
  (p) => p.status === "published" && p.cover && p.gallery.length > 0
);

export const bySlug = (slug: string) => published.find((p) => p.slug === slug);

/** Категории, в которых есть хоть один проект (для фильтров). */
export const activeCategories = CATEGORIES.filter((c) =>
  portfolio.some((p) => p.category === c.slug)
);
