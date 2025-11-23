import { Header } from '@/components/providers/Header';
import { HeroSection } from '@/components/providers/HeroSection';
import { ProvidersSection } from '@/components/providers/ProvidersSection';
import { GuideSection } from '@/components/providers/GuideSection';
import { Footer } from '@/components/providers/Footer';
import { StructuredData } from '@/components/SEO/StructuredData';
import { providers } from '@/data/providers';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <StructuredData type="organization" />
      <StructuredData type="website" />
      <Header />
      <main>
        <HeroSection />
        <ProvidersSection providers={providers} />
        <GuideSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;