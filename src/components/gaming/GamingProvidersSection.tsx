import { GamingProvider } from './types';
import { GamingProviderCard } from './GamingProviderCard';

interface GamingProvidersSectionProps {
  providers: GamingProvider[];
}

export const GamingProvidersSection = ({ providers }: GamingProvidersSectionProps) => {
  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Лучшие игровые хостинги
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Сравните провайдеров и выберите оптимальный вариант для вашего игрового сервера
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {providers.map((provider) => (
            <GamingProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </div>
    </section>
  );
};
