import { NextResponse } from "next/server";
import { deliverLead, type Lead } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Простая защита от перебора: не больше 5 заявок с одного адреса за 10 минут. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // не даём карте расти бесконечно между холодными стартами
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Слишком много заявок подряд. Попробуйте через несколько минут." },
      { status: 429 }
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос." }, { status: 400 });
  }

  // Ловушка для ботов: поле спрятано от людей, заполнить его может только робот.
  if (clean(payload.company, 100)) {
    return NextResponse.json({ ok: true });
  }

  if (payload.consent !== true) {
    return NextResponse.json(
      { ok: false, error: "Нужно согласие на обработку персональных данных." },
      { status: 400 }
    );
  }

  const lead: Lead = {
    name: clean(payload.name, 100),
    contact: clean(payload.contact, 200),
    message: clean(payload.message, 4000) || undefined,
    objectType: clean(payload.objectType, 100) || undefined,
    source: clean(payload.source, 50) || "unknown",
    pageUrl: clean(payload.pageUrl, 300) || undefined,
  };

  if (lead.name.length < 2) {
    return NextResponse.json({ ok: false, error: "Укажите, как к вам обращаться." }, { status: 400 });
  }
  if (lead.contact.length < 3) {
    return NextResponse.json({ ok: false, error: "Укажите телефон или почту для ответа." }, { status: 400 });
  }

  const results = await deliverLead(lead);
  const delivered = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok && !r.skipped);
  const configured = results.filter((r) => !r.skipped);

  if (failed.length) {
    console.error(
      "[lead] каналы не приняли заявку:",
      failed.map((f) => `${f.channel}: ${f.error}`).join(" | ")
    );
  }

  if (!configured.length) {
    console.error("[lead] ни один канал доставки не настроен, заявка потеряна:", lead);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Не удалось отправить заявку. Напишите нам, пожалуйста, в WhatsApp или Telegram.",
      },
      { status: 503 }
    );
  }

  if (!delivered.length) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Не удалось отправить заявку. Напишите нам, пожалуйста, в WhatsApp или Telegram.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
