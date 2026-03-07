import { useEffect } from "react";
import { Header } from "@/components/providers/Header";
import { HeroSection } from "@/components/providers/HeroSection";
import { ProvidersSection } from "@/components/providers/ProvidersSection";
import { Footer } from "@/components/providers/Footer";
import { StructuredData as SEOStructuredData } from "@/components/SEO/StructuredData";
import { StructuredData } from "@/components/StructuredData";
import { OpenGraph } from "@/components/SEO/OpenGraph";
import { providers } from "@/data/providers";

const Index = () => {
  // ✅ Сброс прокрутки в начало при монтировании
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <OpenGraph />
      <SEOStructuredData type="organization" />
      <SEOStructuredData type="website" />
      <StructuredData type="website" />
      <Header />
      <main>
        <HeroSection />
        <ProvidersSection providers={providers} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
