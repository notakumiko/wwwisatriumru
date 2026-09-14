import { studio, manifestoText, founderNote, highlights } from "@/content/studio";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { articles } from "@/content/articles";

// llms.txt — структурированное summary сайта для ИИ-агентов и LLM-поисковиков
// (см. llmstxt.org). Держим страницу в актуальном виде автоматически: она
// собирается из тех же content-модулей, что и sitemap.xml.
export async function GET() {
  const lines: string[] = [];

  lines.push(`# ${studio.fullName}`);
  lines.push("");
  lines.push(`> ${studio.description}`);
  lines.push("");
  lines.push(
    `${studio.manifesto} — ${manifestoText.paragraphs[0]}`
  );
  lines.push("");
  lines.push(
    `Основатель: ${founderNote.name}, ${founderNote.role}. ${founderNote.text}`
  );
  lines.push("");
  lines.push(`Ключевые цифры: ${highlights.map((h) => `${h.value} ${h.label}`).join("; ")}.`);
  lines.push("");
  lines.push(`География проектов: ${studio.geo.join(", ")}.`);
  lines.push("");

  lines.push("## Услуги");
  lines.push("");
  for (const s of services) {
    lines.push(`- [${s.title}](${studio.url}/services/${s.slug}): ${s.short}`);
  }
  lines.push("");

  lines.push("## Портфолио");
  lines.push("");
  for (const p of projects) {
    lines.push(
      `- [${p.title}](${studio.url}/portfolio/${p.slug}) — ${p.location}, ${p.objectType.toLowerCase()}, ${p.style}. ${p.summary}`
    );
  }
  lines.push("");

  if (articles.length > 0) {
    lines.push("## Журнал");
    lines.push("");
    for (const a of articles) {
      lines.push(`- [${a.title}](${studio.url}/blog/${a.slug}): ${a.excerpt}`);
    }
    lines.push("");
  }

  lines.push("## Дополнительно");
  lines.push("");
  lines.push(`- [Калькулятор стоимости](${studio.url}/calculator): расчёт по типу объекта, площади, стилю и срокам.`);
  lines.push(`- [Арт-материалы](${studio.url}/art-materialy): авторские техники и материалы студии.`);
  lines.push(`- [Представительство](${studio.url}/predstavitelstvo): партнёры-поставщики студии.`);
  lines.push("");

  lines.push("## Контакты");
  lines.push("");
  lines.push(`- Email: ${studio.contacts.email}`);
  lines.push(`- WhatsApp: ${studio.contacts.whatsappDisplay} (${studio.contacts.whatsapp})`);
  lines.push(`- Telegram: ${studio.contacts.telegramHandle} (${studio.contacts.telegram})`);
  lines.push(`- Instagram: ${studio.contacts.instagramHandle} (${studio.contacts.instagram})`);
  lines.push(`- Сайт: ${studio.url}`);

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
