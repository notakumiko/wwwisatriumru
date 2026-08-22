import type { Metadata } from "next";
import { studio } from "@/content/studio";

export const DEFAULT_OG_IMAGE = "/og-image.jpg";

type BuildMetadataArgs = {
  /** Путь страницы от корня: "/", "/about", "/portfolio/dom-basseyn" */
  path: string;
  /** Заголовок без суффикса бренда — его добавит шаблон из layout */
  title: string;
  description: string;
  /** Своя картинка для превью в мессенджерах, иначе общая */
  image?: string;
  type?: "website" | "article";
};

/**
 * Собирает метаданные страницы с собственными canonical и og:url.
 *
 * Без этого Next наследует alternates.canonical из корневого layout,
 * и все страницы объявляют себя копиями главной.
 */
export function buildMetadata({
  path,
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  type = "website",
}: BuildMetadataArgs): Metadata {
  const fullTitle = path === "/" ? title : `${title} — ${studio.name}`;

  // Размеры проставляем только у общей картинки: у обложек проектов
  // пропорции свои, и врать о них в разметке незачем.
  const ogImage =
    image === DEFAULT_OG_IMAGE
      ? { url: image, width: 1200, height: 630, alt: fullTitle }
      : { url: image, alt: fullTitle };

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: studio.name,
      locale: "ru_RU",
      type,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
