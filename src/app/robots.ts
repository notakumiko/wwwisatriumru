import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { studio } from "@/content/studio";

/**
 * Обход разрешён только на боевом домене.
 *
 * Проверяем именно хост запроса, а не окружение Vercel: деплой из main
 * считается production и на превью-адресе vercel.app, так что по
 * VERCEL_ENV незаконченная версия попала бы в выдачу и начала
 * конкурировать со старым сайтом на том же контенте.
 *
 * Плюс такой проверки в том, что переключать ничего не нужно: как только
 * isatrium.ru поедет на Vercel, robots.txt откроется сам.
 *
 * ALLOW_INDEXING со значением "true" или "false" — ручное переопределение
 * на случай, если понадобится открыть превью или закрыть боевой домен.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const override = process.env.ALLOW_INDEXING;
  const productionHost = new URL(studio.url).host;
  const host = (await headers()).get("host")?.toLowerCase() ?? "";

  const allowed =
    override === "true"
      ? true
      : override === "false"
        ? false
        : host === productionHost || host === `www.${productionHost}`;

  if (!allowed) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${studio.url}/sitemap.xml`,
    host: studio.url,
  };
}
