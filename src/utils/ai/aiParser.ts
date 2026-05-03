export type WorkloadType =
  | "saas"
  | "ai"
  | "bot"
  | "ecommerce"
  | "gaming"
  | "highload"
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
  raw: string;
}

const NUM_RE = /(\d+(?:\.\d+)?)\s*(k|к|тыс|m|млн|million|thousand)?/i;

function extractUsers(input: string): number | null {
  const match = input.match(NUM_RE);
  if (!match) return null;
  let n = parseFloat(match[1]);
  const suf = (match[2] || "").toLowerCase();
  if (["k", "к", "тыс", "thousand"].includes(suf)) n *= 1000;
  if (["m", "млн", "million"].includes(suf)) n *= 1_000_000;
  return Math.round(n);
}

export function parseUserIntent(rawInput: string): Intent {
  const input = rawInput.toLowerCase();
  const users = extractUsers(input);

  let type: WorkloadType = "default";
  if (/saas|подписк|subscription/.test(input)) type = "saas";
  else if (/ai|ml|нейрон|llm|gpt|train|inference/.test(input)) type = "ai";
  else if (/bot|бот|telegram|discord/.test(input)) type = "bot";
  else if (/shop|магазин|ecommerce|интернет-магазин|wordpress/.test(input))
    type = "ecommerce";
  else if (/game|игр|minecraft|сервер игр/.test(input)) type = "gaming";
  else if (/highload|высоконагруж|миллион/.test(input)) type = "highload";
  else if (/landing|лендинг|static|статичн|блог|portfolio/.test(input))
    type = "static";

  const needsGpu = /gpu|нейрон|ml|ai|llm|train|inference|stable diffusion/.test(
    input,
  );
  const needsDb = !/static|лендинг|landing/.test(input);
  const realtime = /realtime|чат|stream|stream|websocket|live/.test(input);

  let region: Intent["region"] = "ALL";
  if (/ru|росси|москв|россии/.test(input)) region = "RU";
  else if (/eu|европ|германи|нидерланд/.test(input)) region = "EU";
  else if (/us|америк|сша/.test(input)) region = "US";

  const defaultUsers: Record<WorkloadType, number> = {
    saas: 10000,
    ai: 2000,
    bot: 5000,
    ecommerce: 8000,
    gaming: 1000,
    highload: 100000,
    static: 500,
    default: 1000,
  };

  const finalUsers = users ?? defaultUsers[type];

  let workload: Intent["workload"] = "medium";
  if (finalUsers < 1000 || type === "static") workload = "low";
  else if (finalUsers > 30000 || type === "highload" || needsGpu)
    workload = "high";

  return {
    type,
    users: finalUsers,
    workload,
    realtime,
    needsGpu,
    needsDb,
    region,
    raw: rawInput,
  };
}
