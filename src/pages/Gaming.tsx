import { useEffect } from "react";
import { Header } from "@/components/providers/Header";
import { Footer } from "@/components/providers/Footer";
import { GamingHeroSection } from "@/components/gaming/GamingHeroSection";
import { GamingProvidersSection } from "@/components/gaming/GamingProvidersSection";
import { GamingFeaturesSection } from "@/components/gaming/GamingFeaturesSection";
import { gamingProviders } from "@/data/gamingProviders";
import { OpenGraph } from "@/components/SEO/OpenGraph";

const Gaming = () => {
  // ✅ Сброс прокрутки в начало при монтировании
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <OpenGraph
        title="Игровой хостинг - Лучшие серверы для Minecraft, CS:GO, Rust"
        description="Сравнение игровых хостингов с DDoS защитой, NVMe дисками и поддержкой 24/7. Быстрый запуск серверов Minecraft, CS:GO, Rust, ARK."
      />
      <Header />
      <main>
        <GamingHeroSection />
        <GamingProvidersSection providers={gamingProviders} />
        <GamingFeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Gaming;
