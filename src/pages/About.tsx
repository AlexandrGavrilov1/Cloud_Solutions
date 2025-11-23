import { Header } from '@/components/providers/Header';
import { AboutSection } from '@/components/about/AboutSection';
import { Footer } from '@/components/providers/Footer';
import { OpenGraph } from '@/components/SEO/OpenGraph';
import { StructuredData } from '@/components/SEO/StructuredData';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <OpenGraph 
        title="О проекте TopCloudHub — Независимый рейтинг VPS провайдеров"
        description="Независимая платформа для сравнения VPS хостинг провайдеров. Актуальные цены, реальные отзывы, uptime статистика и помощь в выборе."
        url="https://topcloudhub.ru/about"
      />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Главная', url: 'https://topcloudhub.ru' },
          { name: 'О проекте', url: 'https://topcloudhub.ru/about' }
        ]} 
      />
      <Header />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default About;