import type { MetadataRoute } from "next";
import { studio } from "@/content/studio";
import { projects } from "@/content/projects";
import { articles } from "@/content/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/services", "/portfolio", "/blog", "/contact"].map(
    (path) => ({
      url: `${studio.url}${path}`,
      lastModified: new Date(),
    })
  );

  const projectRoutes = projects.map((p) => ({
    url: `${studio.url}/portfolio/${p.slug}`,
    lastModified: new Date(),
  }));

  const articleRoutes = articles.map((a) => ({
    url: `${studio.url}/blog/${a.slug}`,
    lastModified: new Date(a.date),
  }));

  return [...staticRoutes, ...projectRoutes, ...articleRoutes];
}
