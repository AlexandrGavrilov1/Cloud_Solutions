export async function fetchLatency(region: string): Promise<number> {
  return new Promise((res) => {
    const base = region === "RU" ? 8 : region === "EU" ? 25 : 80;
    setTimeout(() => res(base + Math.floor(Math.random() * 15)), 200);
  });
}

export async function fetchLatencies(
  regions: string[],
): Promise<Record<string, number>> {
  const entries = await Promise.all(
    regions.map(async (r) => [r, await fetchLatency(r)] as const),
  );
  return Object.fromEntries(entries);
}
