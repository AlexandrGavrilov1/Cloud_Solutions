import { ScoredProvider } from "@/utils/scoring";
import Icon from "@/components/ui/icon";

interface Props {
  provider: ScoredProvider;
}

export default function ProviderCard({ provider: p }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 hover:border-primary transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-medium text-base">{p.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {p.region} · {p.latency}ms
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-lg text-primary font-bold">
            {p.score}
          </div>
          <div className="text-[10px] uppercase text-muted-foreground tracking-wider">
            score
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 my-4 text-xs">
        <div>
          <div className="text-muted-foreground">Цена</div>
          <div className="font-mono">{p.price} ₽</div>
        </div>
        <div>
          <div className="text-muted-foreground">Rating</div>
          <div className="font-mono">{p.rating}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Uptime</div>
          <div className="font-mono">{p.uptime}%</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4 min-h-[24px]">
        {p.features.slice(0, 5).map((f) => (
          <span
            key={f}
            className="px-1.5 py-0.5 text-[10px] rounded bg-secondary text-secondary-foreground"
          >
            {f}
          </span>
        ))}
      </div>

      <a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1 w-full py-2 text-xs rounded border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
      >
        Deploy
        <Icon name="ArrowUpRight" size={12} />
      </a>
    </div>
  );
}
