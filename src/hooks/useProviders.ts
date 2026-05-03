import { useMemo, useState } from "react";
import { providers as rawProviders } from "@/data/providers";
import {
  mapProvider,
  scoreProvider,
  ScoredProvider,
  UseCase,
} from "@/utils/scoring";

export interface Filters {
  maxPrice: number;
  minRam: number;
  region: string;
  features: string[];
  search: string;
  useCase: UseCase;
}

const DEFAULT_FILTERS: Filters = {
  maxPrice: 5000,
  minRam: 0,
  region: "ALL",
  features: [],
  search: "",
  useCase: "all",
};

export function useProviders() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleFeature = (f: string) =>
    setFilters((prev) => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter((x) => x !== f)
        : [...prev.features, f],
    }));

  const reset = () => setFilters(DEFAULT_FILTERS);

  const all: ScoredProvider[] = useMemo(
    () =>
      rawProviders.map((p) => {
        const mapped = mapProvider(p);
        return { ...mapped, score: scoreProvider(mapped, filters.useCase) };
      }),
    [filters.useCase],
  );

  const filtered = useMemo(() => {
    return all
      .filter((p) => p.price <= filters.maxPrice)
      .filter((p) => p.ram >= filters.minRam)
      .filter((p) => filters.region === "ALL" || p.region === filters.region)
      .filter((p) =>
        filters.features.length === 0
          ? true
          : filters.features.every((f) => p.features.includes(f)),
      )
      .filter((p) =>
        filters.search.trim() === ""
          ? true
          : p.name.toLowerCase().includes(filters.search.toLowerCase()),
      )
      .sort((a, b) => b.score - a.score);
  }, [all, filters]);

  return { filters, setFilter, toggleFeature, reset, all, filtered };
}
