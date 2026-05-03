import { Filters as F } from "@/hooks/useProviders";
import Icon from "@/components/ui/icon";

interface Props {
  filters: F;
  setFilter: <K extends keyof F>(key: K, value: F[K]) => void;
  toggleFeature: (f: string) => void;
  reset: () => void;
  count: number;
}

const FEATURES = ["docker", "k8s", "api", "ipv6", "backups", "ddos", "ai", "fz152"];
const REGIONS = ["ALL", "RU", "EU", "US", "OTHER"];
const USE_CASES: { id: F["useCase"]; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "saas", label: "SaaS" },
  { id: "pet", label: "Pet" },
  { id: "highload", label: "Highload" },
];

export default function Filters({
  filters,
  setFilter,
  toggleFeature,
  reset,
  count,
}: Props) {
  return (
    <div className="flex flex-col gap-6 p-5 bg-card border border-border rounded-lg sticky top-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium tracking-wider uppercase">
          Фильтры
        </h3>
        <button
          onClick={reset}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Сбросить
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-muted-foreground">Поиск</label>
        <div className="relative">
          <Icon
            name="Search"
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            placeholder="Название провайдера"
            className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Макс. цена</span>
          <span className="font-mono">{filters.maxPrice} ₽</span>
        </div>
        <input
          type="range"
          min="100"
          max="5000"
          step="100"
          value={filters.maxPrice}
          onChange={(e) => setFilter("maxPrice", Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-muted-foreground">Регион</label>
        <div className="grid grid-cols-5 gap-1">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setFilter("region", r)}
              className={`px-2 py-1.5 text-xs rounded border transition-colors ${
                filters.region === r
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:border-primary"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-muted-foreground">Use-case</label>
        <div className="grid grid-cols-2 gap-1">
          {USE_CASES.map((u) => (
            <button
              key={u.id}
              onClick={() => setFilter("useCase", u.id)}
              className={`px-2 py-1.5 text-xs rounded border transition-colors ${
                filters.useCase === u.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:border-primary"
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-muted-foreground">Фичи</label>
        <div className="flex flex-wrap gap-1.5">
          {FEATURES.map((f) => (
            <button
              key={f}
              onClick={() => toggleFeature(f)}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                filters.features.includes(f)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:border-primary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-border text-xs text-muted-foreground">
        Найдено: <span className="text-foreground font-mono">{count}</span>
      </div>
    </div>
  );
}
