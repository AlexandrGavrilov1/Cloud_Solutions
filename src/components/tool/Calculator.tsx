import { useMemo, useState } from "react";
import { ScoredProvider } from "@/utils/scoring";
import Icon from "@/components/ui/icon";

interface Props {
  providers: ScoredProvider[];
}

export default function Calculator({ providers }: Props) {
  const [users, setUsers] = useState(1000);
  const [months, setMonths] = useState(12);

  const result = useMemo(() => {
    return providers
      .map((p) => ({
        ...p,
        cost: (p.price + users * 0.05) * months,
      }))
      .sort((a, b) => a.cost - b.cost)
      .slice(0, 3);
  }, [providers, users, months]);

  return (
    <div className="bg-card p-5 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="Calculator" size={16} className="text-primary" />
          <h3 className="text-sm font-medium uppercase tracking-wider">
            Калькулятор стоимости
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">Топ-3 по цене</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Пользователей</span>
            <span className="font-mono">{users.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="100"
            max="100000"
            step="100"
            value={users}
            onChange={(e) => setUsers(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Период (мес.)</span>
            <span className="font-mono">{months}</span>
          </div>
          <input
            type="range"
            min="1"
            max="36"
            step="1"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {result.map((r, i) => (
          <div
            key={r.id}
            className={`p-4 rounded border transition-colors ${
              i === 0
                ? "border-primary bg-primary/5"
                : "border-border bg-background"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                #{i + 1}
                {i === 0 && " ★"}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary">
                {r.region}
              </span>
            </div>
            <div className="font-medium mb-1">{r.name}</div>
            <div className="font-mono text-lg text-primary">
              {r.cost.toFixed(0)} ₽
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">
              за {months} мес.
            </div>
          </div>
        ))}
        {result.length === 0 && (
          <div className="col-span-3 text-center py-6 text-muted-foreground text-sm">
            Нет провайдеров под фильтры
          </div>
        )}
      </div>
    </div>
  );
}
