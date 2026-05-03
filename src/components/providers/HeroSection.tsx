import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

export const HeroSection = () => {
  return (
    <section
      className="relative pt-20 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24 overflow-hidden"
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      {/* subtle radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-70 dark:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--brand-purple) / 0.15), transparent)",
        }}
      />
      {/* grid background */}
      <div className="absolute inset-0 grid-bg opacity-50 dark:opacity-30 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      <div className="w-full px-4 3xl:px-[185px] relative z-10 max-w-6xl mx-auto">
        {/* announcement pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/50 backdrop-blur-sm text-xs text-muted-foreground mb-8 hover:border-foreground/20 transition-colors cursor-pointer">
          <span className="text-foreground font-medium">New</span>
          <span className="w-px h-3 bg-border" />
          <span>AI-подбор облака · бета</span>
          <Icon name="ArrowRight" size={12} />
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05] max-w-4xl">
          <span className="block text-foreground">Найди идеальное облако</span>
          <span className="block gradient-text">для своего проекта.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Сравни характеристики, цены и отзывы. Выбери лучшее решение за пару
          минут — без таблиц и звонков менеджерам.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button
            size="lg"
            className="h-11 px-6 text-sm font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-all"
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
            Подобрать провайдера
            <Icon name="ArrowRight" size={14} className="ml-1" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 px-6 text-sm font-medium rounded-lg border-border text-foreground hover:bg-secondary"
            onClick={() => {
              const aiSection = document.getElementById("ai-builder");
              if (aiSection) {
                aiSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <Icon name="Sparkles" size={14} className="mr-1" />
            Попробовать AI
          </Button>
        </div>

        {/* trust strip */}
        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>42 провайдера</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Star" size={12} className="text-foreground/60" />
            <span>1.2k+ отзывов</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Zap" size={12} className="text-foreground/60" />
            <span>Обновляется ежедневно</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Shield" size={12} className="text-foreground/60" />
            <span>Без скрытых комиссий</span>
          </div>
        </div>
      </div>
    </section>
  );
};