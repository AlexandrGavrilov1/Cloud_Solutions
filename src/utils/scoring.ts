import { Provider } from "@/components/providers/types";

export type UseCase = "all" | "saas" | "pet" | "highload";

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
  score: number;
  trialDays: number;
  uptime: number;
}

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

  return {
    id: p.id,
    name: p.name,
    logo: p.logo,
    price: p.basePrice || 0,
    ram: 4,
    cpu: 2,
    region,
    latency: baseLatency + ((p.id * 7) % 12),
    features: feats,
    rating: p.rating,
    url: p.url,
    trialDays: p.trialDays || 0,
    uptime: p.uptime30days || 99.9,
  };
}

export function scoreProvider(
  p: Omit<ScoredProvider, "score">,
  useCase: UseCase = "all",
): number {
  let score = 0;

  const weights = {
    all: { price: 50, ram: 2, latency: 0.5, k8s: 5, docker: 3, rating: 3 },
    saas: { price: 30, ram: 3, latency: 0.8, k8s: 8, docker: 4, rating: 4 },
    pet: { price: 80, ram: 1, latency: 0.2, k8s: 1, docker: 2, rating: 2 },
    highload: { price: 20, ram: 4, latency: 1.2, k8s: 10, docker: 5, rating: 5 },
  }[useCase];

  if (p.price > 0) score += (1 / p.price) * weights.price * 10;
  score += p.ram * weights.ram;
  score += (100 - p.latency) * weights.latency;
  if (p.features.includes("k8s")) score += weights.k8s;
  if (p.features.includes("docker")) score += weights.docker;
  score += p.rating * weights.rating;

  return Number(score.toFixed(2));
}
