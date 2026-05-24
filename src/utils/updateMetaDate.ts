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

/**
 * Динамически обновляет мета-описание и Schema.org актуальной датой
 * (месяц + год). Запускается один раз при загрузке приложения.
 */
export function updateMetaDate() {
  const now = new Date();
  const month = MONTHS_RU[now.getMonth()];
  const year = now.getFullYear();
  const datePhrase = `${month} ${year}`;

  // Регэксп ловит "<месяц> <год>" — например "май 2026", "ноябрь 2025"
  const dateRegex = new RegExp(
    `(${MONTHS_RU.join("|")})\\s+\\d{4}`,
    "gi",
  );

  // 1) <meta name="description">
  const descMetas = document.querySelectorAll<HTMLMetaElement>(
    'meta[name="description"], meta[property="og:description"]',
  );
  descMetas.forEach((m) => {
    const current = m.getAttribute("content") || "";
    if (dateRegex.test(current)) {
      m.setAttribute("content", current.replace(dateRegex, datePhrase));
    }
  });

  // 2) Schema.org JSON-LD блоки
  const ldScripts = document.querySelectorAll<HTMLScriptElement>(
    'script[type="application/ld+json"]',
  );
  ldScripts.forEach((s) => {
    try {
      const text = s.textContent || "";
      if (!dateRegex.test(text)) return;
      s.textContent = text.replace(dateRegex, datePhrase);
    } catch {
      // тихо игнорим — мета-данные не критичны для UI
    }
  });

  // 3) Год в <title> (если стоит явный год) и в og:title
  const yearRegex = /\b20\d{2}\b/g;
  const titleEl = document.querySelector("title");
  if (titleEl && yearRegex.test(titleEl.textContent || "")) {
    titleEl.textContent = (titleEl.textContent || "").replace(
      yearRegex,
      String(year),
    );
  }
  const ogTitle = document.querySelector<HTMLMetaElement>(
    'meta[property="og:title"]',
  );
  if (ogTitle) {
    const v = ogTitle.getAttribute("content") || "";
    if (yearRegex.test(v)) {
      ogTitle.setAttribute("content", v.replace(yearRegex, String(year)));
    }
  }
  const twTitle = document.querySelector<HTMLMetaElement>(
    'meta[name="twitter:title"]',
  );
  if (twTitle) {
    const v = twTitle.getAttribute("content") || "";
    if (yearRegex.test(v)) {
      twTitle.setAttribute("content", v.replace(yearRegex, String(year)));
    }
  }
}
