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
      <section className="mb-10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
          <Icon name="Sparkles" size={12} />
          <span>AI · architecture · provider matching</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-3">
          AI подбирает облако
          <span className="text-primary"> под твой проект</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Опиши идею — система построит архитектуру, посчитает ресурсы и подберёт провайдера с ценой.
        </p>
      </section>

      <section className="mb-8">
        <AIBuilder />
      </section>

      {top && (
        <section className="mb-8 p-5 rounded-lg border border-primary/40 bg-primary/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-xs uppercase tracking-widest text-primary">
              ★ Top match
            </div>
            <div>
              <div className="font-medium">{top.name}</div>
              <div className="text-xs text-muted-foreground">
                {top.region} · {top.latency}ms · {top.price} ₽ · score {top.score}
              </div>
            </div>
          </div>
          <a
            href={top.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs rounded bg-primary text-primary-foreground hover:opacity-90"
          >
            Deploy →
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
          <div className="flex items-center justify-between">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
              Провайдеры ({filtered.length})
            </h2>
            <div className="flex gap-1 p-1 bg-card border border-border rounded">
              <button
                onClick={() => setView("table")}
                className={`px-3 py-1 text-xs rounded ${
                  view === "table"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <Icon name="Table" size={12} />
              </button>
              <button
                onClick={() => setView("cards")}
                className={`px-3 py-1 text-xs rounded ${
                  view === "cards"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
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