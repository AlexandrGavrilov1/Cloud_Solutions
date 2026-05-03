import { useEffect } from "react";
import { Header } from "@/components/providers/Header";
import { AboutSection } from "@/components/about/AboutSection";
import { Footer } from "@/components/providers/Footer";
import { OpenGraph } from "@/components/SEO/OpenGraph";
import { StructuredData } from "@/components/SEO/StructuredData";

const About = () => {
  // ✅ Сброс прокрутки в начало при монтировании
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <OpenGraph
        title="О проекте top-vds — Независимый рейтинг VPS провайдеров"
        description="Независимая платформа для сравнения VPS хостинг провайдеров. Актуальные цены, реальные отзывы, uptime статистика и помощь в выборе."
        url="https://top-vds.ru/about"
      />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Главная", url: "https://top-vds.ru" },
          { name: "О проекте", url: "https://top-vds.ru/about" },
        ]}
      />
      <Header />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default About;