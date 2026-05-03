import { useState } from "react";
import { parseUserIntent, Intent } from "@/utils/ai/aiParser";
import {
  buildArchitecture,
  totalResources,
  ArchComponent,
} from "@/utils/ai/architecture";
import { calculateInfra, InfraRequirements } from "@/utils/ai/infraCalc";
import { matchProviders, MatchedProvider } from "@/utils/ai/providerMatch";

const AI_PARSE_URL =
  "https://functions.poehali.dev/e65cf5fa-56d8-49fe-8ad1-afc3b3fe2899";

export interface AIResult {
  intent: Intent;
  infra: InfraRequirements;
  architecture: ArchComponent[];
  totals: ReturnType<typeof totalResources>;
  providers: MatchedProvider[];
  source: "llm" | "local";
  summary?: string;
}

async function fetchLLMIntent(
  input: string,
): Promise<(Intent & { summary?: string }) | null> {
  try {
    const res = await fetch(AI_PARSE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      type: data.type,
      users: data.users,
      workload: data.workload,
      realtime: !!data.realtime,
      needsGpu: !!data.needsGpu,
      needsDb: !!data.needsDb,
      region: data.region,
      raw: input,
      summary: data.summary,
    };
  } catch {
    return null;
  }
}

function buildResult(
  intent: Intent,
  source: "llm" | "local",
  summary?: string,
): AIResult {
  const infra = calculateInfra(intent);
  const architecture = buildArchitecture(intent);
  const totals = totalResources(architecture);
  const providers = matchProviders(intent, infra);
  return { intent, infra, architecture, totals, providers, source, summary };
}

export function runAI(input: string): AIResult {
  const intent = parseUserIntent(input);
  return buildResult(intent, "local");
}

export function useAI() {
  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (input: string) => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);

    const llmIntent = await fetchLLMIntent(input);
    if (llmIntent) {
      setResult(buildResult(llmIntent, "llm", llmIntent.summary));
    } else {
      const localIntent = parseUserIntent(input);
      setResult(buildResult(localIntent, "local"));
      setError("AI временно недоступен — использован локальный парсер");
    }

    setLoading(false);
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { result, loading, error, generate, reset };
}
