import { useState } from "react";
import { ScoredProvider } from "@/utils/scoring";
import Icon from "@/components/ui/icon";

type SortKey = "score" | "price" | "latency" | "rating" | "name";

interface Props {
  data: ScoredProvider[];
}

export default function Table({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = [...data].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
    return ((a[sortKey] as number) - (b[sortKey] as number)) * dir;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortHead = ({ k, label }: { k: SortKey; label: string }) => (
    <th
      onClick={() => toggleSort(k)}
      className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground select-none"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === k && (
          <Icon
            name={sortDir === "asc" ? "ArrowUp" : "ArrowDown"}
            size={12}
          />
        )}
      </span>
    </th>
  );

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-background border-b border-border">
            <tr>
              <SortHead k="name" label="Провайдер" />
              <SortHead k="price" label="Цена" />
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                Регион
              </th>
              <SortHead k="latency" label="Latency" />
              <SortHead k="rating" label="Rating" />
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                Фичи
              </th>
              <SortHead k="score" label="Score" />
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border last:border-0 hover:bg-background transition-colors"
              >
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{p.price} ₽</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-xs rounded bg-secondary">
                    {p.region}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{p.latency}ms</td>
                <td className="px-4 py-3 font-mono text-xs">{p.rating}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.features.slice(0, 3).map((f) => (
                      <span
                        key={f}
                        className="px-1.5 py-0.5 text-[10px] rounded bg-secondary text-secondary-foreground"
                      >
                        {f}
                      </span>
                    ))}
                    {p.features.length > 3 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{p.features.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-primary font-bold">
                  {p.score}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  >
                    Deploy
                    <Icon name="ArrowUpRight" size={12} />
                  </a>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-12 text-muted-foreground text-sm"
                >
                  Ничего не найдено. Сбрось фильтры.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
