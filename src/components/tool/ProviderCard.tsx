import { ScoredProvider } from "@/utils/scoring";
import Icon from "@/components/ui/icon";

interface Props {
  provider: ScoredProvider;
}

export default function ProviderCard({ provider: p }: Props) {
  return (
    <div className="glass-effect p-5 hover:border-primary transition-all group hover-lift relative overflow-hidden">
      {/* glow corner */}
      <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-primary/20 blur-2xl group-hover:bg-primary/40 transition-all" />

      {/* terminal header strip */}
      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-3 border-b border-primary/20 pb-2">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          provider.exe
        </span>
        <span>0x{p.id?.toString(16).padStart(4, "0").toUpperCase()}</span>
      </div>

      <div className="flex items-start justify-between mb-3 relative z-10">
        <div>
          <div className="font-mono font-bold text-base text-foreground uppercase tracking-wider">
            {p.name}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 font-mono">
            <span className="text-secondary">{p.region}</span>
            <span className="mx-1.5 text-foreground/40">::</span>
            <span>{p.latency}ms</span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl text-primary text-glow font-bold">
            {p.score}
          </div>
          <div className="text-[10px] uppercase text-muted-foreground tracking-wider font-mono">
            [score]
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 my-4 text-xs font-mono">
        <div className="border border-primary/20 p-2 bg-background/40">
          <div className="text-muted-foreground text-[10px] uppercase">
            $price
          </div>
          <div className="text-secondary font-bold">{p.price}₽</div>
        </div>
        <div className="border border-primary/20 p-2 bg-background/40">
          <div className="text-muted-foreground text-[10px] uppercase">
            $rating
          </div>
          <div className="text-foreground font-bold">{p.rating}</div>
        </div>
        <div className="border border-primary/20 p-2 bg-background/40">
          <div className="text-muted-foreground text-[10px] uppercase">
            $uptime
          </div>
          <div className="text-primary font-bold">{p.uptime}%</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4 min-h-[24px]">
        {p.features.slice(0, 5).map((f) => (
          <span
            key={f}
            className="px-1.5 py-0.5 text-[10px] font-mono border border-primary/30 bg-primary/5 text-primary"
          >
            {f}
          </span>
        ))}
      </div>

      <a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1 w-full py-2.5 text-xs font-mono uppercase tracking-widest border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-neon transition-all"
      >
        <Icon name="Terminal" size={12} />
        ./deploy
        <Icon name="ArrowUpRight" size={12} />
      </a>
    </div>
  );
}
