import { ScoredProvider } from "@/utils/scoring";
import Icon from "@/components/ui/icon";
import { useState } from "react";
import { Link } from "react-router-dom";
import { trackProviderClick } from "@/utils/metrika";

interface Props {
  provider: ScoredProvider;
}

const FACTOR_LABELS: Record<keyof ScoredProvider["breakdown"], string> = {
  price: "Цена",
  performance: "Performance",
  latency: "Latency",
  simplicity: "Простота",
  reliability: "Надёжность",
  ecosystem: "Экосистема",
};

const SEVERITY_STYLES: Record<string, string> = {
  low: "bg-secondary text-muted-foreground border-border",
  medium:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  high: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export default function ProviderCard({ provider: p }: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const confidencePct = Math.round(p.confidence * 100);
  const riskPct = Math.round((1 - p.riskAdjustment) * 100);

  return (
    <div className="group relative rounded-xl border border-border bg-card p-5 hover:border-foreground/20 transition-all duration-200 hover-lift">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="font-semibold text-base text-foreground tracking-tight">
              {p.name}
            </div>
            {p.brandBias > 0.02 && (
              <span
                title="Известный бренд"
                className="text-[10px] px-1.5 py-0 rounded-full bg-foreground/5 border border-border text-muted-foreground"
              >
                ★
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            <span>{p.region}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{p.latency}ms</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span title="Уверенность в данных">
              conf {confidencePct}%
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-foreground tabular-nums">
            {p.score}
          </div>
          <Link
            to="/methodology"
            title="Как считается score?"
            className="text-[10px] uppercase text-muted-foreground tracking-wider hover:text-foreground transition-colors flex items-center gap-1 justify-end"
          >
            score
            <Icon name="HelpCircle" size={9} />
          </Link>
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="space-y-1.5 mb-4">
        {(Object.keys(p.breakdown) as Array<keyof typeof p.breakdown>).map(
          (k) => {
            const v = p.breakdown[k];
            return (
              <div key={k} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-20 truncate">
                  {FACTOR_LABELS[k]}
                </span>
                <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-foreground/70 transition-all duration-500"
                    style={{ width: `${Math.round(v * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground tabular-nums w-7 text-right">
                  {Math.round(v * 100)}
                </span>
              </div>
            );
          },
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 my-3 py-3 border-y border-border">
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

      {/* Risks */}
      {p.risks.length > 0 && (
        <div className="mb-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="AlertTriangle" size={11} />
            {p.risks.length} риск{p.risks.length === 1 ? "" : "ов"}
            <span className="ml-auto tabular-nums">−{riskPct}%</span>
            <Icon
              name={showDetails ? "ChevronUp" : "ChevronDown"}
              size={11}
            />
          </button>
          {showDetails && (
            <div className="mt-2 flex flex-col gap-1">
              {p.risks.map((r, i) => (
                <div
                  key={i}
                  className={`text-[10px] px-2 py-1 rounded-md border ${
                    SEVERITY_STYLES[r.severity]
                  }`}
                >
                  {r.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Features */}
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
        onClick={() => trackProviderClick()}
        className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-medium rounded-md border border-border text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all"
      >
        Перейти
        <Icon name="ArrowUpRight" size={12} />
      </a>
    </div>
  );
}