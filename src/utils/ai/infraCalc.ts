import { Intent } from "./aiParser";

export interface InfraRequirements {
  cpu: number;
  ram: number;
  storage: number;
  bandwidth: number;
  needsGpu: boolean;
}

export function calculateInfra(intent: Intent): InfraRequirements {
  const u = intent.users;
  const wMul = intent.workload === "high" ? 2 : intent.workload === "low" ? 0.5 : 1;

  const cpu = Math.max(1, Math.ceil((u / 2000) * wMul));
  const ram = Math.max(1, Math.ceil((u / 1000) * wMul));
  const storage = Math.max(20, Math.ceil(u / 50));
  const bandwidth = Math.ceil(u * 0.05);

  return {
    cpu,
    ram,
    storage,
    bandwidth,
    needsGpu: intent.needsGpu,
  };
}
