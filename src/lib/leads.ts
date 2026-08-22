import nodemailer from "nodemailer";

export type Lead = {
  name: string;
  contact: string;
  message?: string;
  objectType?: string;
  /** Какая форма отправила заявку — чтобы понимать, что на сайте работает */
  source: string;
  /** Страница, с которой ушла заявка */
  pageUrl?: string;
};

export type DeliveryResult = {
  channel: "telegram" | "bitrix24" | "email";
  ok: boolean;
  error?: string;
  /** Канал не настроен переменными окружения — это не ошибка */
  skipped?: boolean;
};

const TIMEOUT_MS = 8000;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function fetchWithTimeout(url: string, init: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function plainLines(lead: Lead) {
  const lines = [
    `Имя: ${lead.name}`,
    `Контакт: ${lead.contact}`,
    lead.objectType ? `Тип объекта: ${lead.objectType}` : null,
    lead.message ? `Сообщение: ${lead.message}` : null,
    `Форма: ${lead.source}`,
    lead.pageUrl ? `Страница: ${lead.pageUrl}` : null,
  ];
  return lines.filter(Boolean) as string[];
}

/* ------------------------------------------------------------------ */
/* Telegram                                                            */
/* ------------------------------------------------------------------ */

async function sendTelegram(lead: Lead): Promise<DeliveryResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { channel: "telegram", ok: false, skipped: true };
  }

  const text = [
    "<b>Заявка с сайта ATRIUM</b>",
    "",
    ...plainLines(lead).map(escapeHtml),
  ].join("\n");

  try {
    const res = await fetchWithTimeout(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );
    if (!res.ok) {
      const body = await res.text();
      return {
        channel: "telegram",
        ok: false,
        error: `HTTP ${res.status}: ${body.slice(0, 200)}`,
      };
    }
    return { channel: "telegram", ok: true };
  } catch (e) {
    return { channel: "telegram", ok: false, error: String(e) };
  }
}

/* ------------------------------------------------------------------ */
/* Bitrix24                                                            */
/* ------------------------------------------------------------------ */

/** Похоже ли значение на телефон, а не на почту или ник мессенджера */
function looksLikePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && !value.includes("@");
}

async function sendBitrix(lead: Lead): Promise<DeliveryResult> {
  const webhook = process.env.BITRIX_WEBHOOK_URL;
  if (!webhook) {
    return { channel: "bitrix24", ok: false, skipped: true };
  }

  const base = webhook.replace(/\/+$/, "");
  const fields: Record<string, unknown> = {
    TITLE: `Сайт isatrium.ru — ${lead.objectType || "заявка"} — ${lead.name}`,
    NAME: lead.name,
    SOURCE_ID: "WEB",
    SOURCE_DESCRIPTION: `Форма «${lead.source}»${lead.pageUrl ? `, ${lead.pageUrl}` : ""}`,
    COMMENTS: plainLines(lead).join("\n"),
  };

  if (looksLikePhone(lead.contact)) {
    fields.PHONE = [{ VALUE: lead.contact, VALUE_TYPE: "WORK" }];
  } else if (lead.contact.includes("@")) {
    fields.EMAIL = [{ VALUE: lead.contact, VALUE_TYPE: "WORK" }];
  } else {
    fields.IM = [{ VALUE: lead.contact, VALUE_TYPE: "OTHER" }];
  }

  try {
    const res = await fetchWithTimeout(`${base}/crm.lead.add.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields, params: { REGISTER_SONET_EVENT: "Y" } }),
    });
    const body = await res.text();
    if (!res.ok || body.includes('"error"')) {
      return {
        channel: "bitrix24",
        ok: false,
        error: `HTTP ${res.status}: ${body.slice(0, 200)}`,
      };
    }
    return { channel: "bitrix24", ok: true };
  } catch (e) {
    return { channel: "bitrix24", ok: false, error: String(e) };
  }
}

/* ------------------------------------------------------------------ */
/* Почта — Resend или обычный SMTP, что настроено                      */
/* ------------------------------------------------------------------ */

function emailSubject(lead: Lead) {
  return `Заявка с сайта: ${lead.objectType || lead.source} — ${lead.name}`;
}

function emailText(lead: Lead) {
  return plainLines(lead).join("\n");
}

async function sendViaResend(lead: Lead, to: string): Promise<DeliveryResult> {
  const key = process.env.RESEND_API_KEY as string;
  const from = process.env.LEAD_EMAIL_FROM || "onboarding@resend.dev";
  try {
    const res = await fetchWithTimeout("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        subject: emailSubject(lead),
        text: emailText(lead),
        reply_to: lead.contact.includes("@") ? lead.contact : undefined,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      return {
        channel: "email",
        ok: false,
        error: `Resend HTTP ${res.status}: ${body.slice(0, 200)}`,
      };
    }
    return { channel: "email", ok: true };
  } catch (e) {
    return { channel: "email", ok: false, error: String(e) };
  }
}

async function sendViaSmtp(lead: Lead, to: string): Promise<DeliveryResult> {
  const host = process.env.SMTP_HOST as string;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.LEAD_EMAIL_FROM || user || to;

  try {
    const transport = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
      connectionTimeout: TIMEOUT_MS,
      greetingTimeout: TIMEOUT_MS,
      socketTimeout: TIMEOUT_MS,
    });
    await transport.sendMail({
      from,
      to,
      subject: emailSubject(lead),
      text: emailText(lead),
      replyTo: lead.contact.includes("@") ? lead.contact : undefined,
    });
    return { channel: "email", ok: true };
  } catch (e) {
    return { channel: "email", ok: false, error: String(e) };
  }
}

async function sendEmail(lead: Lead): Promise<DeliveryResult> {
  const to = process.env.LEAD_EMAIL_TO;
  if (!to) return { channel: "email", ok: false, skipped: true };
  if (process.env.RESEND_API_KEY) return sendViaResend(lead, to);
  if (process.env.SMTP_HOST) return sendViaSmtp(lead, to);
  return { channel: "email", ok: false, skipped: true };
}

/* ------------------------------------------------------------------ */

/**
 * Отправляет заявку во все настроенные каналы параллельно.
 * Ненастроенные каналы пропускаются молча, упавшие — не мешают остальным.
 */
export async function deliverLead(lead: Lead): Promise<DeliveryResult[]> {
  return Promise.all([sendTelegram(lead), sendBitrix(lead), sendEmail(lead)]);
}
