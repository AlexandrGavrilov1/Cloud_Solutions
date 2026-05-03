import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

export const HeroSection = () => {
  return (
    <section
      className="relative pt-12 pb-10 sm:pt-16 sm:pb-14 md:pt-20 md:pb-12 overflow-hidden border-b border-primary/30"
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      {/* glow blobs */}
      <div className="absolute top-0 left-0 w-full pointer-events-none z-0 h-full opacity-50">
        <div
          className="absolute left-[5%] top-0 w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full blur-[80px]"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--term-green)) 0%, hsl(var(--term-cyan)) 40%, transparent 70%)",
            transform: "translate(-30%, -50%)",
            opacity: 0.35,
          }}
        />
        <div
          className="absolute right-0 top-1/2 w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full blur-[80px]"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--term-pink)) 0%, hsl(var(--term-amber)) 40%, transparent 70%)",
            transform: "translate(30%, -50%)",
            opacity: 0.25,
          }}
        />
      </div>

      <div className="w-full px-4 3xl:px-[185px] relative z-10">
        {/* terminal header bar */}
        <div className="flex items-center gap-2 mb-6 max-w-3xl">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-destructive/80" />
            <span className="w-3 h-3 rounded-full bg-secondary/80" />
            <span className="w-3 h-3 rounded-full bg-primary/80" />
          </div>
          <span className="text-xs text-muted-foreground font-mono ml-2">
            ~/topvds — bash — 80×24
          </span>
        </div>

        {/* prompt line */}
        <div className="text-xs sm:text-sm text-muted-foreground font-mono mb-4">
          <span className="text-secondary">guest@topvds</span>
          <span className="text-foreground/60">:</span>
          <span className="text-accent">~</span>
          <span className="text-foreground/60">$ </span>
          <span className="text-foreground">./find_cloud --best</span>
        </div>

        <h1 className="font-mono text-[28px] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight font-bold max-w-6xl uppercase">
          <span className="block text-foreground/80">
            <span className="text-primary text-glow">&gt;</span> найди
          </span>
          <span className="block text-primary text-glow">идеальное_облако</span>
          <span className="block text-foreground/80">для.твоего_проекта</span>
          <span className="inline-block term-cursor text-primary text-glow" />
        </h1>

        <div className="mt-6 max-w-3xl text-base sm:text-lg text-muted-foreground font-mono leading-relaxed border-l-2 border-primary/40 pl-4">
          <span className="text-secondary">{">"} </span>
          сравни характеристики, цены и отзывы.
          <br />
          <span className="text-secondary">{">"} </span>
          выбери лучшее решение за пару минут.
          <span className="typing-dots text-primary" />
        </div>

        {/* stats */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-primary/30 bg-primary/5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">status:</span>
            <span className="text-primary text-glow">ONLINE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 border border-secondary/30 bg-secondary/5">
            <span className="text-muted-foreground">providers:</span>
            <span className="text-secondary">42</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 border border-accent/30 bg-accent/5">
            <span className="text-muted-foreground">latency:</span>
            <span className="text-glow-pink">12ms</span>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-8 flex flex-wrap gap-3">
          <Button
            className="font-mono uppercase tracking-widest h-12 px-8 text-sm bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-neon transition-all rounded-none border border-primary"
            onClick={() => {
              const providersSection = document.getElementById("providers");
              if (providersSection) {
                providersSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }}
          >
            <Icon name="ChevronRight" size={16} className="mr-1" />
            execute
          </Button>
          <Button
            variant="outline"
            className="font-mono uppercase tracking-widest h-12 px-6 text-sm border-primary/40 text-foreground hover:bg-primary/10 hover:border-primary rounded-none"
            onClick={() => {
              const aiSection = document.getElementById("ai-builder");
              if (aiSection) {
                aiSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <Icon name="Sparkles" size={14} className="mr-2" />
            ai_match
          </Button>
        </div>
      </div>
    </section>
  );
};
