import { ScoredProvider } from "@/utils/scoring";
import Icon from "@/components/ui/icon";

interface Props {
  provider: ScoredProvider;
}

export default function ProviderCard({ provider: p }: Props) {
  return (
    <div className="group relative rounded-xl border border-border bg-card p-5 hover:border-foreground/20 transition-all duration-200 hover-lift">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-semibold text-base text-foreground tracking-tight">
            {p.name}
          </div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            <span>{p.region}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{p.latency}ms</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-foreground tabular-nums">
            {p.score}
          </div>
          <div className="text-[10px] uppercase text-muted-foreground tracking-wider">
            score
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 my-4">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Цена
          </div>
          <div className="text-sm font-medium text-foreground tabular-nums mt-0.5">
            {p.price} ₽
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Rating
          </div>
          <div className="text-sm font-medium text-foreground tabular-nums mt-0.5">
            {p.rating}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Uptime
          </div>
          <div className="text-sm font-medium text-foreground tabular-nums mt-0.5">
            {p.uptime}%
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4 min-h-[24px]">
        {p.features.slice(0, 5).map((f) => (
          <span
            key={f}
            className="px-2 py-0.5 text-[11px] rounded-full bg-secondary text-secondary-foreground border border-border"
          >
            {f}
          </span>
        ))}
      </div>

      <a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-medium rounded-md border border-border text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all"
      >
        Перейти
        <Icon name="ArrowUpRight" size={12} />
      </a>
    </div>
  );
}
