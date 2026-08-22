export type LeadPayload = {
  name: string;
  contact: string;
  message?: string;
  objectType?: string;
  consent: boolean;
  /** Ловушка для ботов — у людей всегда пустая */
  company: string;
  source: string;
};

export async function sendLead(payload: LeadPayload): Promise<void> {
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      pageUrl: typeof window === "undefined" ? undefined : window.location.href,
    }),
  });

  let data: { ok?: boolean; error?: string } = {};
  try {
    data = await res.json();
  } catch {
    /* тело может быть пустым — тогда ориентируемся на статус */
  }

  if (!res.ok || !data.ok) {
    throw new Error(
      data.error ||
        "Не удалось отправить заявку. Напишите нам, пожалуйста, в WhatsApp или Telegram."
    );
  }
}
