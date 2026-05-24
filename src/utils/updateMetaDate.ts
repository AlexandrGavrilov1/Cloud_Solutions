import { PROVIDERS_TOTAL, PROVIDERS_LABEL } from "./providersCount";

const MONTHS_RU = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];

const META_SSR_URL =
  "https://functions.poehali.dev/fe7bf645-6db4-481c-a6a3-b2a7104c3d01";

interface MetaPayload {
  title: string;
  description: string;
  og_image_alt: string;
  twitter_title: string;
  schema_description: string;
  date_phrase: string;
  year: number;
  providers_label?: string;
}

function localFallback(): MetaPayload {
  const now = new Date();
  const month = MONTHS_RU[now.getMonth()];
  const year = now.getFullYear();
  const date_phrase = `${month} ${year}`;
  const plabel = PROVIDERS_LABEL;

  return {
    title: `Рейтинг хостингов ${year} — Сравнение ${plabel} провайдеров | Реальные отзывы и цены`,
    description: `Независимый рейтинг VPS хостинга с актуальными ценами на ${date_phrase}. Сравните ${plabel} провайдеров: Hetzner, Timeweb, REG.RU, DigitalOcean. Калькулятор стоимости, отзывы клиентов, 152-ФЗ, uptime статистика.`,
    og_image_alt: `Рейтинг VPS хостинга ${year} — Сравнение провайдеров`,
    twitter_title: `Рейтинг VPS хостинга ${year} — Сравнение ${plabel} провайдеров`,
    schema_description: `Независимый рейтинг VPS хостинга с актуальными ценами на ${date_phrase}. Сравните ${plabel} провайдеров`,
    date_phrase,
    year,
    providers_label: plabel,
  };
}

function applyMeta(meta: MetaPayload) {
  const titleEl = document.querySelector("title");
  if (titleEl) titleEl.textContent = meta.title;

  const descMetas = document.querySelectorAll<HTMLMetaElement>(
    'meta[name="description"], meta[property="og:description"]',
  );
  descMetas.forEach((m) => m.setAttribute("content", meta.description));

  const ogTitle = document.querySelector<HTMLMetaElement>(
    'meta[property="og:title"]',
  );
  if (ogTitle) ogTitle.setAttribute("content", meta.title);

  const ogImageAlt = document.querySelector<HTMLMetaElement>(
    'meta[property="og:image:alt"]',
  );
  if (ogImageAlt) ogImageAlt.setAttribute("content", meta.og_image_alt);

  const twTitle = document.querySelector<HTMLMetaElement>(
    'meta[name="twitter:title"]',
  );
  if (twTitle) twTitle.setAttribute("content", meta.twitter_title);

  const ldScripts = document.querySelectorAll<HTMLScriptElement>(
    'script[type="application/ld+json"]',
  );
  ldScripts.forEach((s) => {
    try {
      const data = JSON.parse(s.textContent || "{}");
      if (data["@type"] === "WebSite" && data.description) {
        data.description = meta.schema_description;
        s.textContent = JSON.stringify(data);
      }
    } catch {
      // ignore
    }
  });
}

/**
 * Подтягивает актуальные мета-теги из SSR cloud-функции.
 * Сначала применяет локальный fallback (мгновенно), затем — серверный ответ.
 */
export async function updateMetaDate() {
  applyMeta(localFallback());

  try {
    const url = `${META_SSR_URL}?providers=${PROVIDERS_TOTAL}`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) return;
    const data: MetaPayload = await res.json();
    applyMeta(data);
  } catch {
    // network offline — остаётся локальный fallback
  }
}