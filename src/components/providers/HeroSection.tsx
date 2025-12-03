import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { MatrixWord } from "./MatrixWord";
import { MatrixSuffix } from "./MatrixSuffix";
import { useLanguage } from "@/contexts/LanguageContext";

export const HeroSection = () => {
  const { t, language } = useLanguage();

  return (
    <section
      className="relative pt-20 pb-32 overflow-hidden"
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px]"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-accent border border-primary/30 rounded-full px-5 py-2.5">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-neon"></div>
            <span className="text-sm font-bold text-primary">
              {t("hero.badge")}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] tracking-tight">
            <span className="block text-foreground">{t("hero.title1")} </span>
            <span className="block text-white">
              {t("hero.title2")}
              {language === "ru" && <MatrixSuffix />} <MatrixWord />
            </span>
            <span className="block text-foreground">{t("hero.title3")}</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            {t("hero.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="h-14 px-8 text-base font-bold bg-primary text-background shadow-xl shadow-primary/30 hover:shadow-neon transition-all group rounded-xl"
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
              {t("hero.viewRating")}
              <Icon
                name="ArrowRight"
                size={20}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base font-bold border-2 border-border rounded-xl hover:bg-accent hover:border-primary/30 transition-all"
              onClick={() => {
                const guideSection = document.getElementById("guide");
                if (guideSection) {
                  guideSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            >
              <Icon name="Lightbulb" size={18} className="mr-2" />
              {t("hero.howToChoose")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
