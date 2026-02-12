import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { MatrixWord } from "./MatrixWord";
import { MatrixSuffix } from "./MatrixSuffix";
import { useLanguage } from "@/contexts/LanguageContext";

export const HeroSection = () => {
  const { t, language } = useLanguage();

  return (
    <section
      className="relative py-24"
      style={{
        background:
          "linear-gradient(90deg, #FFD9B3 0%, #FFE4CC 25%, #FFF0E6 50%, #FFF9F2 75%, #FFFDF9 100%)",
      }}
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      {/* ========== ПЯТНО НАД СЛОВОМ «НАЙДИ» ========== */}
      <div
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{ zIndex: 1, height: "650px" }}
      >
        <div
          className="absolute left-[5%] top-0 w-[800px] h-[800px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, #FF931F 0%, #FF8000 25%, #FFB366 45%, rgba(255, 147, 31, 0.4) 70%, transparent 90%)",
            filter: "blur(90px)",
            transform: "translate(-20%, -40%)",
            opacity: 0.9,
          }}
        />
      </div>

      {/* ========== ПЯТНО У ПРАВОЙ ГРАНИЦЫ ========== */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 70% 50%, #FF931F 0%, #FF8000 25%, #FFB366 45%, rgba(255, 147, 31, 0.35) 70%, transparent 90%)",
            filter: "blur(80px)",
            transform: "translate(20%, -50%)",
            opacity: 0.9,
          }}
        />
      </div>

      {/* Контент — поверх пятен */}
      <div className="w-full px-4 lg:px-8 relative z-10">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight font-bold max-w-4xl"
          style={{
            fontFamily: "'TT Travels Next Trl', sans-serif",
            fontWeight: 700,
          }}
        >
          <span className="block text-[#2B3038]">НАЙДИ</span>
          <span className="block text-[#FF931F]">ИДЕАЛЬНОЕ ОБЛАКО</span>
          <span className="block text-[#2B3038]">ДЛЯ СВОЕГО ПРОЕКТА</span>
        </h1>

        <p
          className="text-xl md:text-2xl text-[#2B3038] max-w-2xl leading-relaxed mt-4"
          style={{ fontFamily: "'TT Travels Next Trl', sans-serif" }}
        >
          Сравни характеристики, цены и отзывы. Выбери лучшее решение за пару
          минут
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
    </section>
  );
};
