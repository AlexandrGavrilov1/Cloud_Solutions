import { Header } from '@/components/providers/Header';
import { HeroSection } from '@/components/providers/HeroSection';
import { ProvidersSection } from '@/components/providers/ProvidersSection';
import { GuideSection } from '@/components/providers/GuideSection';
import { Footer } from '@/components/providers/Footer';
import { StructuredData as SEOStructuredData } from '@/components/SEO/StructuredData';
import { StructuredData } from '@/components/StructuredData';
import { OpenGraph } from '@/components/SEO/OpenGraph';
import { providers } from '@/data/providers';

const Index = () => {
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
        <GuideSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;