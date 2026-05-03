import { providers as rawProviders } from "@/data/providers";
import { mapProvider } from "@/utils/scoring";
import { Intent } from "./aiParser";
import { InfraRequirements } from "./infraCalc";

export interface MatchedProvider {
  id: number;
  name: string;
  logo: string;
  price: number;
  region: string;
  rating: number;
  url: string;
  features: string[];
  instances: number;
  monthlyCost: number;
  matchScore: number;
  matchReasons: string[];
}

const REF_CPU = 2;
const REF_RAM = 4;

export function matchProviders(
  intent: Intent,
  req: InfraRequirements,
): MatchedProvider[] {
  return rawProviders
    .map((raw) => {
      const m = mapProvider(raw);
      const cpuInstances = Math.ceil(req.cpu / REF_CPU);
      const ramInstances = Math.ceil(req.ram / REF_RAM);
      const instances = Math.max(1, Math.max(cpuInstances, ramInstances));

      const monthlyCost = instances * m.price;

      let matchScore = 0;
      const reasons: string[] = [];

      if (m.price > 0) {
        matchScore += (1 / monthlyCost) * 5000;
      }

      if (intent.region === "ALL" || m.region === intent.region) {
        matchScore += 20;
        if (intent.region !== "ALL") reasons.push(`регион ${m.region}`);
      } else {
        matchScore -= 30;
      }

      if (req.needsGpu) {
        if (raw.technicalSpecs?.gpuModels?.length) {
          matchScore += 40;
          reasons.push("есть GPU");
        } else {
          matchScore -= 50;
        }
      }

      if (intent.type === "ai" && raw.technicalSpecs?.supportsAI) {
        matchScore += 25;
        reasons.push("AI-фичи");
      }

      if (intent.type === "highload") {
        if (raw.technicalSpecs?.kubernetes?.available) {
          matchScore += 15;
          reasons.push("Kubernetes");
        }
        if (raw.technicalSpecs?.diskType === "NVMe") {
          matchScore += 10;
          reasons.push("NVMe");
        }
      }

      if (intent.type === "ecommerce" && raw.fz152Compliant) {
        matchScore += 10;
        reasons.push("152-ФЗ");
      }

      if (intent.realtime && raw.technicalSpecs?.networkSpeed?.includes("10")) {
        matchScore += 10;
        reasons.push("10 Гбит/с");
      }

      matchScore += m.rating * 2;

      return {
        id: m.id,
        name: m.name,
        logo: m.logo,
        price: m.price,
        region: m.region,
        rating: m.rating,
        url: m.url,
        features: m.features,
        instances,
        monthlyCost,
        matchScore: Number(matchScore.toFixed(1)),
        matchReasons: reasons,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
