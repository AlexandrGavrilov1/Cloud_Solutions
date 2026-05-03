import { useState } from "react";
import { parseUserIntent, Intent } from "@/utils/ai/aiParser";
import {
  buildArchitecture,
  totalResources,
  ArchComponent,
} from "@/utils/ai/architecture";
import { calculateInfra, InfraRequirements } from "@/utils/ai/infraCalc";
import { matchProviders, MatchedProvider } from "@/utils/ai/providerMatch";

export interface AIResult {
  intent: Intent;
  infra: InfraRequirements;
  architecture: ArchComponent[];
  totals: ReturnType<typeof totalResources>;
  providers: MatchedProvider[];
}

export function runAI(input: string): AIResult {
  const intent = parseUserIntent(input);
  const infra = calculateInfra(intent);
  const architecture = buildArchitecture(intent);
  const totals = totalResources(architecture);
  const providers = matchProviders(intent, infra);
  return { intent, infra, architecture, totals, providers };
}

export function useAI() {
  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async (input: string) => {
    if (!input.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setResult(runAI(input));
    setLoading(false);
  };

  const reset = () => setResult(null);

  return { result, loading, generate, reset };
}
