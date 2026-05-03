export type WorkloadType =
  | "saas"
  | "ai"
  | "bot"
  | "ecommerce"
  | "gaming"
  | "highload"
  | "media"
  | "corporate"
  | "static"
  | "default";

export interface Intent {
  type: WorkloadType;
  users: number;
  workload: "low" | "medium" | "high";
  realtime: boolean;
  needsGpu: boolean;
  needsDb: boolean;
  region: "RU" | "EU" | "US" | "ALL";
  budget: number | null;
  confidence: number;
  matched: string[];
  summary: string;
  raw: string;
}

const TYPE_KEYWORDS: Record<Exclude<WorkloadType, "default">, string[]> = {
  saas: [
    "saas",
    "подписк",
    "subscription",
    "crm",
    "erp",
    "сервис подписки",
    "b2b",
    "личный кабинет",
    "панель управления",
  ],
  ai: [
    "ai",
    "ml",
    "нейрон",
    "llm",
    "gpt",
    "train",
    "inference",
    "stable diffusion",
    "обучение модели",
    "нейросет",
    "machine learning",
    "ии",
    "искусственн",
  ],
  bot: [
    "bot",
    "бот",
    "telegram",
    "discord",
    "whatsapp",
    "vk бот",
    "чат-бот",
    "чатбот",
  ],
  ecommerce: [
    "shop",
    "магазин",
    "ecommerce",
    "интернет-магазин",
    "wordpress",
    "woocommerce",
    "битрикс",
    "продаж",
    "товары",
    "корзина",
    "заказ",
    "checkout",
    "marketplace",
    "маркетплейс",
  ],
  gaming: [
    "game",
    "игр",
    "minecraft",
    "csgo",
    "cs2",
    "dayz",
    "rust",
    "сервер игр",
    "game server",
    "matchmaking",
  ],
  highload: [
    "highload",
    "высоконагруж",
    "миллион",
    "million",
    "большая нагрузка",
    "rps",
    "тысяч запросов",
    "распределен",
    "кластер",
    "k8s",
    "kubernetes",
  ],
  media: [
    "video",
    "видео",
    "stream",
    "стрим",
    "youtube",
    "twitch",
    "видеоуроки",
    "курсы",
    "education",
    "обучающ",
    "podcast",
    "подкаст",
  ],
  corporate: [
    "корпоратив",
    "офис",
    "1c",
    "1с",
    "битрикс24",
    "документооборот",
    "сэд",
    "intranet",
    "интранет",
    "cas",
  ],
  static: [
    "landing",
    "лендинг",
    "static",
    "статичн",
    "блог",
    "portfolio",
    "портфолио",
    "одностраничник",
    "сайт-визитка",
  ],
};

const REGION_KEYWORDS: Record<Exclude<Intent["region"], "ALL">, string[]> = {
  RU: ["ru", "росси", "москв", "питер", "спб", "казахстан", "снг"],
  EU: [
    "eu",
    "европ",
    "германи",
    "нидерланд",
    "финлянд",
    "польш",
    "франц",
    "лондон",
  ],
  US: ["us", "америк", "сша", "штаты", "нью-йорк", "сан-франциско"],
};

const GPU_KEYWORDS = [
  "gpu",
  "видеокарт",
  "нейрон",
  "ml",
  "llm",
  "train",
  "inference",
  "stable diffusion",
  "rtx",
  "a100",
  "h100",
  "cuda",
  "обучение модели",
];

const REALTIME_KEYWORDS = [
  "realtime",
  "real-time",
  "чат",
  "stream",
  "стрим",
  "websocket",
  "live",
  "трансляц",
  "видеосвяз",
  "звонк",
  "voice",
];

function countMatches(input: string, keywords: string[]): number {
  return keywords.reduce((acc, kw) => (input.includes(kw) ? acc + 1 : acc), 0);
}

function findFirstMatch(input: string, keywords: string[]): string | null {
  return keywords.find((kw) => input.includes(kw)) || null;
}

function extractUsers(input: string): { value: number; raw: string } | null {
  const re = /(\d+(?:[.,]\d+)?)\s*(k|к|тыс\.?|m|млн|million|thousand)?/gi;
  const userContextRe =
    /(юзер|польз|user|клиент|подписч|посетит|пользоват|игрок|студент|client|visitor)/i;

  const candidates: { value: number; pos: number; raw: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    let n = parseFloat(m[1].replace(",", "."));
    const suf = (m[2] || "").toLowerCase();
    if (["k", "к", "тыс", "тыс.", "thousand"].includes(suf)) n *= 1000;
    if (["m", "млн", "million"].includes(suf)) n *= 1_000_000;
    candidates.push({ value: Math.round(n), pos: m.index, raw: m[0] });
  }

  if (candidates.length === 0) return null;

  const ctx = userContextRe.exec(input);
  if (ctx) {
    const ctxPos = ctx.index;
    const closest = [...candidates].sort(
      (a, b) => Math.abs(a.pos - ctxPos) - Math.abs(b.pos - ctxPos),
    )[0];
    return { value: closest.value, raw: closest.raw };
  }

  const sorted = [...candidates].sort((a, b) => b.value - a.value);
  return { value: sorted[0].value, raw: sorted[0].raw };
}

function extractBudget(input: string): number | null {
  const re = /(\d+(?:[.,]\d+)?)\s*(k|к|тыс\.?|млн|m)?\s*(₽|руб|rub|р\.|usd|\$)/i;
  const m = input.match(re);
  if (!m) return null;
  let n = parseFloat(m[1].replace(",", "."));
  const suf = (m[2] || "").toLowerCase();
  if (["k", "к", "тыс", "тыс."].includes(suf)) n *= 1000;
  if (["m", "млн"].includes(suf)) n *= 1_000_000;
  if (/usd|\$/.test(m[3])) n *= 90;
  return Math.round(n);
}

function detectType(input: string): {
  type: WorkloadType;
  matched: string[];
  confidence: number;
} {
  const scores: { type: WorkloadType; score: number; words: string[] }[] = [];

  for (const [type, keywords] of Object.entries(TYPE_KEYWORDS)) {
    const matched = keywords.filter((kw) => input.includes(kw));
    if (matched.length > 0) {
      scores.push({
        type: type as WorkloadType,
        score: matched.length,
        words: matched,
      });
    }
  }

  if (scores.length === 0) {
    return { type: "default", matched: [], confidence: 0.3 };
  }

  scores.sort((a, b) => b.score - a.score);
  const winner = scores[0];
  const total = scores.reduce((s, x) => s + x.score, 0);
  const confidence = Math.min(0.95, 0.5 + winner.score / total / 2);

  return {
    type: winner.type,
    matched: winner.words,
    confidence,
  };
}

const TYPE_LABEL_RU: Record<WorkloadType, string> = {
  saas: "SaaS-сервис",
  ai: "AI/ML проект",
  bot: "бот",
  ecommerce: "интернет-магазин",
  gaming: "игровой сервер",
  highload: "highload-приложение",
  media: "медиа/видео платформа",
  corporate: "корпоративная система",
  static: "статичный сайт",
  default: "веб-приложение",
};

function generateSummary(
  type: WorkloadType,
  users: number,
  region: Intent["region"],
  needsGpu: boolean,
  realtime: boolean,
): string {
  const parts: string[] = [];
  parts.push(`Это ${TYPE_LABEL_RU[type]} на ~${users.toLocaleString("ru")} пользователей`);
  if (region !== "ALL") parts.push(`в регионе ${region}`);
  if (needsGpu) parts.push("с GPU для вычислений");
  if (realtime) parts.push("с realtime-нагрузкой");
  return parts.join(", ") + ".";
}

const DEFAULT_USERS: Record<WorkloadType, number> = {
  saas: 10000,
  ai: 2000,
  bot: 5000,
  ecommerce: 8000,
  gaming: 1000,
  highload: 100000,
  media: 20000,
  corporate: 500,
  static: 500,
  default: 1000,
};

export function parseUserIntent(rawInput: string): Intent {
  const input = rawInput.toLowerCase().trim();

  const { type, matched, confidence } = detectType(input);

  const usersData = extractUsers(input);
  const users = usersData?.value ?? DEFAULT_USERS[type];

  const budget = extractBudget(input);

  const gpuMatch = findFirstMatch(input, GPU_KEYWORDS);
  const needsGpu = !!gpuMatch || type === "ai";

  const needsDb = type !== "static";

  const realtimeMatch = findFirstMatch(input, REALTIME_KEYWORDS);
  const realtime =
    !!realtimeMatch || type === "gaming" || type === "media" || type === "bot";

  let region: Intent["region"] = "ALL";
  for (const [r, kws] of Object.entries(REGION_KEYWORDS)) {
    if (countMatches(input, kws) > 0) {
      region = r as Intent["region"];
      break;
    }
  }

  let workload: Intent["workload"] = "medium";
  if (users < 1000 || type === "static" || type === "corporate")
    workload = "low";
  else if (users > 30000 || type === "highload" || needsGpu) workload = "high";

  const summary = generateSummary(type, users, region, needsGpu, realtime);

  const allMatched = [...matched];
  if (gpuMatch) allMatched.push(gpuMatch);
  if (realtimeMatch) allMatched.push(realtimeMatch);
  if (usersData) allMatched.push(`число: ${usersData.raw}`);

  return {
    type,
    users,
    workload,
    realtime,
    needsGpu,
    needsDb,
    region,
    budget,
    confidence,
    matched: allMatched,
    summary,
    raw: rawInput,
  };
}
