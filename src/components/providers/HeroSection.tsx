import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { MatrixWord } from "./MatrixWord";
import { MatrixSuffix } from "./MatrixSuffix";
import { useLanguage } from "@/contexts/LanguageContext";

export const HeroSection = () => {
  const { t, language } = useLanguage();

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FF931F 0%, #FFB366 25%, #FFC999 50%, #FFE4CC 75%, #FFF5EB 100%)'
      }}
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight" style={{ fontFamily: "'TT Travels Next Trl', sans-serif", fontWeight: 64 }}>
            <span className="block text-[#FF931F]">НАЙДИ</span>
            <span className="block text-[#2B3038]">ИДЕАЛЬНОЕ ОБЛАКО</span>
            <span className="block text-[#FF931F]">ДЛЯ СВОЕГО ПРОЕКТА</span>
          </h1>

          <p className="text-xl md:text-2xl text-[#2B3038] max-w-2xl leading-relaxed">
            Сравни характеристики, цены и отзывы. Выбери лучшее решение<br />за пару минут
          </p>

          <div className="pt-4">
            <Button
              size="lg"
              className="h-16 px-12 text-lg font-bold bg-[#FF931F] hover:bg-[#FF8000] text-white shadow-xl rounded-full transition-all"
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
              ВЫБРАТЬ
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};