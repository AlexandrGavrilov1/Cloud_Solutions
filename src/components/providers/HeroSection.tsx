import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { MatrixWord } from "./MatrixWord";
import { MatrixSuffix } from "./MatrixSuffix";
import { useLanguage } from "@/contexts/LanguageContext";

export const HeroSection = () => {
  const { t, language } = useLanguage();

  return (
    <section
      className="relative py-16 sm:py-20 md:py-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, #FFD9B3 0%, #FFE4CC 25%, #FFF0E6 50%, #FFF9F2 75%, #FFFDF9 100%)",
      }}
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      {/* ======= ПЯТНО НАД СЛОВОМ «НАЙДИ» ======= */}
      <div className="absolute top-0 left-0 w-full pointer-events-none z-1 h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px]">
        <div
          className="absolute left-[5%] top-0 
               w-[200px] sm:w-[300px] md:w-[400px] lg:w-[500px] xl:w-[600px] 2xl:w-[700px]
               h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]
               rounded-full
               blur-[40px] sm:blur-[50px] md:blur-[60px] lg:blur-[70px] xl:blur-[80px] 2xl:blur-[90px]
               opacity-65"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, #FF931F 0%, #FF8000 25%, #FFB366 45%, rgba(255, 147, 31, 0.4) 70%, transparent 90%)",
            transform: "translate(-10%, -35%)",
          }}
        />
      </div>

      {/* ====== ПЯТНО У ПРАВОЙ ГРАНИЦЫ ====== */}
      <div
        className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-1
             right-0 sm:right-[1%] md:right-[2%] lg:right-[3%] xl:right-[4%] 2xl:right-[5%]
             w-[350px] sm:w-[450px] md:w-[500px] lg:w-[600px] xl:w-[700px] 2xl:w-[800px]
             h-[350px] sm:h-[450px] md:h-[500px] lg:h-[600px] xl:h-[700px] 2xl:h-[800px]"
      >
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 
                     w-full h-full
                     rounded-full
                     blur-[60px] sm:blur-[70px] md:blur-[80px] lg:blur-[90px] xl:blur-[100px] 2xl:blur-[110px]
                     opacity-70"
          style={{
            background:
              "radial-gradient(circle at 70% 50%, #FF931F 0%, #FF8000 25%, #FFB366 45%, rgba(255, 147, 31, 0.35) 70%, transparent 90%)",
            transform: "translate(20%, -50%)",
          }}
        />
      </div>

      {/* Контент — поверх пятен */}
      <div className="w-full px-4 3xl:px-[185px] relative z-10">
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight font-bold max-w-6xl">
          <span className="block text-[#2B3038]">НАЙДИ</span>
          <span className="block text-[#FF931F]">ИДЕАЛЬНОЕ ОБЛАКО</span>
          <span className="block text-[#2B3038]">ДЛЯ СВОЕГО ПРОЕКТА</span>
        </h1>

        <p className="text-[24px] text-[#2B3038] max-w-2xl leading-relaxed mt-4">
          Сравни характеристики, цены и отзывы. Выбери лучшее решение
          за&nbsp;пару&nbsp;минут
        </p>

        <div className="pt-4">
          <Button
            className="h-[1.7cm] w-[6.5cm] text-[17px] font-medium bg-[#FF931F] hover:bg-[#FF8000] text-white shadow-xl rounded-full transition-all"
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
    </section>
  );
};
