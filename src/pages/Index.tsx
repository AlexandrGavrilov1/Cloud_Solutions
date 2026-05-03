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
      <section className="mb-10 font-mono">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span className="text-primary">●</span>
          <span className="text-secondary">~/topvds</span>
          <span className="text-foreground/40">$</span>
          <span className="uppercase tracking-widest">
            ai · architecture · provider_matching
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 uppercase">
          <span className="text-primary text-glow">&gt;</span> ai_подбирает_облако
          <br />
          <span className="text-secondary text-glow-amber">--target=твой_проект</span>
          <span className="inline-block term-cursor" />
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm border-l-2 border-primary/40 pl-3 mt-4">
          <span className="text-secondary"># </span>
          Опиши идею — система построит архитектуру, посчитает ресурсы и
          подберёт провайдера с ценой.
        </p>
      </section>

      <section className="mb-8" id="ai-builder">
        <AIBuilder />
      </section>

      {top && (
        <section className="mb-8 p-5 glass-effect flex items-center justify-between gap-4 font-mono shadow-neon">
          <div className="flex items-center gap-4">
            <div className="text-xs uppercase tracking-widest text-primary text-glow">
              ★ TOP_MATCH
            </div>
            <div>
              <div className="font-bold uppercase tracking-wider">
                {top.name}
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="text-secondary">{top.region}</span>
                <span className="mx-1">::</span>
                {top.latency}ms
                <span className="mx-1">::</span>
                <span className="text-secondary">{top.price}₽</span>
                <span className="mx-1">::</span>score=
                <span className="text-primary">{top.score}</span>
              </div>
            </div>
          </div>
          <a
            href={top.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs uppercase tracking-widest border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          >
            ./deploy →
          </a>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
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
          <div className="flex items-center justify-between font-mono">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
              <span className="text-primary">[</span>
              providers
              <span className="text-foreground/40">::</span>
              <span className="text-secondary">{filtered.length}</span>
              <span className="text-primary">]</span>
            </h2>
            <div className="flex gap-1 p-1 bg-card border border-primary/30">
              <button
                onClick={() => setView("table")}
                className={`px-3 py-1 text-xs ${
                  view === "table"
                    ? "bg-primary text-primary-foreground shadow-neon"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Icon name="Table" size={12} />
              </button>
              <button
                onClick={() => setView("cards")}
                className={`px-3 py-1 text-xs ${
                  view === "cards"
                    ? "bg-primary text-primary-foreground shadow-neon"
                    : "text-muted-foreground hover:text-primary"
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