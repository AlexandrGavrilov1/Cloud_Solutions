import { useEffect } from "react";
import Layout from "@/components/tool/Layout";
import Filters from "@/components/tool/Filters";
import Table from "@/components/tool/Table";
import AIBuilder from "@/components/tool/AIBuilder";
import ProviderCard from "@/components/tool/ProviderCard";
import { useProviders } from "@/hooks/useProviders";
import Icon from "@/components/ui/icon";
import { useState } from "react";

const Index = () => {
  const { filters, setFilter, toggleFeature, reset, filtered } = useProviders();
  const [view, setView] = useState<"table" | "cards">("table");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const top = filtered[0];

  return (
    <Layout>
      <section className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/50 text-xs text-muted-foreground mb-6">
          <Icon name="Sparkles" size={12} className="text-foreground" />
          <span>AI · Architecture · Provider matching</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-4">
          <span className="block text-foreground">AI подбирает облако</span>
          <span className="block gradient-text">под твой проект.</span>
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          Опиши идею — система построит архитектуру, посчитает ресурсы и
          подберёт провайдера с ценой.
        </p>
      </section>

      <section className="mb-10" id="ai-builder">
        <AIBuilder />
      </section>

      {top && (
        <section className="mb-10 p-5 rounded-xl border border-border bg-card flex items-center justify-between gap-4 hover:border-foreground/20 transition-colors">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground/5 border border-border text-xs">
              <Icon
                name="Sparkles"
                size={11}
                className="text-foreground"
              />
              <span className="text-foreground font-medium">Top match</span>
            </div>
            <div>
              <div className="font-semibold text-foreground tracking-tight">
                {top.name}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                <span>{top.region}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{top.latency}ms</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="tabular-nums">{top.price} ₽</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>
                  Score{" "}
                  <span className="text-foreground tabular-nums">
                    {top.score}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <a
            href={top.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-foreground text-background hover:bg-foreground/90 transition-all"
          >
            Перейти
            <Icon name="ArrowUpRight" size={14} />
          </a>
        </section>
      )}

      <div
        id="providers"
        className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8"
      >
        <aside>
          <Filters
            filters={filters}
            setFilter={setFilter}
            toggleFeature={toggleFeature}
            reset={reset}
            count={filtered.length}
          />
        </aside>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground">
              Провайдеры{" "}
              <span className="text-foreground tabular-nums">
                {filtered.length}
              </span>
            </h2>
            <div className="flex gap-1 p-0.5 bg-secondary rounded-md">
              <button
                onClick={() => setView("table")}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  view === "table"
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon name="Table" size={12} />
              </button>
              <button
                onClick={() => setView("cards")}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  view === "cards"
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon name="LayoutGrid" size={12} />
              </button>
            </div>
          </div>

          {view === "table" ? (
            <Table data={filtered} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <ProviderCard key={p.id} provider={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
