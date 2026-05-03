import { Provider } from "@/components/providers/types";

// ============================================================================
// Types
// ============================================================================

export type UseCase = "all" | "saas" | "pet" | "highload" | "mvp" | "enterprise";

export interface ScoreBreakdown {
  price: number;
  performance: number;
  latency: number;
  simplicity: number;
  reliability: number;
  ecosystem: number;
}

export interface RiskFlag {
  type: "billing" | "downtime" | "support" | "complexity" | "lock-in";
  severity: "low" | "medium" | "high";
  label: string;
}

export interface ScoredProvider {
  id: number;
  name: string;
  logo: string;
  price: number;
  ram: number;
  cpu: number;
  region: string;
  latency: number;
  features: string[];
  rating: number;
  url: string;
  /** 0..100 — итоговый балл */
  score: number;
  /** 0..1 — utility (полезность) */
  utility: number;
  /** 0..1 — насколько мы уверены в данных */
  confidence: number;
  /** 0..1 — risk multiplier (1 = нет рисков) */
  riskAdjustment: number;
  /** Разбивка по факторам (0..1) */
  breakdown: ScoreBreakdown;
  /** Найденные риски */
  risks: RiskFlag[];
  trialDays: number;
  uptime: number;
  /** Влияние бренд-байаса (-0.05..+0.05) */
  brandBias: number;
}

// ============================================================================
// Brand bias (people pick known brands even if worse)
// ============================================================================

const BRAND_BIAS: Record<string, number> = {
  aws: 0.05,
  amazon: 0.05,
  gcp: 0.04,
  google: 0.04,
  azure: 0.04,
  microsoft: 0.04,
  yandex: 0.04,
  selectel: 0.03,
  vk: 0.03,
  cloud: 0.02,
  hetzner: -0.02,
  ovh: -0.01,
};

function getBrandBias(name: string): number {
  const lower = name.toLowerCase();
  for (const [brand, bias] of Object.entries(BRAND_BIAS)) {
    if (lower.includes(brand)) return bias;
  }
  return 0;
}

// ============================================================================
// Math helpers
// ============================================================================

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
const clamp = (x: number, min = 0, max = 1) => Math.min(max, Math.max(min, x));

// ============================================================================
// Component scores (each 0..1)
// ============================================================================

/** Логарифмическая чувствительность к цене — разница 5→10₽ ощущается сильнее, чем 100→105₽ */
function priceScore(price: number, marketMedian: number): number {
  if (price <= 0) return 0.5; // "цена по запросу" — нейтрально
  const normalized = price / marketMedian;
  // log даёт diminishing returns как в восприятии цен
  return clamp(1 / Math.log2(2 + normalized));
}

/** Performance per ruble — RAM × CPU нормализованные */
function performanceScore(
  cpu: number,
  ram: number,
  price: number,
  marketMedian: number,
): number {
  if (price <= 0) return 0.5;
  // Базовый perf-индекс (Hetzner ≠ AWS, упрощённо)
  const perfIndex = cpu * 0.6 + ram * 0.4;
  const valueRatio = perfIndex / Math.max(price / marketMedian, 0.1);
  return clamp(sigmoid(valueRatio - 1) * 1.2);
}

/** Экспоненциальный штраф после ~100ms — характерно для real-time приложений */
function latencyScore(latencyMs: number): number {
  return clamp(Math.exp(-latencyMs / 100));
}

/** Простота: качество docs + UX из рейтинга + наличие API/интеграций */
function simplicityScore(
  rating: number,
  hasApi: boolean,
  hasDocker: boolean,
  hasMarketplace: boolean,
): number {
  const ux = rating / 5; // 0..1
  const setupSpeed = (hasApi ? 0.4 : 0) + (hasDocker ? 0.3 : 0) + (hasMarketplace ? 0.3 : 0);
  return clamp(0.5 * ux + 0.3 * setupSpeed + 0.2 * Math.min(rating / 4.5, 1));
}

/** SLA + реальный uptime */
function reliabilityScore(uptime30days: number, rating: number): number {
  const slaScore = clamp((uptime30days - 99) / 1); // 99% → 0, 100% → 1
  const incidentPenalty = rating < 3.5 ? 0.7 : 1;
  return clamp(0.6 * slaScore + 0.4 * (rating / 5)) * incidentPenalty;
}

/** Экосистема: k8s, ai, ddos, backups, fz152 — чем больше готовых интеграций тем лучше */
function ecosystemScore(features: string[]): number {
  const weights: Record<string, number> = {
    k8s: 0.25,
    docker: 0.15,
    api: 0.15,
    ai: 0.15,
    backups: 0.1,
    ddos: 0.1,
    ipv6: 0.05,
    fz152: 0.05,
  };
  let s = 0;
  for (const f of features) s += weights[f] || 0;
  return clamp(s);
}

// ============================================================================
// Confidence: насколько уверены в данных
// ============================================================================

function calcConfidence(
  reviewCount: number,
  hasUrl: boolean,
  hasUptimeData: boolean,
  hasFeatures: boolean,
): number {
  // log scale: 1 review → ~0, 100 reviews → ~0.66, 1000 → 1
  const reviewConfidence = clamp(Math.log10(1 + reviewCount) / 3);
  const completeness =
    (hasUrl ? 0.4 : 0) +
    (hasUptimeData ? 0.3 : 0) +
    (hasFeatures ? 0.3 : 0);
  return clamp(0.6 * reviewConfidence + 0.4 * completeness);
}

// ============================================================================
// Risk Adjustment: штраф за скрытые проблемы
// ============================================================================

function calcRisks(
  rating: number,
  uptime: number,
  region: string,
  features: string[],
  reviewCount: number,
): { adjustment: number; flags: RiskFlag[] } {
  const flags: RiskFlag[] = [];
  let penalty = 0;

  // Billing risk: низкий рейтинг + мало отзывов = подозрительно
  if (rating < 4 && reviewCount < 50) {
    flags.push({
      type: "billing",
      severity: rating < 3.5 ? "high" : "medium",
      label: "Возможны проблемы с биллингом",
    });
    penalty += rating < 3.5 ? 0.15 : 0.07;
  }

  // Downtime risk
  if (uptime < 99.9) {
    flags.push({
      type: "downtime",
      severity: uptime < 99.5 ? "high" : "medium",
      label: `Аптайм ${uptime}% ниже SLA`,
    });
    penalty += uptime < 99.5 ? 0.2 : 0.08;
  }

  // Support risk: низкий рейтинг
  if (rating < 4.2) {
    flags.push({
      type: "support",
      severity: rating < 3.5 ? "high" : "low",
      label: "Качество поддержки под вопросом",
    });
    penalty += rating < 3.5 ? 0.1 : 0.04;
  }

  // Lock-in для энтерпрайз облаков без k8s
  if (!features.includes("k8s") && !features.includes("docker")) {
    flags.push({
      type: "lock-in",
      severity: "low",
      label: "Нет контейнеризации — риск вендор-локина",
    });
    penalty += 0.03;
  }

  // Региональный риск
  if (region === "OTHER") {
    flags.push({
      type: "complexity",
      severity: "low",
      label: "Регион не из основных — выше latency",
    });
    penalty += 0.05;
  }

  return { adjustment: clamp(1 - penalty), flags };
}

// ============================================================================
// Use-case weight presets
// ============================================================================

const WEIGHT_PRESETS: Record<UseCase, ScoreBreakdown> = {
  all: {
    price: 0.2,
    performance: 0.2,
    latency: 0.15,
    simplicity: 0.15,
    reliability: 0.2,
    ecosystem: 0.1,
  },
  mvp: {
    price: 0.3,
    performance: 0.1,
    latency: 0.2,
    simplicity: 0.3,
    reliability: 0.05,
    ecosystem: 0.05,
  },
  saas: {
    price: 0.15,
    performance: 0.2,
    latency: 0.2,
    simplicity: 0.15,
    reliability: 0.2,
    ecosystem: 0.1,
  },
  pet: {
    price: 0.45,
    performance: 0.1,
    latency: 0.05,
    simplicity: 0.25,
    reliability: 0.05,
    ecosystem: 0.1,
  },
  highload: {
    price: 0.1,
    performance: 0.3,
    latency: 0.25,
    simplicity: 0.05,
    reliability: 0.2,
    ecosystem: 0.1,
  },
  enterprise: {
    price: 0.05,
    performance: 0.15,
    latency: 0.1,
    simplicity: 0.1,
    reliability: 0.35,
    ecosystem: 0.25,
  },
};

// ============================================================================
// Main mapper
// ============================================================================

const MARKET_MEDIAN_PRICE = 800;

export function mapProvider(p: Provider): Omit<ScoredProvider, "score"> {
  const region = (p.locations || []).some((l) =>
    /москва|санкт|россия|казахстан|новосибирск|екатеринбург/i.test(l),
  )
    ? "RU"
    : (p.locations || []).some((l) =>
          /амстердам|франкфурт|герман|нидерлан|польш|финлянд|лондон|париж|евро/i.test(
            l,
          ),
        )
      ? "EU"
      : (p.locations || []).some((l) => /сша|америк|нью-йорк|san|us/i.test(l))
        ? "US"
        : "OTHER";

  const feats: string[] = [];
  if (p.technicalSpecs?.apiAccess) feats.push("api");
  if (p.technicalSpecs?.kubernetes?.available) feats.push("k8s");
  if (p.technicalSpecs?.virtualization?.length) feats.push("docker");
  if (p.technicalSpecs?.ipv6) feats.push("ipv6");
  if (p.additionalServices?.autoBackups) feats.push("backups");
  if (p.technicalSpecs?.ddosProtection) feats.push("ddos");
  if (p.technicalSpecs?.supportsAI) feats.push("ai");
  if (p.fz152Compliant) feats.push("fz152");

  const baseLatency = region === "RU" ? 8 : region === "EU" ? 25 : 80;
  const cpu = 2;
  const ram = 4;
  const price = p.basePrice || 0;
  const uptime = p.uptime30days || 99.9;
  const rating = p.rating || 4;
  const reviewCount = p.reviews?.length || 0;

  // Component scores
  const breakdown: ScoreBreakdown = {
    price: priceScore(price, MARKET_MEDIAN_PRICE),
    performance: performanceScore(cpu, ram, price, MARKET_MEDIAN_PRICE),
    latency: latencyScore(baseLatency),
    simplicity: simplicityScore(
      rating,
      feats.includes("api"),
      feats.includes("docker"),
      feats.includes("k8s"),
    ),
    reliability: reliabilityScore(uptime, rating),
    ecosystem: ecosystemScore(feats),
  };

  // Confidence
  const confidence = calcConfidence(
    reviewCount,
    !!p.url,
    !!p.uptime30days,
    feats.length > 0,
  );

  // Risk
  const { adjustment: riskAdjustment, flags: risks } = calcRisks(
    rating,
    uptime,
    region,
    feats,
    reviewCount,
  );

  return {
    id: p.id,
    name: p.name,
    logo: p.logo,
    price,
    ram,
    cpu,
    region,
    latency: baseLatency + ((p.id * 7) % 12),
    features: feats,
    rating,
    url: p.url,
    trialDays: p.trialDays || 0,
    uptime,
    breakdown,
    confidence,
    riskAdjustment,
    risks,
    utility: 0, // вычисляется в scoreProvider
    brandBias: getBrandBias(p.name),
  };
}

// ============================================================================
// Final score: utility × confidence × risk + brand bias
// ============================================================================

export function scoreProvider(
  p: Omit<ScoredProvider, "score">,
  useCase: UseCase = "all",
): number {
  const w = WEIGHT_PRESETS[useCase];

  // Weighted sum → sigmoid для нелинейности (компромиссы)
  const linear =
    w.price * p.breakdown.price +
    w.performance * p.breakdown.performance +
    w.latency * p.breakdown.latency +
    w.simplicity * p.breakdown.simplicity +
    w.reliability * p.breakdown.reliability +
    w.ecosystem * p.breakdown.ecosystem;

  // Сдвигаем в [-3, +3] для адекватной сигмоиды
  const utility = sigmoid((linear - 0.5) * 6);

  // Финальная формула
  const final = utility * p.confidence * p.riskAdjustment + p.brandBias;

  // 0..100 для UI
  return Number((clamp(final) * 100).toFixed(1));
}

/** Полный скоринг с utility (для расширенного UI) */
export function fullScore(
  p: Omit<ScoredProvider, "score">,
  useCase: UseCase = "all",
): { score: number; utility: number } {
  const w = WEIGHT_PRESETS[useCase];
  const linear =
    w.price * p.breakdown.price +
    w.performance * p.breakdown.performance +
    w.latency * p.breakdown.latency +
    w.simplicity * p.breakdown.simplicity +
    w.reliability * p.breakdown.reliability +
    w.ecosystem * p.breakdown.ecosystem;

  const utility = sigmoid((linear - 0.5) * 6);
  const final = utility * p.confidence * p.riskAdjustment + p.brandBias;

  return {
    score: Number((clamp(final) * 100).toFixed(1)),
    utility: Number(utility.toFixed(3)),
  };
}
