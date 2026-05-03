import { useState } from "react";
import { useAI } from "@/hooks/useAI";
import Icon from "@/components/ui/icon";

const SUGGESTIONS = [
  "SaaS на 10k пользователей",
  "Telegram бот на 5k юзеров",
  "AI inference, GPU нужен",
  "Интернет-магазин в РФ, 8000 заказов/мес",
  "Highload API на миллион запросов",
  "Лендинг + аналитика",
];

const TYPE_LABEL: Record<string, string> = {
  saas: "SaaS",
  ai: "AI / ML",
  bot: "Бот",
  ecommerce: "E-commerce",
  gaming: "Gaming",
  highload: "Highload",
  static: "Static",
  default: "Базовое",
};

export default function AIBuilder() {
  const [input, setInput] = useState("");
  const { result, loading, error, generate, reset } = useAI();

  const onGenerate = () => generate(input);

  const onSuggest = (s: string) => {
    setInput(s);
    generate(s);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-5 border-b border-border bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative">
            <Icon name="Sparkles" size={18} className="text-primary" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          </div>
          <h3 className="text-sm uppercase tracking-widest font-medium">
            AI Infra Builder
          </h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-wider">
            beta
          </span>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Icon
              name="MessageSquare"
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onGenerate()}
              placeholder="Опиши проект — например: SaaS на 10k юзеров"
              className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={onGenerate}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 text-xs uppercase tracking-wider rounded bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={14} className="animate-spin" />
                Думаю...
              </>
            ) : (
              <>
                <Icon name="Wand2" size={14} />
                Подобрать
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSuggest(s)}
              className="px-2 py-1 text-[11px] rounded border border-border bg-background hover:border-primary text-muted-foreground hover:text-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {!result && !loading && (
        <div className="p-8 text-center">
          <Icon
            name="Sparkles"
            size={32}
            className="mx-auto text-muted-foreground/40 mb-3"
          />
          <div className="text-sm text-muted-foreground">
            Опиши проект — AI построит архитектуру и подберёт провайдера
          </div>
        </div>
      )}

      {loading && (
        <div className="p-8 text-center">
          <Icon
            name="Loader2"
            size={32}
            className="mx-auto text-primary mb-3 animate-spin"
          />
          <div className="text-sm text-muted-foreground">
            GPT анализирует запрос, строю архитектуру...
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="p-5 space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider ${
                result.source === "llm"
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {result.source === "llm" ? "✨ GPT-4o-mini" : "rule-based"}
            </span>
            {error && (
              <span className="text-[10px] text-yellow-600 dark:text-yellow-400">
                {error}
              </span>
            )}
          </div>

          {result.summary && (
            <div className="p-3 rounded border border-primary/20 bg-primary/5 text-sm text-foreground/80 italic">
              "{result.summary}"
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded border border-border bg-background">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Тип
              </div>
              <div className="text-sm font-medium">
                {TYPE_LABEL[result.intent.type]}
              </div>
            </div>
            <div className="p-3 rounded border border-border bg-background">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Юзеров
              </div>
              <div className="text-sm font-mono">
                {result.intent.users.toLocaleString()}
              </div>
            </div>
            <div className="p-3 rounded border border-border bg-background">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Нагрузка
              </div>
              <div className="text-sm font-medium capitalize">
                {result.intent.workload}
              </div>
            </div>
            <div className="p-3 rounded border border-border bg-background">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Регион
              </div>
              <div className="text-sm font-medium">{result.intent.region}</div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Layers" size={14} className="text-primary" />
              <h4 className="text-xs uppercase tracking-widest font-medium">
                Архитектура
              </h4>
              <span className="text-xs text-muted-foreground">
                · {result.totals.cpu} CPU · {result.totals.ram} GB RAM ·{" "}
                {result.totals.storage} GB
                {result.totals.gpu && " · GPU"}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {result.architecture.map((c, i) => (
                <div
                  key={i}
                  className="p-3 rounded border border-border bg-background flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon
                      name={c.icon}
                      fallback="Box"
                      size={14}
                      className="text-primary"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground mb-1">
                      {c.role}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {c.cpu} CPU · {c.ram} GB · {c.storage} GB
                      {c.gpu && " · GPU"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Trophy" size={14} className="text-primary" />
              <h4 className="text-xs uppercase tracking-widest font-medium">
                Топ провайдеров
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {result.providers.slice(0, 3).map((p, i) => (
                <div
                  key={p.id}
                  className={`p-4 rounded border transition-colors ${
                    i === 0
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      #{i + 1}
                      {i === 0 && " ★ best"}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary">
                      {p.region}
                    </span>
                  </div>
                  <div className="font-medium mb-1">{p.name}</div>
                  <div className="font-mono text-lg text-primary mb-1">
                    {p.monthlyCost.toLocaleString()} ₽
                  </div>
                  <div className="text-[10px] text-muted-foreground mb-3">
                    {p.instances} × {p.price} ₽/мес
                  </div>
                  {p.matchReasons.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.matchReasons.map((r) => (
                        <span
                          key={r}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 w-full py-2 text-xs rounded border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  >
                    Deploy
                    <Icon name="ArrowUpRight" size={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-border">
            <button
              onClick={reset}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <Icon name="RotateCcw" size={12} />
              Сбросить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}